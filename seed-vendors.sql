-- Seed 100 Maui Activity Vendors into Database
-- Run this after the main schema is created

-- Get category IDs for reference
-- Categories: Water Activities, Land Tours, Adventure, Cultural, Wellness, Dining

-- WATER ACTIVITIES (Snorkeling, Diving, Sailing, Whale Watching)
INSERT INTO vendors (name, email, website, description, subscription_status, approved, featured) VALUES
('Trilogy Excursions', 'info@sailtrilogy.com', 'https://sailtrilogy.com', 'Premium snorkeling and sailing tours', 'inactive', false, false),
('Pride of Maui', 'info@prideofmaui.com', 'https://prideofmaui.com', 'Sailing and whale watching', 'inactive', false, false),
('Maui Dive Shop', 'info@mauidiveshop.com', 'https://mauidiveshop.com', 'SCUBA diving certification and tours', 'inactive', false, false),
('Alii Nui', 'info@aliiresorts.com', 'https://aliiresorts.com', 'Catamaran snorkeling and whale watching', 'inactive', false, false),
('Kai Kanani', 'info@kaikanani.com', 'https://kaikanani.com', 'Snorkeling tours from Wailea', 'inactive', false, false),
('Calypso Maui', 'info@calypsomauicharters.com', 'https://calypsomauicharters.com', 'Ocean adventure charters', 'inactive', false, false),
('Four Winds II', 'info@fourwindsmaui.com', 'https://fourwindsmaui.com', 'Glass bottom boat snorkeling', 'inactive', false, false),
('Seafire Charters', 'info@seafiremaui.com', 'https://seafiremaui.com', 'Sunset sailing and snorkeling', 'inactive', false, false),
('Lani Kai', 'info@mauiprincess.com', 'https://mauiprincess.com', 'Ocean activities from Lahaina', 'inactive', false, false),
('Makena Coast Dive', 'info@makenacoastdive.com', 'https://makenacoastdive.com', 'Professional diving expeditions', 'inactive', false, false),
('Maui Surf Clinics', 'info@mauisurfclinics.com', 'https://mauisurfclinics.com', 'Beginner and advanced surf lessons', 'inactive', false, false),
('Goofy Foot Surf School', 'info@goofyfootsurfschool.com', 'https://goofyfootsurfschool.com', 'Surf instruction for all levels', 'inactive', false, false),
('Maui Surfer Girls', 'info@mauisurfergirls.com', 'https://mauisurfergirls.com', 'Women-focused surf camps and lessons', 'inactive', false, false),
('Hawaiian Paddle Sports', 'info@hawaiianpaddlesports.com', 'https://hawaiianpaddlesports.com', 'SUP and kayaking tours', 'inactive', false, false),
('Maui Waveriders', 'info@mauiwaveriders.com', 'https://mauiwaveriders.com', 'Windsurfing and water sports', 'inactive', false, false),
('Action Sports Maui', 'info@actionsportsmaui.com', 'https://actionsportsmaui.com', 'Watersports instruction and rentals', 'inactive', false, false),
('SUP Maui', 'info@standuppaddlemaui.com', 'https://standuppaddlemaui.com', 'Stand-up paddleboarding tours', 'inactive', false, false),
('Maui Kayaks', 'info@mauikayaks.com', 'https://mauikayaks.com', 'Kayaking excursions and rentals', 'inactive', false, false),
('Paragon Sailing', 'info@sailmaui.com', 'https://sailmaui.com', 'Sailing adventures on the ocean', 'inactive', false, false),
('Teralani Sailing', 'info@teralani.net', 'https://teralani.net', 'Catamaran sailing and snorkeling', 'inactive', false, false),
('Pacific Whale Foundation', 'info@pacificwhale.org', 'https://pacificwhale.org', 'Whale watching and ocean conservation', 'inactive', false, false),
('Quicksilver', 'info@quicksilver-cruises.com', 'https://quicksilver-cruises.com', 'Island cruises and water tours', 'inactive', false, false),
('Gemini Sailing', 'info@geminicharters.com', 'https://geminicharters.com', 'Sailing charters and lessons', 'inactive', false, false),
('Scotch Mist Sailing', 'info@scotchmistsailingcharters.com', 'https://scotchmistsailingcharters.com', 'Traditional sailing experiences', 'inactive', false, false),
('Ultimate Whale Watch', 'info@ultimatewhalewatch.com', 'https://ultimatewhalewatch.com', 'Premium whale watching tours', 'inactive', false, false),
('Maui Ocean Riders', 'info@mauioceanriders.com', 'https://mauioceanriders.com', 'Speedboat whale watching', 'inactive', false, false),
('Blue Water Rafting', 'info@bluewaterrafting.com', 'https://bluewaterrafting.com', 'Raft and snorkel adventures', 'inactive', false, false),
('UFO Parasail', 'info@ufoparasail.net', 'https://ufoparasail.net', 'Parasailing experiences', 'inactive', false, false),
('Maui Jet Ski', 'info@mauijetski.net', 'https://mauijetski.net', 'Jet ski rentals and tours', 'inactive', false, false),
('Boss Frog''s', 'info@bossfrogsdivemaui.com', 'https://bossfrogsdivemaui.com', 'Diving and snorkeling', 'inactive', false, false),

