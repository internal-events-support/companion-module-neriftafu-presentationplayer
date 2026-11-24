## Presentation Player

Controls [Presentation Player](https://github.com/internal-events-support/google-slides-ndi-presenter), the Windows app that sends a Google Slides deck to NDI as live slides plus a presenter view with speaker notes.

### Setting up

1. Run the app on the presentation PC.
2. In this connection, enter that PC's address (`127.0.0.1` if Companion runs on the same machine) and the app's remote control port, which is **8080** unless you changed it.
3. If Companion is on a different machine, open the app's **Settings** and make sure **Allow other devices** is on. Windows may also ask you to allow the app through the firewall.

The connection follows the app live, so feedbacks and variables update as soon as anything changes, including when someone presses a button in the app itself.

### Actions

| Action                    | What it does                                                                                                                                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next / Previous           | Steps through animation builds, then slides, the same as a clicker                                                                                                                                                                          |
| Go to slide               | Jumps to a slide number (variables allowed). A skipped slide goes to the next one that's shown                                                                                                                                              |
| Go to first or last slide | The first or last slide that isn't skipped                                                                                                                                                                                                  |
| Open presentation         | Opens a deck from its share link. It must be shared as "Anyone with the link can view", or with the Google account the app is signed in to. For a master deck (app 1.7.0 and later) put `master:` and its name, e.g. `master:Day 1 plenary` |
| Refresh presentation      | Pulls in edits made in Google Slides, staying on the current slide                                                                                                                                                                          |
| Close presentation        | Both NDI outputs go to the holding screen                                                                                                                                                                                                   |
| Video or audio            | Play / pause, play, pause, or back to the start, for the video or audio on the slide                                                                                                                                                        |
| Notes text size           | Bigger, smaller, or a set size. Changing the size turns auto-fit off                                                                                                                                                                        |
| Notes auto-fit            | Toggle, on or off                                                                                                                                                                                                                           |
| Notes scroll              | Down, up, or back to the top                                                                                                                                                                                                                |

### Feedbacks

Presentation is open · Presentation is loading · Presentation updated in Google Slides · Current slide is… · On the first slide · On the last slide · Current slide has video or audio · Video or audio is playing · Notes auto-fit is on · Notes can scroll (up/down) · NDI output has receivers · Google sign-in needed

### Variables

| Variable                                                                                                                  |                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `$(presentationplayer:title)`                                                                                             | Presentation title                                                                        |
| `$(presentationplayer:slide)` / `$(presentationplayer:slide_count)`                                                       | Current slide and total. From app 1.7.0 these count skipped slides, as Google Slides does |
| `$(presentationplayer:next_slide)`                                                                                        | Next slide that's shown, empty on the last one                                            |
| `$(presentationplayer:slides_remaining)`                                                                                  | Slides left after this one, not counting skipped ones                                     |
| `$(presentationplayer:skipped_count)`                                                                                     | Number of skipped slides                                                                  |
| `$(presentationplayer:google_expired)`                                                                                    | true when the app needs signing in to Google again                                        |
| `$(presentationplayer:loading)`                                                                                           | true while a deck is opening or refreshing                                                |
| `$(presentationplayer:out_of_date)`                                                                                       | true when the deck has been edited in Google Slides since it was loaded                   |
| `$(presentationplayer:notes_size)` / `$(presentationplayer:notes_autofit)`                                                | Notes text size in px, and whether auto-fit is on                                         |
| `$(presentationplayer:video)` / `$(presentationplayer:video_state)` / `$(presentationplayer:video_quality)`               | Whether the slide has video or audio, its state, and the video's quality (e.g. 720p)      |
| `$(presentationplayer:media_kind)`                                                                                        | `video`, `audio`, or empty                                                                |
| `$(presentationplayer:media_position)` / `$(presentationplayer:media_duration)` / `$(presentationplayer:media_remaining)` | Position, length and time left, e.g. 0:42 / 3:34 / 2:52                                   |
| `$(presentationplayer:slides_receivers)` / `$(presentationplayer:notes_receivers)`                                        | NDI receivers watching each output                                                        |
| `$(presentationplayer:slides_ndi_name)` / `$(presentationplayer:notes_ndi_name)`                                          | NDI names of the outputs                                                                  |
| `$(presentationplayer:connected)`                                                                                         | Whether Companion can reach the app                                                       |

Replace `presentationplayer` with your connection's label if it's different. Connections made before 2.0.0 keep the label they had, such as `gslides-ndi`.

### Presets

Ready-made buttons for navigation (with a slide counter), "go to slide 1–24", video, speaker notes, the presentation title, refresh, close, and receiver status for each output. The Refresh preset turns amber and reads UPDATED when someone has edited the deck in Google Slides since it was loaded (the app checks every 30 seconds), so you know a refresh will pick up changes. The Close preset needs a one-second hold so a stray tap can't take the deck off air.
