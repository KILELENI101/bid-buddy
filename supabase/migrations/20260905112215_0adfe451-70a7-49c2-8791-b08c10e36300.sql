CREATE TABLE IF NOT EXISTS public.site_visits (
  visitor_key uuid PRIMARY KEY,
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  visits integer NOT NULL DEFAULT 1
);

GRANT ALL ON public.site_visits TO service_role;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.rpc_register_visit(_visitor_key uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.enforce_rate_limit('visit', _visitor_key::text, 120, 60);
  INSERT INTO public.site_visits AS sv (visitor_key)
  VALUES (_visitor_key)
  ON CONFLICT (visitor_key) DO UPDATE
    SET visits = CASE WHEN sv.last_seen < now() - interval '30 minutes' THEN sv.visits + 1 ELSE sv.visits END,
        last_seen = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.rpc_register_visit(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.rpc_visitor_stats()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'visitors', (SELECT count(*) FROM public.site_visits),
    'returning', (SELECT count(*) FROM public.site_visits WHERE visits > 1),
    'visits', (SELECT coalesce(sum(visits), 0) FROM public.site_visits),
    'today', (SELECT count(*) FROM public.site_visits WHERE last_seen >= date_trunc('day', now())),
    'week', (SELECT count(*) FROM public.site_visits WHERE last_seen >= now() - interval '7 days')
  );
$$;

GRANT EXECUTE ON FUNCTION public.rpc_visitor_stats() TO anon, authenticated;