-- LAND TOURS (Road to Hana, Hiking, Biking, Zipline, Horseback, ATV, Cultural)
('Road to Hana Tour Company', 'info@roadtohanatour.com', 'https://roadtohanatour.com', 'Guided Road to Hana tours', 'inactive', false, false),
('Hana Picnic', 'info@hanapicnicco.com', 'https://hanapicnicco.com', 'Road to Hana experiences', 'inactive', false, false),
('Temptation Tours', 'info@temptationtours.com', 'https://temptationtours.com', 'Adventure tours on Maui', 'inactive', false, false),
('Valley Isle Excursions', 'info@tourmaui.com', 'https://tourmaui.com', 'Guided tours of Maui', 'inactive', false, false),
('Skyline Hawaii', 'info@skylinehawaii.com', 'https://skylinehawaii.com', 'Zipline and outdoor adventures', 'inactive', false, false),
('Hike Maui', 'info@hikemaui.com', 'https://hikemaui.com', 'Guided hiking excursions', 'inactive', false, false),
('Maui Hiking Safaris', 'info@mauihikingsafaris.com', 'https://mauihikingsafaris.com', 'Personalized hiking tours', 'inactive', false, false),
('Hawaii Forest & Trail', 'info@hawaii-forest.com', 'https://hawaii-forest.com', 'Forest and eco-tours', 'inactive', false, false),
('Maui Eco Tours', 'info@mauiecotours.com', 'https://mauiecotours.com', 'Sustainable eco-tourism', 'inactive', false, false),
('Maui Sunriders', 'info@mauisunriders.com', 'https://mauisunriders.com', 'Haleakala downhill biking', 'inactive', false, false),
('Bike Maui', 'info@bikemaui.com', 'https://bikemaui.com', 'Bike tours and rentals', 'inactive', false, false),
('Mountain Riders', 'info@mountainriders.com', 'https://mountainriders.com', 'Biking adventures', 'inactive', false, false),
('Haleakala Bike Company', 'info@bikemaui.com', 'https://bikemaui.com', 'Downhill bike tours', 'inactive', false, false),
('Piiholo Ranch Zipline', 'info@piiholoranch.com', 'https://piiholoranch.com', 'Zipline and horseback experiences', 'inactive', false, false),
('Skyline Eco-Adventures', 'info@skylinehawaii.com', 'https://skylinehawaii.com', 'Zipline courses', 'inactive', false, false),
('Flyin Hawaiian Zipline', 'info@flyinhawaiian.com', 'https://flyinhawaiian.com', 'Zipline adventures', 'inactive', false, false),
('Kapalua Ziplines', 'info@kapaluaziplines.com', 'https://kapaluaziplines.com', 'Coastal zipline tours', 'inactive', false, false),
('Maui Zipline Company', 'info@mauizipline.com', 'https://mauizipline.com', 'Zipline experiences', 'inactive', false, false),
('Makena Stables', 'info@makenastables.com', 'https://makenastables.com', 'Horseback riding tours', 'inactive', false, false),
('Iron Horse Ranch', 'info@ironhorseranch.com', 'https://ironhorseranch.com', 'Ranch and horseback experiences', 'inactive', false, false),
('Mendes Ranch', 'info@mendesranch.com', 'https://mendesranch.com', 'Working ranch tours and horseback', 'inactive', false, false),
('Thompson Ranch', 'info@thompsonranch.com', 'https://thompsonranch.com', 'Horseback riding and ranch tours', 'inactive', false, false),
('Maui ATV Tours', 'info@mauiatvtours.net', 'https://mauiatvtours.net', 'Off-road ATV adventures', 'inactive', false, false),
('Haleakala ATV Tours', 'info@mauioffroadatv.com', 'https://mauioffroadatv.com', 'ATV experiences', 'inactive', false, false),
('Maui Off Road Adventures', 'info@mauioffroadadventures.com', 'https://mauioffroadadventures.com', 'Off-road vehicle tours', 'inactive', false, false),
('Old Lahaina Luau', 'info@oldlahainaluau.com', 'https://oldlahainaluau.com', 'Traditional Hawaiian luau', 'inactive', false, false),
('Feast at Lele', 'info@feastatlele.com', 'https://feastatlele.com', 'Beach luau dining experience', 'inactive', false, false),
('Grand Wailea Luau', 'info@grandwailea.com', 'https://grandwailea.com', 'Resort luau and dinner show', 'inactive', false, false),
('Te Au Moana Luau', 'info@teaumoana.com', 'https://teaumoana.com', 'Beachfront luau experience', 'inactive', false, false),
('Myths of Maui Luau', 'info@royallahaina.com', 'https://royallahaina.com', 'Cultural luau dinner', 'inactive', false, false),
('Drums of the Pacific', 'info@drumsofthepacificmaui.com', 'https://drumsofthepacificmaui.com', 'Hyatt luau experience', 'inactive', false, false),
('Haleakala Eco Tours', 'info@haleakalaecotours.com', 'https://haleakalaecotours.com', 'Haleakala National Park tours', 'inactive', false, false),
('Polynesian Adventure Tours', 'info@polyad.com', 'https://polyad.com', 'Multi-island tours including Haleakala', 'inactive', false, false),
('Maui Pineapple Tours', 'info@mauipineappletour.com', 'https://mauipineappletour.com', 'Plantation and cultural tours', 'inactive', false, false),

