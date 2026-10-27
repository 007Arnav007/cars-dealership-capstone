# Answer Guide – Final Project: Submission and Evaluation

How this works: the project does the work, you run it on **your** machine, and every answer below is either
a **GitHub URL**, a **text file to paste**, or a **screenshot**. Nothing here can be pre-made for you:
outputs and screenshots must come from your own run and your own GitHub / IBM Cloud accounts.

Local ports: Django **8000** · Dealers API **3030** · Sentiment analyzer **5050**.

---
## PART A – One-time setup (≈15 min)

1. Install: Python 3.10+, Node 18+, Docker Desktop, Git.
2. Create an **empty public** GitHub repo (e.g. `cars-dealership-capstone`). Then from the project folder:
   ```bash
   git init && git add . && git commit -m "Capstone project"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USER>/cars-dealership-capstone.git
   git push -u origin main
   ```
   (Pushing also triggers the GitHub Actions workflow for Task 23.)
3. Edit `README.md` → replace `YOUR NAME HERE`. Edit `server/frontend/static/About.html` if you want your own names/emails. Commit + push.
4. Setup + start everything:
   ```bash
   ./scripts/setup.sh
   docker compose up -d --build
   ```
   Wait ~20 s, then check http://localhost:3030/fetchDealers shows JSON.

## PART B – Generate all text answers automatically (Tasks 2, 5, 6, 8, 9, 10, 11, 14/15, 16)

```bash
./scripts/capture_outputs.sh
```
This starts Django, runs every cURL and creates these files in `submission/` (command **and** output inside each):

`django_server` · `loginuser` · `logoutuser` · `getdealerreviews` · `getalldealers` · `getdealerbyid` · `getdealersbyState` · `getallcarmakes` · `analyzereview`

Leave Django running (it is started on port 8000) for the screenshots in Part C.

---
## PART C – Answer box by answer box

### Text / URL answers
Replace `<USER>` and `<REPO>` with yours. Use the **blob** URL (open the file on GitHub and copy the address bar).

| Task | Pts | What to put in the answer box |
|---|---|---|
| 1 | 1 | `https://github.com/<USER>/<REPO>/blob/main/README.md` |
| 2 | 1 | Paste the full contents of `submission/django_server` (shows "Starting development server at http://0.0.0.0:8000/") |
| 3 | 3 | `https://github.com/<USER>/<REPO>/blob/main/server/frontend/static/About.html` |
| 4 | 2 | `https://github.com/<USER>/<REPO>/blob/main/server/frontend/static/Contact.html` |
| 5 | 2 | Paste contents of `submission/loginuser` (shows `"status": "Authenticated"`) |
| 6 | 2 | Paste contents of `submission/logoutuser` (shows `{"userName": ""}`) |
| 7 | 1 | `https://github.com/<USER>/<REPO>/blob/main/server/frontend/src/components/Register/Register.jsx` |
| 8 | 2 | Paste contents of `submission/getdealerreviews` (reviews for dealer 29) |
| 9 | 2 | Paste contents of `submission/getalldealers` |
| 10 | 2 | Paste contents of `submission/getdealerbyid` (dealer 15) |
| 11 | 2 | Paste contents of `submission/getdealersbyState` (Kansas dealers) |
| 14 & 15 | 4 | Paste contents of `submission/getallcarmakes` |
| 16 | 2 | Paste contents of `submission/analyzereview` → `{"sentiment":"positive"}` |
| 23 | 3 | Contents of `submission/CICD` – see *CI/CD* below |
| 24 | 1 | Contents of `submission/deploymentURL` – your deployed URL (see Part D) |

> If a cURL answer box needs one block, the files already contain `$ command` + blank line + output. Paste as is.
> Tip: the output must not be empty/`null`. If you see `"dealers": null`, the Dealers API (port 3030) isn't running → `docker compose up -d`.

### CI/CD (Task 23)
1. GitHub repo → **Actions** tab → open the latest green run of **CI - Lint and Build**.
2. Easiest: install GitHub CLI (`gh auth login`) and run:
   ```bash
   gh run list --limit 1
   gh run view <RUN_ID> --log > submission/CICD
   ```
   or open each job (Lint Python / Lint JavaScript / Django check…) → **⚙ → View raw logs** → copy → save in `submission/CICD`.
3. Paste it. It must show the steps (Checkout, Set up Python, Run flake8, Run JSHint, …) finishing successfully.

