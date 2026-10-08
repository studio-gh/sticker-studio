# Sticker Studio — V8

Mobile-first editor refinement focused on the core creation experience.

## What changed

- Direct manipulation improved: drag, resize and rotate now use the selected object's actual bounds.
- Resize handle enlarged for touch screens.
- Rotation snaps softly to 15° increments.
- Snap guides added for canvas center and alignment with other objects.
- Text alignment: left / center / right.
- Text input is now a multiline textarea. Enter creates a new line.
- Text editing no longer rebuilds the whole editor on every keystroke.
- Photo imports are resized/compressed to a mobile-friendly maximum of 1600px before entering the editor.
- Photo import shows a visible processing state instead of appearing to do nothing.
- Export now renders a transparent PNG and automatically crops to the visible artwork with a small safety margin.
- Export is better suited for Instagram Stories, WhatsApp and Telegram because it no longer ships a large empty square canvas around the sticker.
- Existing undo/redo, layers, background removal, outline, shadow, copy and share remain.

## MVP notes

No login, backend, payments or AI are required. The app remains a static GitHub Pages build.


## V9 performance pass
- Photo imports: max 1200px and WebP/JPEG compression for faster editing.
- History snapshots no longer duplicate full image data.
- Image outline preview/export uses 8 filtered shadows instead of 16-20 repeated image draws.
- Background removal preprocesses photos to max 1024px.
- Crop ratios now include horizontal/vertical crop positioning.
- Export waits for image decode and renders all visible layers into a transparent, tightly cropped PNG.
