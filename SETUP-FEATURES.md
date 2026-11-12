# New features — setup guide

Everything below works **out of the box** using the visitor's own browser.
Three features can optionally be connected to free online services. All settings live in **`site-config.js`**.

## Where the files go on GitHub Pages
Your deploy workflow publishes the **`main/`** folder, so the live site only changes when the files are in `main/`.
This update ships the same features twice: once for the top-level folder (what you open locally) and once inside `main/` (what gets published).
Upload the contents of the `main/` folder from this update into `main/` on GitHub, then wait for the **Actions** deploy to finish.

## What was added

| Feature | Where | Needs setup? |
|---|---|---|
| Per-page theme customizer (🎨) | every page | No |
| Typing animation in the hero | Home | No (phrases in `site-config.js`) |
| Résumé page + PDF download | `resume.html` | Edit the text in `resume.html`, then re-export the PDF |
| English / Filipino toggle | every page | No (add text in `i18n.js`) |
| Skills radar chart | Skills | No |
| Project likes | Projects | Online storage for shared counts |
| Visitor counter | footer | Online storage for a total count |
| Guestbook | Contact | Online storage to share messages |
| Leaderboard (Quiz, Memory, Challenges) | Home | Online storage for a global board |
| Coding challenges (10) | IDE page | No |
| GitHub activity feed | Home | No (uses `githubUser`) |
| Projects page extras (sort, list view, tech chips, share links, GitHub source links) | Projects | No (set `githubRepo` in `site-config.js`) |
| Voice shortcuts (say or type a command; English and Filipino) | every page, 🎤 at the bottom center or Alt+V | No (needs HTTPS and microphone permission to listen) |
| Quiz difficulty (Easy / Medium / Hard) and a redesigned leaderboard | Home | No |
| Learning Journey blog | `blog.html` | Write posts in `blog-posts.js` |
| New achievements (8 badges) | Home widget | No |
| Installable app / offline (PWA) | all pages | Needs HTTPS (GitHub Pages is fine) |
| Contact form that really sends | Contact | Formspree URL |
| Smarter chatbot | Home | Your own AI proxy URL |

## 1. Contact form that really sends (Formspree, free)
1. Make a form at https://formspree.io and copy its URL, e.g. `https://formspree.io/f/abcdwxyz`.
2. Paste it into `formEndpoint` in `site-config.js`.

Leave it empty to keep the old "open Gmail" behaviour.

## 2. Shared leaderboard, guestbook, likes and visitor counter (Firebase, free)
This is what makes the quiz scores, memory scores, coding-challenge scores, guestbook messages, project likes and the visit counter the **same for every visitor**.
1. Go to https://console.firebase.google.com, sign in, and click **Create a project** (Google Analytics can be off).
2. In the left menu choose **Build → Realtime Database → Create Database**. Pick the closest location and start in **locked mode**.
3. Open the **Rules** tab, delete everything, paste the entire contents of `server/firebase-rules.json`, and click **Publish**. (If you published older rules before, replace them with these.)
4. Go to the **Data** tab and copy the URL at the top, for example `https://my-site-default-rtdb.firebaseio.com`.
5. Paste it into `firebaseDbUrl` in `site-config.js`, upload the file to the `main` folder on GitHub, and wait for the deploy.

**How to check it works:** open the site in two different browsers (or one on your phone), save a quiz score in one, and refresh the other. The leaderboard label should say **🌍 Everyone**, and both browsers should show the same names. If the label says **⚠️ Offline** or **📍 This device**, the URL or the rules are wrong.

**What the rules do:** they only allow the exact data this site writes (names 2–20 characters, quiz points that match the number of correct answers, guestbook messages up to 200 characters, counters that can only go up or down by 1), and nobody can edit or delete existing entries from the website.
**What they can't do:** stop a determined person from posting a made-up but valid-looking score. That needs a server. For a portfolio this is normally fine. Delete anything odd in the Firebase **Data** tab.

## 3. Smarter chatbot (optional)
Never put an API key in the website files. Instead:
1. Create a free Cloudflare Worker and paste in `server/ai-proxy-worker.js`.
2. Add your key as a secret named `ANTHROPIC_API_KEY` (and optionally `ALLOWED_ORIGIN` = your site URL).
3. Put the Worker URL into `aiEndpoint`.

If the AI is unreachable the chatbot tells the visitor and keeps its quick-question buttons.

## Editing content
- **Blog posts:** `blog-posts.js` (the five posts are samples, replace them, then set `SAMPLE_POSTS = false`).
- **Résumé:** edit `resume.html`, then open it in Chrome → Print → Save as PDF and save it as `Shane-Vincent-Olavario-Resume.pdf`.
- **Starting theme for a page:** `PAGE_DEFAULTS` at the top of `theme-customizer.js`.
- **After publishing changes:** change `CACHE_VERSION` in `sw.js` (for example `"v2"`) so returning visitors get the new files.
