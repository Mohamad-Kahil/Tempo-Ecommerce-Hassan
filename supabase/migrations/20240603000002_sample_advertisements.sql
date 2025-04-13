-- Insert sample hero sections
INSERT INTO advertisements (title, description, image_url, regions, placement, is_active, start_date, end_date)
VALUES 
('Transform Your Space', 'Discover premium building materials for your dream home', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', ARRAY['all'], 'hero', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 year'),
('Kitchen Essentials', 'Modern fixtures and materials for your kitchen renovation', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80', ARRAY['all'], 'hero', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 year'),
('Bathroom Luxury', 'Elegant fixtures and tiles for your bathroom', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80', ARRAY['all'], 'hero', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 year');

-- Insert sample banners
INSERT INTO advertisements (title, description, image_url, link_url, regions, placement, is_active, start_date, end_date)
VALUES 
('Summer Sale', 'Get 20% off on all flooring materials', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', '/sale', ARRAY['Egypt'], 'banner', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 year'),
('New Arrivals', 'Check out our latest products', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', '/new-arrivals', ARRAY['all'], 'banner', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 year'),
('Special Offer', 'Buy 2 get 1 free on selected items', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80', '/offers', ARRAY['Saudi Arabia', 'UAE'], 'banner', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 year');
