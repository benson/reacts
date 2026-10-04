# reacts

A searchable collection of 135 surreal animal reaction photographs at https://reacts.bensonperry.com. The minimal layout follows the concerts site: a narrow column, system type, neutral colors, search, and images.

## Local use

Run `npm run dev`, then open http://127.0.0.1:4187. No runtime dependencies or install step needed.

`npm run build` validates the collection and copies the static site to `dist/`. Pushes to `main` deploy through GitHub Actions to GitHub Pages.

## Images

- `originals/`: full-resolution generated PNGs, including the original thumbs-up cat.
- `images/`: optimized JPEG downloads and WebP gallery thumbnails.
- `collection.json`: titles, descriptions, search tags and image paths.
- `prompts.json`: the shared style prompt and all 20 new scene prompts, generated with the built-in image generation tool.
- `prompts-max-chill.json`: the second batch of 20 scenes, including smoking, drinks, and double cups.
- `prompts-everyday.json`: 12 more chill animals in everyday settings.
- `prompts-fifty-chillers.json`: 20 singles, 20 duos, and 10 trios in everyday settings.
- `prompts-reactions-duos.json`: 12 specific reactions and 20 additional two-chiller scenes.

To add future images, install Sharp locally and run `node scripts/prepare-images.mjs path/to/sources.json`. Each source entry uses `id`, `title`, `scene`, `tags`, and an absolute `source` path. New images appear first; existing entries remain intact and duplicate IDs are rejected. `SHARP_PATH` can point to an existing Sharp installation. Commit final originals and web assets together.

## Hosting

Dedicated repository: https://github.com/benson/reacts. GitHub Pages serves the static site with a DNS-only Cloudflare CNAME from `reacts.bensonperry.com` to `benson.github.io`.
