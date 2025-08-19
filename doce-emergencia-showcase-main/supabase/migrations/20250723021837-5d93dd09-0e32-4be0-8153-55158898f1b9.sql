-- Create more permissive policies for admin interface
-- Note: In a production environment, you would want proper role-based access control

-- Allow authenticated users to view all coupons (for admin interface)
CREATE POLICY "Authenticated users can view all coupons for admin" 
ON public.coupons 
FOR SELECT 
TO authenticated
USING (true);

-- Allow authenticated users to insert coupons (for admin interface)
CREATE POLICY "Authenticated users can insert coupons for admin" 
ON public.coupons 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update coupons (for admin interface)
CREATE POLICY "Authenticated users can update coupons for admin" 
ON public.coupons 
FOR UPDATE 
TO authenticated
USING (true);

-- Allow authenticated users to view all rewards (for admin interface)
CREATE POLICY "Authenticated users can view all rewards for admin" 
ON public.rewards 
FOR SELECT 
TO authenticated
USING (true);

-- Allow authenticated users to insert rewards (for admin interface)
CREATE POLICY "Authenticated users can insert rewards for admin" 
ON public.rewards 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update rewards (for admin interface)  
CREATE POLICY "Authenticated users can update rewards for admin" 
ON public.rewards 
FOR UPDATE 
TO authenticated
USING (true);