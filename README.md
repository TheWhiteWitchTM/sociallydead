# SociallyDead

Directory of the resistance. Websites, YouTube channels, and profiles on X and Bluesky, pushing back on MAGA, the AfD, and the far right.

The live name is [sociallydead.me](https://sociallydead.me). Until that domain is attached, GitHub Pages serves the test build at `/sociallydead/`.

The heading quotes The Crüxshadows, “Resist”: *what hatred breeds you must resist.*

## Develop

```bash
npm install
npm run dev
```

The dev server is at `http://127.0.0.1:3000`. The theme is dark. The header switches to light, and `?theme=light` does the same.

```bash
npm run build
```

`npm run build` checks the JSON, then writes a static site to `out/`.

## Edit the directory

The pages render four JSON files:

- `data/websites.json`
- `data/youtube.json`
- `data/x.json`
- `data/bluesky.json`

Each entry has `id`, `name`, `url`, `blurb`, `category`, and `tags`. `category` is one of `people`, `shows`, `news`, or `organizations`. The same id uses the same category in every catalog. Optional fields are `handle`, `region`, `language`, `added` (`YYYY-MM-DD`), `featured`, and `pin`. `featured` lifts a listing into the featured row.

The shelves are real pages: `/people/`, `/shows/`, `/news/`, and `/organizations/`. Tags, letters, and the platform desks filter inside a shelf. Search matches names, handles, blurbs, and tags.

`npm run build` also writes `public/rss.xml`, `public/sitemap.xml`, and `public/robots.txt`. The feed lists every desk. The share image is `public/og.jpg`, a baseline JPEG at 1200×630, because the wide banner and a progressive JPEG were coming through as alt text.

```bash
tools/edit-directory.sh list
tools/edit-directory.sh add bluesky \
  --name "Example Desk" \
  --handle example.bsky.social \
  --url https://bsky.app/profile/example.bsky.social \
  --blurb "What this account is." \
  --category organizations \
  --tags organizing,united-states \
  --region "United States" \
  --language en
tools/edit-directory.sh edit websites splc --blurb "A shorter line."
tools/edit-directory.sh remove x some-id --yes
tools/edit-directory.sh validate
```

With no arguments, in a terminal, the same tool opens a small menu. `npm run directory -- list` is the same command. Catalog aliases: `web`, `yt`, `twitter`, `bsky`.

A listing is a pointer to a public site or profile. It is not a claim that every post from that account matches this directory. Send additions as a pull request, or open an issue.

## Theme, type, analytics

Dark is the default, in the same family as The White Witch site: near-black ground and lavender `#c9a6ff`. Inter for the UI. The lyric is set in Cormorant Garamond. Light is the other half of that pair.

Visits are counted with the same Google tag as LibreSky, `G-13S6Z9KCX9`.

## GitHub Pages, then the domain

`basepath.txt` is `/sociallydead`, so the test site matches `https://thewhitewitchtm.github.io/sociallydead/`.

Pushes to `main` run `.github/workflows/pages.yml`, which builds `out/` and deploys it.

The repository Pages source is still **Deploy from a branch**. GitHub then also runs Jekyll and publishes this README, which replaces the built site. `_config.yml` is invalid on purpose so that Jekyll build stops before it can deploy. In the repository settings, set Pages to **GitHub Actions**. After that, delete `_config.yml`.

Link previews use the origin that actually serves the files. With `/sociallydead` in `basepath.txt`, that is `https://thewhitewitchtm.github.io/sociallydead/`. `sociallydead.me` still answers from a paused host, so a card that points there shows the alt text and no banner.

When `sociallydead.me` is ready:

1. Point the domain at GitHub Pages.
2. Put `sociallydead.me` in `public/CNAME`.
3. Empty `basepath.txt` (the file can be blank). A custom domain is served from `/`, and a `/sociallydead` prefix would break every asset.
4. Push. GitHub redirects the `github.io` URL to the domain after the CNAME is in place.

To preview that root build locally: `BASE_PATH= npm run build`.

## License

GPL-2.0-only. See `LICENSE`.
