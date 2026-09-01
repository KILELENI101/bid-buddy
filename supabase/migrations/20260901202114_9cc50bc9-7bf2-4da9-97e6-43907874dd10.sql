CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  merchant text NOT NULL,
  url text NOT NULL,
  coupon_code text,
  discount_label text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  starts_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  vote_count integer NOT NULL DEFAULT 0,
  clicks integer NOT NULL DEFAULT 0,
  tint text NOT NULL DEFAULT 'oklch(0.55 0.13 300)',
  initials text NOT NULL DEFAULT 'OF',
  owner_key text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX offers_rank_idx ON public.offers (vote_count DESC, created_at ASC);
CREATE INDEX offers_owner_idx ON public.offers (owner_key);

CREATE TABLE public.votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id uuid NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  voter_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (offer_id, voter_key)
);

CREATE INDEX votes_voter_idx ON public.votes (voter_key, created_at DESC);

CREATE TABLE public.rank_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id uuid NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  owner_key text NOT NULL,
  target_rank integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (offer_id, owner_key)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.offers TO anon, authenticated;
GRANT ALL ON public.offers TO service_role;
GRANT SELECT, INSERT, DELETE ON public.votes TO anon, authenticated;
GRANT ALL ON public.votes TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rank_targets TO anon, authenticated;
GRANT ALL ON public.rank_targets TO service_role;

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rank_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "offers_public_read" ON public.offers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "offers_public_insert" ON public.offers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "offers_public_update" ON public.offers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "votes_public_read" ON public.votes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "votes_public_insert" ON public.votes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "votes_public_delete" ON public.votes FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "targets_public_read" ON public.rank_targets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "targets_public_insert" ON public.rank_targets FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "targets_public_update" ON public.rank_targets FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "targets_public_delete" ON public.rank_targets FOR DELETE TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.sync_offer_votes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.offers SET vote_count = vote_count + 1 WHERE id = NEW.offer_id;
    RETURN NEW;
  ELSE
    UPDATE public.offers SET vote_count = GREATEST(vote_count - 1, 0) WHERE id = OLD.offer_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER votes_sync_insert AFTER INSERT ON public.votes
FOR EACH ROW EXECUTE FUNCTION public.sync_offer_votes();
CREATE TRIGGER votes_sync_delete AFTER DELETE ON public.votes
FOR EACH ROW EXECUTE FUNCTION public.sync_offer_votes();

