# Sticker Studio V9.7 — Gesture & Geometry Fix

This build fixes the canvas coordinate model so object movement, dimensions, and scale use one consistent 500-unit design space across responsive screens.

- Dragging the body of an image or text moves position only.
- Image width/height and text font/box width scale with the responsive canvas, not by scaling the entire layer to match the viewport.
- Image size can be adjusted with the Scale control or the dedicated black corner handle.
- Image crop positioning remains a separate mode/control from moving the image layer.
- Keeps the existing V9.6 crop, outline, export, and performance features.

Replace the files in the repository with the files in this ZIP. Test on-device before treating touch interactions as verified; JavaScript syntax has been checked, but no real-device touch test was available here.
