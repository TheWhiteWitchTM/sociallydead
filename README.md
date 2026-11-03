# SociallyDead

Directory of the resistance. Websites, YouTube channels, and profiles on X and Bluesky, pushing back on MAGA, the AfD, and the far right.

The live site is [sociallydead.me](https://sociallydead.me).

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

## GitHub Pages

`basepath.txt` is blank, so assets and pages are rooted at `/` on [sociallydead.me](https://sociallydead.me). `public/CNAME` holds `sociallydead.me`. Next copies that file into `out/`, and that is the folder GitHub Pages deploys. A `/sociallydead` prefix on this domain breaks every stylesheet and script.

Pushes to `main` run `.github/workflows/pages.yml`, which builds `out/` and deploys it.

The repository Pages source is still **Deploy from a branch**. GitHub then also runs Jekyll and publishes this README, which replaces the built site. `_config.yml` is invalid on purpose so that Jekyll build stops before it can deploy. In the repository settings, set Pages to **GitHub Actions**. After that, delete `_config.yml`.

Link previews use `https://sociallydead.me`.

To build the old project-path preview, put `/sociallydead` in `basepath.txt` and run `npm run build`. Leave `basepath.txt` blank before pushing to `main`.

## Friday bot

SociallyDead is on the Grok bots desk. Run starts `tools/directory-bot.sh`. That program is Grok. It reads the public posts, reposts, quotes, replies, and likes of @TheWhiteWitchTM from the past seven days. A like or a repost is a reason to look. An account is added only when the public profile matches this directory. The bot does not feature listings and does not remove them. When it adds any, it commits and pushes to `main`.

The same program runs every Friday at 09:00 Europe/Berlin. It is a heavy pass, so it waits when the shared week is being saved and FauxNews files instead. A held Friday does not call the model. The log is `~/.local/share/sociallydead/directory-bot.log`.

```
0 9 * * 5 /home/andreas/Projects/sociallydead/tools/directory-bot.sh
```

That line is also in `/home/andreas/BlueSky/crontab`, because reinstalling that file replaces the whole crontab.

## License

GPL-2.0-only. See `LICENSE`.
