# Bday Wishes 💗

A birthday surprise website, made for phones. A tiny teddy dances, asks two playful questions and hands over a 3D gift box. When it opens, a scrapbook unfolds over twelve pages: a book cover that opens in 3D, a retro camera that prints Polaroids, a spinning ring and a walk-through tunnel of photos, pages that turn, and a love letter at the end.

You add the photos and change the words. Everything else is ready. There is no backend: the result is a plain static website that any free host can serve.

## What you need

- [Node.js](https://nodejs.org) 20.19 or newer (the LTS download is fine).
- Her photos as JPG, PNG or WebP.

## Make it yours

1. **Install**, once, in this folder:

   ```sh
   npm install
   ```

2. **Add the photos** to the [photos/](photos/) folder. There are 80 photo spots; with fewer photos some appear more than once, so 30 or more look best. The first photo by file name becomes the cover, and the second becomes the big photo on the last page.

3. **Change the words** in [src/data/content.js](src/data/content.js). Every word on the site is there. Start with `her` and `me` at the top: what you call her, and how you sign the last page.

4. **Preview it:**

   ```sh
   npm run dev
   ```

   Open the `Local` address it prints. To see it on your phone, open the `Network` address on the same Wi-Fi.

5. **Build the finished site:**

   ```sh
   npm run build
   ```

   The `dist` folder is the whole website.

Photos are prepared by themselves before `npm run dev` and `npm run build`. Each one is done once and remembered, so only new or changed photos take time.

## Put it online

The easiest way: log in at <https://www.netlify.com>, open <https://app.netlify.com/drop> and drag the `dist` folder onto the page. Netlify gives you a link to send her. Log in first, because sites dropped without an account are temporary.

Any static host works the same way: Vercel, Cloudflare Pages, GitHub Pages, or your own nginx. Everything in `dist` uses relative paths, so it also works from a sub-folder.

Anyone with the link can open it. The site asks search engines not to list it, and every photo is saved without its hidden data (GPS location, camera, date).

## Choose where each photo goes

Photos fill the spots in file-name order (`01.jpg`, `02.jpg` …). To put a photo in one exact spot, name the file after that spot, for example `cover.jpg`, `finale.jpg` or `camera-03.jpg`. Run it once with an empty `photos/` folder and every placeholder shows its spot's name.

| Spots | Where they are |
| --- | --- |
| `cover`, `cover-inside` | The book's cover and its first page |
| `camera-01` … `camera-18` | The retro camera: one print per shutter press |
| `diary-hero`, `diary-strip-1` … `3`, `diary-mono` | The pink birthday diary |
| `ring-01` … `ring-10` | The spinning ring |
| `tunnel-01` … `tunnel-14` | The walk through the tunnel |
| `cherry-1` … `cherry-7` | The cherry-red page |
| `journal-1` … `journal-8` | The cream journal, in black and white |
| `blue-1` … `blue-8` | The blue butterfly page |
| `sunshine-1` … `sunshine-6` | The yellow sunshine page |
| `finale`, `finale-side` | The big photo on the last page, and the one by the signature |

Each photo is cropped to its spot's shape around the most interesting part, which is usually the person, and given that page's film look. The looks change colour only and never reshape faces. If a crop cuts off too much, crop the photo yourself first or give that spot a different photo.

In [content.js](src/data/content.js) every caption sits next to the name of its spot, so you can write each caption for the photo you put there.

## Handy to know

- Add `?skip=1` to the address to jump past the intro while checking something.
- After she has opened the gift once, a small "skip to the scrapbook" link appears on that phone, in case she reloads.
- A soft music-box "Happy Birthday" starts when the gift opens. The button at the top right mutes it.
- iPhone HEIC photos cannot be read here. Save them as JPG first (on the iPhone: Settings → Camera → Formats → Most Compatible).
- To change a spot's film look, change its `grade` in [scripts/slots.mjs](scripts/slots.mjs): `film`, `disposable`, `flash`, `golden`, `blush`, `dreamy`, `fade`, `leak`, `cool`, `mono`, `fine` or `none`.
- `npm run photos` prepares the photos on its own, without starting anything.
- `npm run phone` builds and serves the finished site on your Wi-Fi.

## What is where

| Path | What it holds |
| --- | --- |
| `photos/` | Your photos. Ignored by git, so they stay on your computer. |
| `src/data/content.js` | Every word on the site |
| `scripts/` | Photo preparation: the spots (`slots.mjs`), the film looks (`grades.mjs`) and the script itself (`photos.mjs`) |
| `src/scenes/` | One file per part of the story |
| `src/components/`, `src/lib/` | Shared pieces: Polaroids, stickers, scroll effects, sound |
| `public/art/` | All the artwork, ready to use |

## Built with

React, Vite, Tailwind CSS, Framer Motion, Lenis, Lucide icons and sharp. The 3D is CSS 3D transforms, plus a glossy heart pre-rendered with a small WebGL ray marcher. Third-party artwork and fonts are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
