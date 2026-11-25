import { InstanceBase, InstanceStatus, createModuleLogger, type SomeCompanionConfigField } from '@companion-module/base'
import { getActions } from './actions.js'
import { PlayerApi, type PlayerState } from './api.js'
import { type Config, defaultConfig, getConfigFields } from './config.js'
import { getFeedbacks } from './feedbacks.js'
import { getPresetDefinitions, presetStructure } from './presets.js'
import type { PlayerTypes } from './types.js'
import { upgradeScripts } from './upgrades.js'
import { variableDefinitions, variableValues } from './variables.js'

const log = createModuleLogger('Main')

/**
 * Companion connection for Presentation Player.
 * Follows the app's state live over its event stream and sends commands to its HTTP API.
 */
export default class PresentationPlayerInstance extends InstanceBase<PlayerTypes> {
	config: Config = defaultConfig()
	/** The latest state from the app, or null while disconnected. */
	state: PlayerState | null = null
	#api: PlayerApi | null = null
	#connected = false

	async init(config: Config): Promise<void> {
		this.config = config
		this.setActionDefinitions(getActions(this))
		this.setFeedbackDefinitions(getFeedbacks(this))
		this.setVariableDefinitions(variableDefinitions)
		this.#updatePresets()
		this.#publish()
		this.#connect()
	}

	async configUpdated(config: Config): Promise<void> {
		this.config = config
		this.#updatePresets() // the connection label (used in preset text) may have changed
		this.#connect()
	}

	async destroy(): Promise<void> {
		this.#api?.stop()
		this.#api = null
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return getConfigFields()
	}

	/** Sends a command to the app, e.g. `next` or `video/toggle`. */
	async sendCommand(path: string, body?: unknown): Promise<void> {
		if (!this.#api) throw new Error('Not configured')
		await this.#api.command(path, body)
	}

	#connect(): void {
		this.#api?.stop()
		this.#api = null
		this.#setDisconnected()

		const host = (this.config.host ?? '').trim()
		const port = Number(this.config.port)
		if (!host || !Number.isInteger(port) || port < 1 || port > 65535) {
			this.updateStatus(InstanceStatus.BadConfig, 'Set the host and port of the PC running the app')
			return
		}

		this.updateStatus(InstanceStatus.Connecting)
		this.#api = new PlayerApi(host, port, {
			connected: () => {
				log.info(`Connected to ${host}:${port}`)
				this.#connected = true
				this.updateStatus(InstanceStatus.Ok)
			},
			disconnected: (reason) => {
				if (this.#connected) log.warn(`Lost connection to the app: ${reason}`)
				this.#setDisconnected()
				this.updateStatus(InstanceStatus.ConnectionFailure, reason)
			},
			state: (state) => {
				const hadNdiError = !!this.state?.ndiError
				this.state = state
				this.#publish()
				if (state.ndiError) this.updateStatus(InstanceStatus.UnknownWarning, `App reports: ${state.ndiError}`)
				else if (hadNdiError) this.updateStatus(InstanceStatus.Ok)
			},
		})
		this.#api.start()
	}

	#setDisconnected(): void {
		const changed = this.#connected || this.state !== null
		this.#connected = false
		this.state = null
		if (changed) this.#publish()
	}

	/** Pushes the current state to variables and feedbacks. */
	#publish(): void {
		this.setVariableValues(variableValues(this.state, this.#connected))
		this.checkAllFeedbacks()
	}

	#updatePresets(): void {
		this.setPresetDefinitions(presetStructure, getPresetDefinitions(this.label))
	}
}

export const UpgradeScripts = upgradeScripts
