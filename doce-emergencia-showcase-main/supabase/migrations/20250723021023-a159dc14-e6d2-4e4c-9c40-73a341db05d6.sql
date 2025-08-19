-- Create coupons table for managing available coupons
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  points_value INTEGER NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rewards catalog table
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  image_url TEXT,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  stock_quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user rewards redemptions table
CREATE TABLE public.user_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.rewards(id),
  points_spent INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, cancelled
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

-- Create policies for coupons (public read for active coupons)
CREATE POLICY "Anyone can view active coupons" 
ON public.coupons 
FOR SELECT 
USING (is_active = true);

-- Create policies for rewards (public read for active rewards)
CREATE POLICY "Anyone can view active rewards" 
ON public.rewards 
FOR SELECT 
USING (is_active = true);

-- Create policies for user_rewards
CREATE POLICY "Users can view their own reward redemptions" 
ON public.user_rewards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reward redemptions" 
ON public.user_rewards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to redeem coupon
CREATE OR REPLACE FUNCTION public.redeem_coupon(coupon_code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY definer
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

-- Function to redeem reward
CREATE OR REPLACE FUNCTION public.redeem_reward(reward_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY definer
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

-- Insert some sample coupons
INSERT INTO public.coupons (code, name, description, points_value, max_uses) VALUES
('DOCE10', 'Cupom Doce 10', 'Ganhe 10 pontos com este cupom especial', 10, 100),
('SWEET20', 'Super Sweet 20', 'Cupom premium com 20 pontos', 20, 50),
('PROMO15', 'Promoção 15', 'Cupom promocional de 15 pontos', 15, 75),
('LOVE25', 'Love Special', 'Cupom especial de 25 pontos', 25, 30),
('WELCOME50', 'Boas-vindas', 'Cupom de boas-vindas com 50 pontos', 50, 1000);

-- Insert some sample rewards
INSERT INTO public.rewards (name, description, points_cost, category) VALUES
('Desconto 10%', 'Desconto de 10% em qualquer produto', 50, 'desconto'),
('Desconto 20%', 'Desconto de 20% em qualquer produto', 100, 'desconto'),
('Doce Grátis', 'Um doce grátis à sua escolha', 75, 'produto'),
('Frete Grátis', 'Frete grátis em sua próxima compra', 30, 'beneficio'),
('Combo Especial', 'Combo especial com 3 doces', 150, 'produto'),
('Desconto 30%', 'Desconto de 30% em qualquer produto', 200, 'desconto');