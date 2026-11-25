# companion-module-neriftafu-presentationplayer

A [Bitfocus Companion](https://bitfocus.io/companion) module for [Presentation Player](https://github.com/internal-events-support/presentation-player), the Windows app that sends a Google Slides deck to NDI as live slides plus a presenter view with speaker notes.

The app used to be called Google Slides NDI Presenter, and so did this module before 2.0.0. Older versions of the app still work. Connections made with the old module don't move over by themselves: after importing this one, edit the connection and choose **neriftafu: Presentation Player** as its module version. Its actions, feedbacks, variables and presets stay as they are.

With it you can run the deck from a Stream Deck: next and previous, jump to slides, play videos, change the speaker notes, open and close decks, and see the state of everything on the buttons. See [companion/HELP.md](companion/HELP.md) for the full list of actions, feedbacks, variables and presets.

The module follows the app's state over its event stream (`/api/events`) rather than polling, so buttons update straight away. Commands go to the app's HTTP API.

## Installing

Download the `.tgz` package from the latest [release](https://github.com/internal-events-support/companion-module-neriftafu-presentationplayer/releases), then in Companion go to **Modules → Import module package** and pick that file. Add a "Presentation Player" connection and enter the address and port of the PC running the app.

## Development

You need Node 22 and Yarn (via `corepack enable`).

```bash
yarn install
yarn build        # type-check and compile to dist/
yarn dev          # rebuild on change
yarn lint
yarn companion-module-build   # package into a .tgz you can load into Companion
```

To try it in Companion, point Companion's developer modules folder at the folder that contains this one, then add a "Presentation Player" connection.

Layout:

- `src/index.ts` is the connection instance: lifecycle, status, and wiring state into variables and feedbacks.
- `src/api.ts` is the HTTP client and the event stream reader, with automatic reconnects.
- `src/actions.ts`, `src/feedbacks.ts`, `src/variables.ts` and `src/presets.ts` hold the definitions.
- `src/upgrades.ts` is for upgrade scripts. Add one whenever an action or feedback id, or its options, change.

## Releasing

Publish a release on GitHub with a tag like `v2.0.0`. The Release workflow packages the module with that version and attaches the `.tgz` to the release. If a package ever needs rebuilding, run the workflow by hand from the Actions tab and give it the tag.

## License

MIT
