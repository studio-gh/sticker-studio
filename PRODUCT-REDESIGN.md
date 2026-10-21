# Sticker Studio — Product Redesign Brief

**Positioning:** Make your Stories stand out.  
**Product promise:** Help people create more attention-worthy Instagram Stories using expressive typography, cutout photos, outlines, and graphic shapes, without learning a full design tool.

## Product principles
- Lead with results, not tool names.
- Mobile-first, thumb-friendly controls and low-friction sharing.
- The artwork is the focal point; controls should be contextual and compact.
- One obvious place for each action. No duplicate add/export paths.
- Move, resize, rotate, and crop must be separate modes/gestures.
- Preserve the original simple, high-contrast visual identity: warm off-white, near-black, sharp orange accent.

## Core jobs
1. Make expressive text: width, line breaks, font, outline, shadow, curve, highlight.
2. Make photos stand out: import, crop, background removal, white/colored outline, shadow.
3. Compose with geometry: circles, squares, rounded rectangles, triangles, stars, speech bubbles.
4. Export/share a transparent asset with predictable output.

## Proposed information architecture
- **Home:** headline “Make your Stories stand out.” Three entry points: Type, Shapes, Cutouts. Curated “Ideas worth remixing”.
- **Create:** toolbar (Undo, Redo, Text, Photo, Export); canvas; contextual property panel; collapsible layer list.
- **Explore / Idea shelf:** ideas grouped around creator updates, selling, typography, funny moments, shapes. Every item explains a visual starting point and supports Remix.
- **Saved:** reusable local creations and saved ideas.

## Design-system foundations
- Background: #F5F3EE
- Surface: #FFFEFA
- Ink: #171717
- Secondary text: #706D67
- Lines: #DFDCD5
- Accent: #FF4D2E
- Rounded cards: 16–20 px
- Typography: DM Sans, with display faces used inside sticker artwork, not everywhere in UI.
- Use generous whitespace, clear type hierarchy, subtle borders, short labels, high-contrast primary action.
- Mobile touch targets should be roughly 44 px high minimum.
- Canvas should adapt to available space. Mobile target width: min(88vw, 360px); desktop target width: up to 560px.

## Editor interaction contract
- Tap object: select.
- Drag inside object: move only. Do not change scale or rotation.
- Dedicated corner handle or Scale control: resize.
- Dedicated rotation handle or Rotation control: rotate.
- Crop is an explicit mode; moving the photo within the crop frame changes framing, not the frame geometry.
- Text side handles change text-box width and line wrapping, not font size.
- Snapping guides only appear when useful, and must not cause unexpected jumps.
- Every visible action has a clear response; expensive actions show progress and can be cancelled when feasible.

## Quality gate before commercial release
- Android Chrome and iOS Safari checks for move, resize, rotate, text width, crop and layer selection.
- Compare stage preview against PNG export, including multiple layers, transparency, outline and highlight effects.
- Test import with high-resolution JPEG/HEIC and remove-background performance.
- Test copy/share/export paths on iOS and Android; avoid promising direct Instagram paste until validated on both.
- Keyboard/accessibility basics: focus states, button labels, no tool available only through color/gesture.
- A feature is not done because JavaScript parses; it is done after interaction and output validation on real devices.

## FigCraft / ArtCraft handoff
Use this brief to map Home, Create, Explore and Saved frames in FigCraft. FigCraft is an early-alpha design/prototyping app; treat it as a design exploration tool and do not make it a dependency for shipping. Preserve the code-based implementation as source of truth until a tested handoff is available.
