# Sticker Studio V2.1

A mobile-first sticker editor for creating, composing and exporting stickers.

## V2.1 editor

- Paste an image from clipboard
- Upload a photo
- In-browser AI background removal
- Multiple text layers
- Multiple image layers
- Drag layers directly on canvas
- Layer ordering
- Opacity
- Scale
- Rotation
- Color
- Six font styles
- PNG export
- Local browser storage for saved items

### Background removal

The editor uses `@imgly/background-removal` in the browser. The first removal downloads the model, so the first run can be slower. Images are processed locally in the browser.

## GitHub Pages

Upload the files to the repository root and commit to `main`.

Settings → Pages → Deploy from a branch → `main` → `/ (root)`.

Expected URL:

https://studio-gh.github.io/sticker-studio/

- `favicon.svg` → browser tab favicon

## V3 text design

- Letter spacing
- Line height
- Adjustable outline width and color
- Drop shadow with blur, offset and color
- Curved text
- Highlight block behind text with color, opacity, padding and radius
- PNG export includes V3 text effects

## V4 mobile-first editor

The mobile editor keeps the live canvas visible while the controls scroll underneath it. Desktop remains a side-by-side canvas + properties layout.

## V5 editing utilities

- Undo button
- Cmd/Ctrl+Z keyboard shortcut
- HEX color input
- Browser EyeDropper color sampling
- Custom color controls for text, outline, shadow and highlight

## V6 media and zoom

- Preserves image aspect ratio in PNG export
- Quick zoom controls for the selected layer
- Mobile-friendly zoom slider
- Text preview is constrained to the canvas width

## V7 product upgrade

- Direct move, resize, rotate and two-finger gesture editing
- Undo + Redo
- Autosaved draft
- Crop aspect presets and Fit/Fill
- Sticker outline + shadow for photo layers
- Text and sticker quick styles
- Duplicate, hide, lock and reorder layers
- Copy PNG and native Share when supported
- HEIC/HEIF conversion attempt in-browser
- Stickerize flow
- Existing text effects, HEX colors, eyedropper and background removal retained

## V7.1 stability hotfix

- Switched the editor runtime from module script to classic script for broader compatibility with inline controls.
- Hardened localStorage parsing so stale/corrupt saved data cannot kill the app on startup.
- Added boot and runtime error handling.
- No product features were changed.
