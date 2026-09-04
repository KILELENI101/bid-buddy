ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS views integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.rpc_register_view(_offer_id uuid, _visitor_key uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.enforce_rate_limit('view', _visitor_key::text, 600, 60);
  UPDATE public.offers SET views = views + 1 WHERE id = _offer_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.rpc_register_view(uuid, uuid) TO anon, authenticated;