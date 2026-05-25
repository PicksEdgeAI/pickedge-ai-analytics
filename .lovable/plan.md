
## Plan: Connect Lovable Cloud backend with full schema + auth

I'll build everything against the Lovable-managed Supabase project (the credentials you pasted for `sxbcveubbldqtklvesda` won't be used — Lovable Cloud's auto-generated client is locked to its own project). Your preview stays live throughout.

### 1. Database migration (one migration, all tables + RLS)

**Enum**
- `app_plan` = `free | pro | vip`
- `app_role` = `admin | user` (separate `user_roles` table — never store roles on profiles)

**Tables**
- `profiles` — `id` (=auth.users.id), `display_name`, `plan` (default `free`), `subscription_status`, `stripe_customer_id`, `stripe_subscription_id`
- `user_roles` — `user_id`, `role` (unique together)
- `games` — `odds_api_id` (unique), `sport`, `league`, `home_team`, `away_team`, `commence_time`, `status`, `home_score`, `away_score`
- `odds` — `game_id` FK, `bookmaker`, `market`, `outcome_name`, `price`, `point`, `last_update`
- `player_props` — `game_id` FK, `player_name`, `team`, `prop_type`, `line`, `over_price`, `under_price`, `ai_grade`, `hit_rate_l5/l10/l20`
- `ai_picks` — `game_id` FK nullable, `sport`, `pick_type`, `pick_label`, `confidence`, `grade`, `reasoning`, `result` (pending/won/lost/push)
- `saved_picks` — `user_id` FK auth.users, `ai_pick_id` FK, unique together
- `parlays` — `user_id` FK, `legs` jsonb, `total_odds`, `ai_grade`, `status`
- `injuries` — `player_name`, `team`, `league`, `status`, `description`, `ai_impact`
- `leaderboard_stats` view — aggregates wins/losses/ROI per user from `saved_picks` joined to `ai_picks.result`

**Security**
- RLS enabled on every table
- `has_role(uid, role)` SECURITY DEFINER function (avoids recursion)
- Public read (anon + authenticated): `games`, `odds`, `player_props`, `ai_picks`, `injuries`
- Per-user read/write: `profiles` (own row), `saved_picks` (own rows), `parlays` (own rows)
- Admin-only write: market data tables, via `has_role(auth.uid(),'admin')`
- Trigger `handle_new_user()` auto-inserts a `profiles` row on signup with `plan='free'`
- `updated_at` trigger on profiles/parlays

### 2. Auth wiring
- Configure auth: signups enabled, **auto-confirm ON** (so signup → instant login in dev; you can disable later)
- Rewrite `src/routes/login.tsx`: real email/password signup + login using `supabase.auth.signUp` / `signInWithPassword`, with `emailRedirectTo: window.location.origin`. Toggle between Sign in / Sign up modes. Remove the placeholder Google button (Google OAuth needs broker config — out of scope for this turn; tell me if you want it next).
- Add `src/hooks/use-auth.ts` — subscribes to `onAuthStateChange` first, then calls `getSession()` (correct order to avoid race)
- Add `_authenticated` layout route guard at `src/routes/_authenticated.tsx` that redirects to `/login` when no session
- Move the protected pages (`saved`, `parlay`, eventually `admin`) under that guard. Keep dashboard/props/games public so the preview still renders without login.
- Header in `app-shell.tsx`: show user email + Sign out when logged in, else Sign in link
- Wire `__root.tsx` to invalidate router + query cache on `onAuthStateChange`

### 3. Saved picks UI
- `src/routes/_authenticated/saved.tsx` (move from `_app/saved.tsx`): query `saved_picks` joined with `ai_picks`, render real rows, support delete
- "Save" button on AI pick cards (`_app/ai.tsx`, `_app/picks.tsx`) calls `supabase.from('saved_picks').insert({ ai_pick_id })` — `user_id` defaults via RLS check against `auth.uid()`

### 4. Preview safety
- All changes are additive routes + a single migration. Existing mock data on dashboard/props/etc. stays so the preview keeps rendering during the build.
- No edge functions, no cron, no Stripe in this turn.

### What I'm NOT doing in this turn
- Odds API sync / cron jobs (separate request)
- Stripe subscription flow (separate request)
- Google OAuth (needs broker setup — say the word)
- Seeding any mock data into the new tables — they start empty

### Technical notes
- Migration runs first and requires your approval. After it's approved I'll write the auth hook, guard route, login form, saved-picks page, and shell updates in one batch.
- Public-read RLS is intentional for market data so the dashboard renders for anonymous visitors and crawlers.
- `service_role` key you pasted will not be used / stored — Lovable Cloud already manages its own.

Approve to proceed.
