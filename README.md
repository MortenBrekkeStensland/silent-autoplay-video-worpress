  # Silent Autoplay Video                                                       
   
  A WordPress Gutenberg block for muted autoplay videos with an automatic Safari
   canvas fallback.                                         

  ## The Problem

  Safari on macOS blocks `<video autoplay>` even when the video is muted, on
  domains without sufficient user engagement. This results in a static frame or
  a play button instead of the expected autoplay behavior.

  ## The Solution

  This plugin provides a custom Gutenberg block that:

  1. Renders a muted, autoplaying `<video>` element (works in Chrome, Firefox,
  Edge)
  2. If the browser blocks autoplay (Safari), automatically falls back to
  rendering video frames onto a `<canvas>` element — bypassing the autoplay
  policy entirely
  3. Once the user interacts with the page (click, scroll, touch), seamlessly
  switches back to native video playback

  ## Features

  - **No build step** — plain JavaScript, no Node.js or npm required
  - **Gutenberg block** — appears under the Media category in the block inserter
  - **Media Library integration** — select videos and poster images from the
  WordPress media library
  - **Configurable** — loop toggle, max width, and poster image via the block
  sidebar
  - **Lightweight** — frontend script only loads on pages that use the block
  - **Always hardcoded**: `muted`, `autoplay`, `playsinline`, `preload="auto"`,
  no controls

  ## Installation

  1. Download or clone this repository
  2. Copy the `silent-autoplay-video` folder to `wp-content/plugins/`
  3. Activate the plugin in **Plugins** in the WordPress admin
  4. Insert the **"Silent Autoplay Video"** block in the editor

  Alternatively, zip the folder and install via **Plugins > Add New > Upload
  Plugin**.

  ## Block Settings

  | Setting     | Default | Description                          |
  |-------------|---------|--------------------------------------|
  | Loop        | On      | Whether the video loops continuously |
  | Max Width   | 100%    | CSS max-width on the video wrapper   |
  | Poster      | None    | Optional poster image from media library |

  ## How It Works

  The frontend script (`frontend.js`) runs on pages containing the block:

  1. Attempts native `video.play()`
  2. If the promise resolves — done, the `<canvas>` stays hidden
  3. If the promise rejects (autoplay blocked):
     - Hides the video visually (keeps it in the DOM as a frame source)
     - Shows the canvas and manually advances `video.currentTime` at ~30fps
     - Draws each frame onto the canvas with `drawImage()`
     - On first user interaction, clears the canvas loop and restores native
  playback

  ## Requirements

  - WordPress 6.0+
  - PHP 7.4+

  ## License

  GPL-2.0-or-lat