-- AIR ACTIVITIES (Helicopter, Airplane, Skydiving)
('Blue Hawaiian Helicopters', 'info@bluehawaiian.com', 'https://bluehawaiian.com', 'Helicopter island tours', 'inactive', false, false),
('Maverick Helicopters', 'info@maverickhelicopter.com', 'https://maverickhelicopter.com', 'Helicopter sightseeing tours', 'inactive', false, false),
('Air Maui Helicopters', 'info@airmaui.com', 'https://airmaui.com', 'Scenic helicopter flights', 'inactive', false, false),
('Sunshine Helicopters', 'info@sunshinehelicopters.com', 'https://sunshinehelicopters.com', 'Helicopter adventures', 'inactive', false, false),
('Maui Helicopter Tours', 'info@mauihelicoptertours.net', 'https://mauihelicoptertours.net', 'Air tours of Maui', 'inactive', false, false),
('Volcano Air Tours', 'info@volcanoairtours.com', 'https://volcanoairtours.com', 'Fixed-wing airplane tours', 'inactive', false, false),
('Maui Aviators', 'info@mauiaviators.com', 'https://mauiaviators.com', 'Scenic airplane flights', 'inactive', false, false),
('Skydive Hawaii', 'info@skydivehawaii.com', 'https://skydivehawaii.com', 'Tandem skydiving', 'inactive', false, false),
('Pacific Skydiving Center', 'info@pacificskydiving.com', 'https://pacificskydiving.com', 'Skydiving experiences', 'inactive', false, false),
('Proflyght Paragliding', 'info@proflyght.com', 'https://proflyght.com', 'Paragliding adventures', 'inactive', false, false),
('Hang Gliding Maui', 'info@hangglidingmaui.com', 'https://hangglidingmaui.com', 'Hang gliding experiences', 'inactive', false, false),

