-- Seed luxury cars with placeholder data
-- These will be owned by the first admin who signs up, or we use a dummy owner
-- For now, we create cars without owner_id constraint - admin will claim them
-- Actually, we need a valid owner_id. We'll seed via the app instead.
-- This script is a placeholder - cars will be added by admins through the UI.

-- If you want to test, create an admin account first, then run:
-- INSERT INTO public.cars (owner_id, brand, model, year, price_per_day, image_url, description, horsepower, transmission, seats, phone)
-- VALUES
--   ('<your-admin-uuid>', 'Lamborghini', 'Huracan EVO', 2024, 1500, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800', 'The Huracan EVO represents the natural evolution of the most successful V10-powered Lamborghini ever.', 640, 'Automatic', 2, '+1234567890'),
--   ('<your-admin-uuid>', 'Ferrari', '488 GTB', 2023, 1800, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800', 'The Ferrari 488 GTB is a mid-engine sports car produced by the Italian manufacturer Ferrari.', 661, 'Automatic', 2, '+1234567890');
SELECT 1;