INSERT INTO public.offers (title, merchant, url, coupon_code, discount_label, description, category, starts_at, expires_at, vote_count, clicks, tint, initials) VALUES
('Loomframe Pro — 40% off the first year', 'loomframe.dev', 'https://loomframe.dev', 'LOOM40', '40% off', 'Annual plans drop to $107 for new accounts. Applies at checkout, no card tricks.', 'software', now() - interval '4 days', now() + interval '9 days', 412, 38214, 'oklch(0.62 0.17 275)', 'LF'),
('Palette Creator Bundle — buy one campaign, get one', 'palette.market', 'https://palette.market', 'BOGOPAL', 'BOGO', 'Launch a paid creator brief and the second one is free for the same month.', 'marketing', now() - interval '5 days', now() + interval '5 days', 366, 11902, 'oklch(0.6 0.14 175)', 'PL'),
('Northbeam AI — $0 for 3 months', 'northbeam.ai', 'https://northbeam.ai', 'NB3FREE', '3 months free', 'Full agent workspace free for a quarter on any new team seat. Cancel whenever.', 'software', now() - interval '6 days', now() + interval '20 days', 341, 20455, 'oklch(0.35 0.03 260)', 'NB'),
('Rankwell — 30% off lifetime', 'rankwell.so', 'https://rankwell.so', 'RANK30LIFE', '30% off', 'Discount sticks for as long as you stay subscribed. Limited to the first 500 sign-ups.', 'software', now() - interval '7 days', now() + interval '3 days', 298, 17640, 'oklch(0.58 0.2 300)', 'RW'),
('Coinperch fee-free week', 'coinperch.xyz', 'https://coinperch.xyz', NULL, '0% fees', 'Every trade settles without platform fees until Sunday midnight UTC.', 'finance', now() - interval '2 days', now() + interval '4 days', 254, 14980, 'oklch(0.72 0.17 60)', 'CP'),
('Guardrail compliance — 25% off annual', 'guardrail.works', 'https://guardrail.works', 'SOC25', '25% off', 'SOC 2 and ISO 27001 automation, a quarter cheaper if you pay yearly.', 'business', now() - interval '8 days', now() + interval '12 days', 211, 13520, 'oklch(0.5 0.12 200)', 'GR'),
('Halftone Studio — free portfolio month', 'halftone.studio', 'https://halftone.studio', 'FIRSTMONTH', '1 month free', 'Voice-note your projects and publish a case-study site. First month on the house.', 'marketing', now() - interval '3 days', now() + interval '15 days', 187, 1780, 'oklch(0.7 0.16 330)', 'HT'),
('Pulsechart Labs — 2 for 1 blood panels', 'pulsechart.health', 'https://pulsechart.health', 'TWOPANEL', '2 for 1', 'Order one full panel, gift the second to anyone in your household.', 'health', now() - interval '3 days', now() + interval '7 days', 164, 2260, 'oklch(0.65 0.16 20)', 'PC'),
('Forkbench — 50% off small teams', 'forkbench.dev', 'https://forkbench.dev', 'TEAM50', '50% off', 'Teams under 10 seats pay half price on the review-queue plan.', 'software', now() - interval '3 days', now() + interval '6 days', 142, 3120, 'oklch(0.45 0.06 265)', 'FB'),
('Flowtill — waived setup fee ($900 value)', 'flowtill.com', 'https://flowtill.com', NULL, 'Setup free', 'Payment routing onboarding at no cost when you migrate this quarter.', 'finance', now() - interval '2 days', now() + interval '25 days', 98, 1310, 'oklch(0.62 0.15 145)', 'FT'),
('Zeropoint — 20% off AI visibility reports', 'zeropoint.ai', 'https://zeropoint.ai', 'SEE20', '20% off', 'See where assistants mention you. One-off reports and monthly tracking both discounted.', 'software', now() - interval '1 day', now() + interval '2 days', 71, 970, 'oklch(0.28 0.02 260)', 'ZP'),
('Settlers Club Plus — free forever tier', 'settlersclub.io', 'https://settlersclub.io', NULL, 'Free tier', 'Private rooms and rematch history unlocked for anyone who joins this week.', 'gaming', now() - interval '1 day', now() + interval '5 days', 44, 3410, 'oklch(0.62 0.16 235)', 'SC'),
('Vital Coeur — 35% off the home monitor', 'vitalcoeur.com', 'https://vitalcoeur.com', 'HEART35', '35% off', 'Clinic-grade heart metrics at home, bundled with 6 months of tracking.', 'health', now() + interval '2 days', now() + interval '16 days', 0, 0, 'oklch(0.62 0.19 15)', 'VC'),
('Codenest Black Friday preview', 'codenest.app', 'https://codenest.app', 'EARLYBIRD', '60% off', 'Early access to the biggest discount of the year on lifetime snippet storage.', 'software', now() + interval '4 days', now() + interval '18 days', 0, 0, 'oklch(0.45 0.07 280)', 'CN'),
('Pensora — free retirement audit', 'pensora.finance', 'https://pensora.finance', NULL, 'Free audit', 'A planner reviews your numbers and sends a one-page plan. Slots open Monday.', 'finance', now() + interval '6 days', now() + interval '30 days', 0, 0, 'oklch(0.58 0.12 160)', 'PS'),
('Offhand Travel — 15% off any city break', 'offhand.travel', 'https://offhand.travel', 'CITY15', '15% off', 'Weekend stays across 40 cities, stackable with loyalty points.', 'travel', now() - interval '6 hours', now() + interval '10 days', 129, 4120, 'oklch(0.5 0.08 265)', 'OF'),
('Worldatlas Store — buy 2 maps, get 1', 'worldatlas.store', 'https://worldatlas.store', 'MAP3', '3 for 2', 'Framed prints only. Free shipping over $60.', 'retail', now() - interval '12 hours', now() + interval '8 days', 88, 2210, 'oklch(0.6 0.14 210)', 'WA');