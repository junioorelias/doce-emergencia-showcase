-- Create enum for roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create has_role function (drop and recreate for idempotency)
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $fn$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$fn$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Policies on user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Only admins can modify roles" ON public.user_roles;
CREATE POLICY "Only admins can modify roles"
ON public.user_roles
FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin'))
WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Tighten coupons RLS
DROP POLICY IF EXISTS "Authenticated users can insert coupons for admin" ON public.coupons;
DROP POLICY IF EXISTS "Authenticated users can update coupons for admin" ON public.coupons;
DROP POLICY IF EXISTS "Authenticated users can view all coupons for admin" ON public.coupons;

DROP POLICY IF EXISTS "Admins can view all coupons" ON public.coupons;
CREATE POLICY "Admins can view all coupons"
ON public.coupons
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admins can insert coupons" ON public.coupons;
CREATE POLICY "Admins can insert coupons"
ON public.coupons
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admins can update coupons" ON public.coupons;
CREATE POLICY "Admins can update coupons"
ON public.coupons
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'admin'))
WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Tighten rewards RLS
DROP POLICY IF EXISTS "Authenticated users can insert rewards for admin" ON public.rewards;
DROP POLICY IF EXISTS "Authenticated users can update rewards for admin" ON public.rewards;
DROP POLICY IF EXISTS "Authenticated users can view all rewards for admin" ON public.rewards;

DROP POLICY IF EXISTS "Admins can view all rewards" ON public.rewards;
CREATE POLICY "Admins can view all rewards"
ON public.rewards
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admins can insert rewards" ON public.rewards;
CREATE POLICY "Admins can insert rewards"
ON public.rewards
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admins can update rewards" ON public.rewards;
CREATE POLICY "Admins can update rewards"
ON public.rewards
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'admin'))
WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Create polls tables
CREATE TABLE IF NOT EXISTS public.polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  position INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, poll_id)
);

ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- Polls policies
DROP POLICY IF EXISTS "Public can view active polls" ON public.polls;
CREATE POLICY "Public can view active polls"
ON public.polls
FOR SELECT TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view all polls" ON public.polls;
CREATE POLICY "Admins can view all polls"
ON public.polls
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admins can insert polls" ON public.polls;
CREATE POLICY "Admins can insert polls"
ON public.polls
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admins can update polls" ON public.polls;
CREATE POLICY "Admins can update polls"
ON public.polls
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'admin'))
WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Poll options policies
DROP POLICY IF EXISTS "Public can view options of active polls" ON public.poll_options;
CREATE POLICY "Public can view options of active polls"
ON public.poll_options
FOR SELECT TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.polls p
    WHERE p.id = poll_options.poll_id AND p.is_active = true
  )
);

DROP POLICY IF EXISTS "Admins can manage options" ON public.poll_options;
CREATE POLICY "Admins can manage options"
ON public.poll_options
FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin'))
WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Poll votes policies
DROP POLICY IF EXISTS "Users can view their own votes" ON public.poll_votes;
CREATE POLICY "Users can view their own votes"
ON public.poll_votes
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own votes" ON public.poll_votes;
CREATE POLICY "Users can insert their own votes"
ON public.poll_votes
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Update redeem functions to ensure profile exists
CREATE OR REPLACE FUNCTION public.redeem_coupon(coupon_code text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  coupon_record public.coupons%ROWTYPE;
  user_id UUID;
  already_redeemed BOOLEAN;
BEGIN
  user_id := auth.uid();
  IF user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Usuário não autenticado');
  END IF;

  -- Ensure profile exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = user_id) THEN
    INSERT INTO public.profiles (user_id) VALUES (user_id);
  END IF;

  SELECT * INTO coupon_record 
  FROM public.coupons 
  WHERE code = UPPER(TRIM(coupon_code)) AND is_active = true;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Código inválido ou expirado');
  END IF;

  IF coupon_record.valid_until IS NOT NULL AND coupon_record.valid_until < now() THEN
    RETURN json_build_object('success', false, 'message', 'Cupom expirado');
  END IF;

  IF coupon_record.max_uses IS NOT NULL AND coupon_record.current_uses >= coupon_record.max_uses THEN
    RETURN json_build_object('success', false, 'message', 'Cupom esgotado');
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.redeemed_coupons 
    WHERE user_id = redeem_coupon.user_id AND coupon_code = coupon_record.code
  ) INTO already_redeemed;
  IF already_redeemed THEN
    RETURN json_build_object('success', false, 'message', 'Cupom já foi utilizado por você');
  END IF;

  INSERT INTO public.redeemed_coupons (user_id, coupon_code, points_earned)
  VALUES (user_id, coupon_record.code, coupon_record.points_value);

  UPDATE public.profiles 
  SET points = points + coupon_record.points_value
  WHERE user_id = redeem_coupon.user_id;

  UPDATE public.coupons 
  SET current_uses = current_uses + 1
  WHERE id = coupon_record.id;

  RETURN json_build_object(
    'success', true, 
    'message', 'Cupom resgatado com sucesso!',
    'points_earned', coupon_record.points_value,
    'coupon_name', coupon_record.name
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.redeem_reward(reward_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  reward_record public.rewards%ROWTYPE;
  user_profile public.profiles%ROWTYPE;
  user_id UUID;
BEGIN
  user_id := auth.uid();
  IF user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Usuário não autenticado');
  END IF;

  -- Ensure profile exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = user_id) THEN
    INSERT INTO public.profiles (user_id) VALUES (user_id);
  END IF;

  SELECT * INTO user_profile FROM public.profiles WHERE user_id = redeem_reward.user_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Perfil do usuário não encontrado');
  END IF;

  SELECT * INTO reward_record FROM public.rewards WHERE id = reward_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Recompensa não encontrada ou inativa');
  END IF;

  IF user_profile.points < reward_record.points_cost THEN
    RETURN json_build_object('success', false, 'message', 'Pontos insuficientes');
  END IF;

  IF reward_record.stock_quantity IS NOT NULL AND reward_record.stock_quantity <= 0 THEN
    RETURN json_build_object('success', false, 'message', 'Recompensa esgotada');
  END IF;

  INSERT INTO public.user_rewards (user_id, reward_id, points_spent)
  VALUES (user_id, reward_id, reward_record.points_cost);

  UPDATE public.profiles 
  SET points = points - reward_record.points_cost
  WHERE user_id = redeem_reward.user_id;

  IF reward_record.stock_quantity IS NOT NULL THEN
    UPDATE public.rewards 
    SET stock_quantity = stock_quantity - 1
    WHERE id = reward_id;
  END IF;

  RETURN json_build_object(
    'success', true, 
    'message', 'Recompensa resgatada com sucesso!',
    'points_spent', reward_record.points_cost,
    'reward_name', reward_record.name
  );
END;
$function$;
