-- This script creates the demo user in Supabase Auth
-- Note: This needs to be run in the Supabase dashboard SQL editor
-- or via the Supabase CLI, not through the app

-- First, let's ensure we have the demo merchant
INSERT INTO merchants (
  id, 
  shop_domain, 
  access_token, 
  settings, 
  plan_type,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'demo-store.myshopify.com',
  'encrypted_demo_token',
  '{"brand_color": "#1D4ED8", "logo_url": "/placeholder.svg?height=40&width=120", "return_policy": "We accept returns within 30 days of purchase."}',
  'growth',
  NOW(),
  NOW()
) ON CONFLICT (shop_domain) DO UPDATE SET
  settings = EXCLUDED.settings,
  plan_type = EXCLUDED.plan_type,
  updated_at = NOW();

-- Create the demo user in auth.users table
-- This simulates what Supabase Auth would create
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@demo-store.com',
  crypt('demo123', gen_salt('bf')), -- This hashes the password 'demo123'
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"shop_domain": "demo-store.myshopify.com"}',
  false,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('demo123', gen_salt('bf')),
  updated_at = NOW();

-- Create the corresponding user in our users table
INSERT INTO users (
  id,
  merchant_id, 
  email, 
  role,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  'admin@demo-store.com',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  merchant_id = EXCLUDED.merchant_id,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Create identity record for the demo user
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  '{"sub": "550e8400-e29b-41d4-a716-446655440001", "email": "admin@demo-store.com"}',
  'email',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (provider, user_id) DO UPDATE SET
  identity_data = EXCLUDED.identity_data,
  updated_at = NOW();
