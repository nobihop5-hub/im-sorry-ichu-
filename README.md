# Apology Webpage

Open `index.html` in a browser. It works as a standalone page with no build step and no external dependencies.

## How to personalize it

1. Open `index.html`.
2. Search for `EDITABLE:` and replace the bracketed placeholders and sample copy.
3. Replace `[HER NAME]`, `[YOUR NAME]`, important dates, memories, promises, the personal letter, and the final signature.
4. Add photos to the `assets` folder.
5. In each memory card, replace the placeholder `memory-photo` block with an image like:

```html
<img class="memory-image" src="./assets/photo-1.jpg" alt="Describe this memory">
```

The page is intentionally non-pressuring. The default wording avoids guilt-tripping and keeps the focus on accountability, listening, and consistent action.

## Files

- `index.html` - the editable content and page structure
- `styles.css` - the cinematic responsive design
- `script.js` - smooth transitions, reveal animations, button interactions, and particle background
- `assets/` - place your real memory photos here
