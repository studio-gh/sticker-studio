# Sticker Studio V2

A mobile-first sticker editor for creating, composing and exporting stickers.

## V2 editor

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
