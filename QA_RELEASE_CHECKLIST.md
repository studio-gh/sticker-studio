# Story Studio: release and visual QA checklist

This checklist is mandatory before calling any editor change "done".

## 1. Scope and implementation
- [ ] State the user problem being fixed in one sentence.
- [ ] Identify the exact code path and source of the bug before editing.
- [ ] Prefer correcting/removing conflicting rules over appending another CSS override.
- [ ] Preserve working editor behavior, local drafts, language preferences, and export functionality.
- [ ] Commit the change with a message describing the actual behavior changed.

## 2. Required interaction checks
Test on a narrow mobile viewport and a desktop viewport:
- [ ] Open Create and confirm the Story canvas is vertical (9:16), centered, and not clipped.
- [ ] Add a text layer; the canvas remains visible.
- [ ] Type and edit text; the input retains focus and the page does not jump unexpectedly.
- [ ] With the keyboard open, both the text field and a useful live preview remain visible.
- [ ] Close the keyboard; the canvas returns to its normal size and position.
- [ ] Change font, font size, text width, color, and curve; content is preserved and the preview updates.
- [ ] Undo and redo restore the expected state without deleting unrelated content.
- [ ] Layer controls match the actual selection and layer count; empty states are accurate.
- [ ] Add a shape and photo; select and edit them without hiding the canvas.
- [ ] Export PNG and verify the exported result matches the canvas, including curved text.

## 3. Visual evidence is required
- [ ] Capture real screenshots from a browser at mobile and desktop sizes after the change.
- [ ] For keyboard-related changes, capture both keyboard-closed and keyboard-open states.
- [ ] Link the screenshots or browser preview in the delivery summary.
- [ ] Never create mock screenshots or present a code diff as visual validation.
- [ ] If browser automation or real-browser access is unavailable, explicitly state "Visual validation not performed" and do not call the change complete.

## 4. Deployment verification
- [ ] Confirm the expected commit is on the published branch.
- [ ] Check the GitHub Pages deployment/workflow status where available.
- [ ] Open the published URL with a cache-busting query and verify the served version if browser access is available.
- [ ] Distinguish the following in the report: "saved in GitHub", "deployment detected", and "visually verified".
- [ ] Do not describe a page as updated merely because the commit succeeded.

## 5. Required delivery message
Every update must include:
1. **Implemented:** exact behavior or features changed, with commit link.
2. **Visual feedback:** real screenshot/preview links, or an explicit statement that visual validation was not performed.
3. **Verification:** which checklist items passed and which remain untested.
4. **Deployment:** confirmed status, or state that it has not been confirmed.
5. **Known issues:** any remaining limitations or follow-up work.

## Current known investigation
The editor has accumulated many style blocks in `index.html`, including overlapping rules for the canvas, workspace, panel, dock, and virtual-keyboard state. Consolidate those rules into a coherent layout rather than adding successive global overrides. The latest interaction history also includes reports of an unstable preview during typing and text being cropped while curved. Those issues remain open until the interaction and visual checks above pass.
