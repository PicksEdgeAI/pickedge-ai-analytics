
-- ============ ENUMS ============
CREATE TYPE public.app_plan AS ENUM ('free','pro','vip');
CREATE TYPE public.app_role AS ENUM ('admin','user');
CREATE TYPE public.pick_result AS ENUM ('pending','won','lost','push','void');

-- ============ UPDATED_AT HELPER ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  plan public.app_plan NOT NULL DEFAULT 'free',
  subscription_status TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles: select own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles: update own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Profiles: insert own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Roles: select own" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Roles: admins manage all" ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ AUTO-CREATE PROFILE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)));
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ GAMES ============
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  odds_api_id TEXT UNIQUE,
  sport TEXT NOT NULL,
  league TEXT,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  commence_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  home_score INT,
  away_score INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_games_commence ON public.games(commence_time);
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Games: public read" ON public.games FOR SELECT USING (true);
CREATE POLICY "Games: admin write" ON public.games FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_games_updated BEFORE UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ ODDS ============
CREATE TABLE public.odds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  bookmaker TEXT NOT NULL,
  market TEXT NOT NULL,
  outcome_name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  point NUMERIC,
  last_update TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_odds_game ON public.odds(game_id);
ALTER TABLE public.odds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Odds: public read" ON public.odds FOR SELECT USING (true);
CREATE POLICY "Odds: admin write" ON public.odds FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ PLAYER PROPS ============
CREATE TABLE public.player_props (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  team TEXT,
  prop_type TEXT NOT NULL,
  line NUMERIC NOT NULL,
  over_price NUMERIC,
  under_price NUMERIC,
  ai_grade TEXT,
  hit_rate_l5 NUMERIC,
  hit_rate_l10 NUMERIC,
  hit_rate_l20 NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_props_game ON public.player_props(game_id);
CREATE INDEX idx_props_player ON public.player_props(player_name);
ALTER TABLE public.player_props ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Props: public read" ON public.player_props FOR SELECT USING (true);
CREATE POLICY "Props: admin write" ON public.player_props FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_props_updated BEFORE UPDATE ON public.player_props
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ AI PICKS ============
CREATE TABLE public.ai_picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES public.games(id) ON DELETE SET NULL,
  sport TEXT,
  pick_type TEXT NOT NULL,
  pick_label TEXT NOT NULL,
  odds NUMERIC,
  confidence NUMERIC,
  grade TEXT,
  reasoning TEXT,
  result public.pick_result NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_picks_created ON public.ai_picks(created_at DESC);
ALTER TABLE public.ai_picks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AI picks: public read" ON public.ai_picks FOR SELECT USING (true);
CREATE POLICY "AI picks: admin write" ON public.ai_picks FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_ai_picks_updated BEFORE UPDATE ON public.ai_picks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SAVED PICKS ============
CREATE TABLE public.saved_picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ai_pick_id UUID NOT NULL REFERENCES public.ai_picks(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, ai_pick_id)
);
CREATE INDEX idx_saved_user ON public.saved_picks(user_id);
ALTER TABLE public.saved_picks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Saved: select own" ON public.saved_picks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Saved: insert own" ON public.saved_picks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Saved: delete own" ON public.saved_picks FOR DELETE USING (auth.uid() = user_id);

-- ============ PARLAYS ============
CREATE TABLE public.parlays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  legs JSONB NOT NULL,
  total_odds NUMERIC,
  ai_grade TEXT,
  status public.pick_result NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_parlays_user ON public.parlays(user_id);
ALTER TABLE public.parlays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parlays: select own" ON public.parlays FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Parlays: insert own" ON public.parlays FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Parlays: update own" ON public.parlays FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Parlays: delete own" ON public.parlays FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_parlays_updated BEFORE UPDATE ON public.parlays
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ INJURIES ============
CREATE TABLE public.injuries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  team TEXT,
  league TEXT,
  status TEXT NOT NULL,
  description TEXT,
  ai_impact TEXT,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.injuries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Injuries: public read" ON public.injuries FOR SELECT USING (true);
CREATE POLICY "Injuries: admin write" ON public.injuries FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ LEADERBOARD VIEW ============
CREATE VIEW public.leaderboard_stats
WITH (security_invoker = true) AS
SELECT
  sp.user_id,
  p.display_name,
  COUNT(*) FILTER (WHERE ap.result = 'won')  AS wins,
  COUNT(*) FILTER (WHERE ap.result = 'lost') AS losses,
  COUNT(*) FILTER (WHERE ap.result = 'push') AS pushes,
  COUNT(*) AS total_picks,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE ap.result = 'won')
    / NULLIF(COUNT(*) FILTER (WHERE ap.result IN ('won','lost')), 0)
  , 2) AS win_pct
FROM public.saved_picks sp
JOIN public.ai_picks ap ON ap.id = sp.ai_pick_id
LEFT JOIN public.profiles p ON p.id = sp.user_id
GROUP BY sp.user_id, p.display_name;