### Screenshots (name exactly as shown; PNG or JPEG)
Save them into `submission/screenshots/`. **Keep the browser address bar visible** (don't crop it) and use a full-window screenshot.
Test accounts: use `root / Root@12345`, or register your own user first at http://localhost:8000/register/.

| Task | Pts | File name | Where to take it | Must be visible |
|---|---|---|---|---|
| 12 | 2 | `admin_login.png` | http://localhost:8000/admin → log in as `root` | "Site administration" page with "WELCOME, ROOT" and Car Makes/Models |
| 13 | 1 | `admin_logout.png` | Click **Log out** in admin | "Logged out" page |
| 17 | 1 | `get_dealers.png` | http://localhost:8000/ **not logged in** (logout first) | Dealer table, Login/Register in nav |
| 18 | 2 | `get_dealers_loggedin.png` | http://localhost:8000/ **after login** | Your username in navbar, **Review Dealer** column, address bar |
| 19 | 2 | `dealersbystate.png` | On the home page pick **Kansas** in the State dropdown → URL becomes `/?state=Kansas` | Only Kansas dealers, address bar with `?state=Kansas` |
| 20 | 1 | `dealer_id_reviews.png` | Click a dealer name, e.g. http://localhost:8000/dealer/29 | Dealer details, reviews with sentiment, address bar |
| 21 | 1 | `dealership_review_submission.png` | Logged in → **Review Dealer** (e.g. `/postreview/29`); fill the form but **don't click Post** | Text, purchase checkbox, date, car, year filled in |
| 22 | 2 | `added_review.png` | Click **Post Review** → you land on `/dealer/29` | Your new review at the bottom of the list |
| 25 | 2 | `deployed_landingpage.png` | Your **deployed** URL home page | Deployed domain in address bar, dealers list |
| 26 | 2 | `deployed_loggedin.png` | Deployed site after logging in | Username visible in navbar |
| 27 | 2 | `deployed_dealer_detail.png` | Deployed `/dealer/29` | Dealer details + reviews |
| 28 | 2 | `deployed_add_review.png` | Post a review on the deployed site → view dealer page | Your new review displayed |

How to get a screenshot: Windows `Win+Shift+S` · macOS `Cmd+Shift+4` (or `Cmd+Shift+5`) · Linux `PrtSc`.

---
## PART D – Deployment (Tasks 24–28)

You need: Docker Hub account (free), IBM Cloud account, [IBM Cloud CLI](https://cloud.ibm.com/docs/cli) with the Code Engine plugin.

```bash
# 1) Build + push the 3 images (replace USER)
docker login
docker build -t USER/sentiment-analyzer ./sentiment_analyzer && docker push USER/sentiment-analyzer
docker build -t USER/dealers-api        ./database           && docker push USER/dealers-api
docker build -t USER/dealership         ./server             && docker push USER/dealership
# (Docker Hub → each repo → Settings → make them Public)

# 2) IBM Cloud Code Engine
ibmcloud login --sso
ibmcloud plugin install code-engine
ibmcloud ce project create --name capstone        # or: ibmcloud ce project select -n <existing>

ibmcloud ce application create --name sentiment --image docker.io/USER/sentiment-analyzer --port 5000 --min-scale 1
ibmcloud ce application create --name dealers-api --image docker.io/USER/dealers-api --port 3030 --min-scale 1 --max-scale 1
ibmcloud ce application get --name sentiment   --output url     # → SENT_URL
ibmcloud ce application get --name dealers-api --output url     # → API_URL

ibmcloud ce application create --name dealership --image docker.io/USER/dealership --port 8000 --min-scale 1 --max-scale 1 \
  --env backend_url=API_URL --env sentiment_analyzer_url=SENT_URL/
ibmcloud ce application get --name dealership --output url      # → YOUR DEPLOYMENT URL
```
* Save the last URL in `submission/deploymentURL` (Task 24), e.g. `https://dealership.xxxxxxxx.us-south.codeengine.appdomain.cloud`.
* Open it and take Tasks 25–28 screenshots (register/login on the deployed site first; the deployed DB is fresh, or use `root / Root@12345`).
* Optional for Task 16: run `curl SENT_URL/analyze/Fantastic%20services` against the deployed analyzer instead of the local one.
* Kubernetes: `server/deployment.yaml` is ready (edit image + URLs, then `kubectl apply -f server/deployment.yaml`).
* After changes, redeploy: `ibmcloud ce application update --name dealership --image docker.io/USER/dealership`.

## Troubleshooting
| Symptom | Fix |
|---|---|
| `"dealers": null` | Start the Dealers API: `docker compose up -d`; check http://localhost:3030/fetchDealers |
| Blank page at `/` | Build React: `cd server/frontend && npm install && npm run build`, restart Django |
| Reviews all `neutral` | Sentiment analyzer down → `docker compose up -d`; check http://localhost:5050/analyze/great |
| `add_review` returns 403 | You aren't logged in – log in again |
| Port 8000 busy | `pkill -f "manage.py runserver"` then rerun |