-- WELLNESS (Spa, Yoga)
('Spa Grande', 'info@grandwailea.com', 'https://grandwailea.com', 'Luxury spa treatments', 'inactive', false, false),
('Spa Montage', 'info@montagehotels.com', 'https://montagehotels.com', 'Premium spa services', 'inactive', false, false),
('Awili Spa', 'info@andazmaui.com', 'https://andazmaui.com', 'Modern spa wellness', 'inactive', false, false),
('Mandara Spa', 'info@mandaraspa.com', 'https://mandaraspa.com', 'Balinese spa experience', 'inactive', false, false),
('Maui Yoga Shala', 'info@mauiyogashala.com', 'https://mauiyogashala.com', 'Yoga classes and retreats', 'inactive', false, false),
('SUP Yoga Maui', 'info@supyogamaui.com', 'https://supyogamaui.com', 'Stand-up paddle yoga', 'inactive', false, false),
('Maui Yoga Path', 'info@mauiyogapath.com', 'https://mauiyogapath.com', 'Yoga instruction and wellness', 'inactive', false, false),

-- FISHING
('Start Me Up Sportfishing', 'info@startmeupfishing.com', 'https://startmeupfishing.com', 'Deep sea fishing charters', 'inactive', false, false),
('Finest Kind Sportfishing', 'info@finestkindmaui.com', 'https://finestkindmaui.com', 'Sportfishing expeditions', 'inactive', false, false),
('Absolute Sportfishing', 'info@absolutesportfishing.com', 'https://absolutesportfishing.com', 'Fishing charters', 'inactive', false, false),
('Maui Fishing Charters', 'info@mauifishingcharters.net', 'https://mauifishingcharters.net', 'Guided fishing trips', 'inactive', false, false),
('Piper Sportfishing', 'info@pipersportfishing.com', 'https://pipersportfishing.com', 'Fishing adventures', 'inactive', false, false),

-- GOLF
('Kapalua Golf', 'info@kapaluamaui.com', 'https://kapaluamaui.com', 'Championship golf courses', 'inactive', false, false),
('Wailea Golf Club', 'info@waileagolf.com', 'https://waileagolf.com', 'Golf courses with ocean views', 'inactive', false, false),
('Makena Golf Club', 'info@makenagolf.com', 'https://makenagolf.com', 'South Maui golf experience', 'inactive', false, false),
('Pukalani Country Club', 'info@pukalanicountryclub.com', 'https://pukalanicountryclub.com', 'Upcountry golf course', 'inactive', false, false),

-- UNIQUE EXPERIENCES (Food, Farm, Brewery, Aquarium)
('Maui Winery Tours', 'info@mauiwine.com', 'https://mauiwine.com', 'Wine tasting and vineyard tours', 'inactive', false, false),
('Ali''i Kula Lavender Farm', 'info@aklmaui.com', 'https://aklmaui.com', 'Lavender farm tours and products', 'inactive', false, false),
('Ocean Vodka Farm Tour', 'info@oceanvodka.com', 'https://oceanvodka.com', 'Distillery and farm tours', 'inactive', false, false),
('Surfing Goat Dairy', 'info@surfinggoatdairy.com', 'https://surfinggoatdairy.com', 'Farm tour and cheese experience', 'inactive', false, false),
('Maui Brewing Company', 'info@mauibrewingco.com', 'https://mauibrewingco.com', 'Brewery tours and tastings', 'inactive', false, false),
('Maui Tropical Plantation', 'info@mauitropicalplantation.com', 'https://mauitropicalplantation.com', 'Agricultural and cultural tours', 'inactive', false, false),
('Maui Ocean Center Aquarium', 'info@mauioceancenter.com', 'https://mauioceancenter.com', 'Marine life experiences', 'inactive', false, false);

-- Update featured vendors (optional)
UPDATE vendors SET featured = true WHERE name IN (
  'Trilogy Excursions', 'Old Lahaina Luau', 'Blue Hawaiian Helicopters', 'Hike Maui'
);
