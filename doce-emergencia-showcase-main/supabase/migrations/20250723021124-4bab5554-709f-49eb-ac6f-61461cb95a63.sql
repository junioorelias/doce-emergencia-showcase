-- Fix security issues by setting search_path for functions
CREATE OR REPLACE FUNCTION public.redeem_coupon(coupon_code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY definer 
SET search_path = ''
AS $$
DECLARE
  coupon_record public.coupons%ROWTYPE;
  user_id UUID;
  already_redeemed BOOLEAN;
  result JSON;
BEGIN
  -- Get current user
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Usuário não autenticado');
  END IF;
  
  -- Get coupon details
  SELECT * INTO coupon_record 
  FROM public.coupons 
  WHERE code = UPPER(TRIM(coupon_code)) AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Código inválido ou expirado');
  END IF;
  
  -- Check if coupon is still valid
  IF coupon_record.valid_until IS NOT NULL AND coupon_record.valid_until < now() THEN
    RETURN json_build_object('success', false, 'message', 'Cupom expirado');
  END IF;
  
  -- Check if coupon has reached max uses
  IF coupon_record.max_uses IS NOT NULL AND coupon_record.current_uses >= coupon_record.max_uses THEN
    RETURN json_build_object('success', false, 'message', 'Cupom esgotado');
  END IF;
  
  -- Check if user already redeemed this coupon
  SELECT EXISTS(
    SELECT 1 FROM public.redeemed_coupons 
    WHERE user_id = redeem_coupon.user_id AND coupon_code = coupon_record.code
  ) INTO already_redeemed;
  
  IF already_redeemed THEN
    RETURN json_build_object('success', false, 'message', 'Cupom já foi utilizado por você');
  END IF;
  
  -- Redeem coupon
  INSERT INTO public.redeemed_coupons (user_id, coupon_code, points_earned)
  VALUES (user_id, coupon_record.code, coupon_record.points_value);
  
  -- Update user points
  UPDATE public.profiles 
  SET points = points + coupon_record.points_value
  WHERE user_id = redeem_coupon.user_id;
  
  -- Update coupon usage count
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
$$;

-- Fix security issues by setting search_path for redeem_reward function
CREATE OR REPLACE FUNCTION public.redeem_reward(reward_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY definer
SET search_path = ''
AS $$
DECLARE
  reward_record public.rewards%ROWTYPE;
  user_profile public.profiles%ROWTYPE;
  user_id UUID;
  result JSON;
BEGIN
  -- Get current user
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Usuário não autenticado');
  END IF;
  
  -- Get user profile
  SELECT * INTO user_profile FROM public.profiles WHERE user_id = redeem_reward.user_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Perfil do usuário não encontrado');
  END IF;
  
  -- Get reward details
  SELECT * INTO reward_record FROM public.rewards WHERE id = reward_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Recompensa não encontrada ou inativa');
  END IF;
  
  -- Check if user has enough points
  IF user_profile.points < reward_record.points_cost THEN
    RETURN json_build_object('success', false, 'message', 'Pontos insuficientes');
  END IF;
  
  -- Check stock if applicable
  IF reward_record.stock_quantity IS NOT NULL AND reward_record.stock_quantity <= 0 THEN
    RETURN json_build_object('success', false, 'message', 'Recompensa esgotada');
  END IF;
  
  -- Redeem reward
  INSERT INTO public.user_rewards (user_id, reward_id, points_spent)
  VALUES (user_id, reward_id, reward_record.points_cost);
  
  -- Deduct points from user
  UPDATE public.profiles 
  SET points = points - reward_record.points_cost
  WHERE user_id = redeem_reward.user_id;
  
  -- Update stock if applicable
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
$$;