# Public URL — what’s already done vs what you do

## Done on your machine (terminal)

- Git repo initialized on branch `main`
- First commit created (`.env.local` is **not** in git — good)

## You must do 2 web things (no way around login)

### 1) GitHub — create empty repo + push

1. Open **https://github.com/new**
2. Repository name: e.g. `family-memories`
3. **Do not** add README, .gitignore, or license (keep it empty)
4. Create repository
5. Copy the repo URL (HTTPS), e.g. `https://github.com/YOU/family-memories.git`

Then in terminal:

```bash
cd ~/Desktop/family-memories
chmod +x scripts/push-to-github.sh
./scripts/push-to-github.sh 'https://github.com/YOU/family-memories.git'
```

(GitHub may ask for username + **Personal Access Token** instead of password.)

### 2) Vercel — deploy + env

1. Open **https://vercel.com/new**
2. **Import** your GitHub repo `family-memories`
3. Before/after first deploy: **Settings → Environment Variables** add:

| Name | Value (copy from your `.env.local`) |
|------|-------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | same |
| `SUPABASE_SERVICE_ROLE_KEY` | full secret key |
| `FAMILY_PASSWORD_HASH_B64` | same |
| `ADMIN_PASSWORD_HASH_B64` | same |
| `SESSION_SECRET` | same (or new random for production) |

4. **Redeploy** if the first build failed.

Your public link will be like **`https://family-memories-xxx.vercel.app`** — share that + family password. Use any QR generator with that URL.
