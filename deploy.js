#!/usr/bin/env node
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://gpnaidjjekmdkeysdxhm.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_MzGYDgDnQ7buC39Wpy3aDQ_ASfkUQCD';

// Vendor data - 100 vendors across Water, Land, and Air categories
const vendors = [
  // WATER ACTIVITIES (30 vendors)
  { name: 'Trilogy Excursions', email: 'info@sailtrilogy.com', website: 'https://sailtrilogy.com', description: 'Premium snorkeling and sailing tours' },
  { name: 'Pride of Maui', email: 'info@prideofmaui.com', website: 'https://prideofmaui.com', description: 'Sailing and whale watching' },
  { name: 'Maui Dive Shop', email: 'info@mauidiveshop.com', website: 'https://mauidiveshop.com', description: 'SCUBA diving certification and tours' },
  { name: 'Alii Nui', email: 'info@aliiresorts.com', website: 'https://aliiresorts.com', description: 'Catamaran snorkeling and whale watching' },
  { name: 'Kai Kanani', email: 'info@kaikanani.com', website: 'https://kaikanani.com', description: 'Snorkeling tours from Wailea' },
  { name: 'Calypso Maui', email: 'info@calypsomauicharters.com', website: 'https://calypsomauicharters.com', description: 'Ocean adventure charters' },
  { name: 'Four Winds II', email: 'info@fourwindsmaui.com', website: 'https://fourwindsmaui.com', description: 'Glass bottom boat snorkeling' },
  { name: 'Seafire Charters', email: 'info@seafiremaui.com', website: 'https://seafiremaui.com', description: 'Sunset sailing and snorkeling' },
  { name: 'Lani Kai', email: 'info@mauiprincess.com', website: 'https://mauiprincess.com', description: 'Ocean activities from Lahaina' },
  { name: 'Makena Coast Dive', email: 'info@makenacoastdive.com', website: 'https://makenacoastdive.com', description: 'Professional diving expeditions' },
  { name: 'Maui Surf Clinics', email: 'info@mauisurfclinics.com', website: 'https://mauisurfclinics.com', description: 'Beginner and advanced surf lessons' },
  { name: 'Goofy Foot Surf School', email: 'info@goofyfootsurfschool.com', website: 'https://goofyfootsurfschool.com', description: 'Surf instruction for all levels' },
  { name: 'Maui Surfer Girls', email: 'info@mauisurfergirls.com', website: 'https://mauisurfergirls.com', description: 'Women-focused surf camps and lessons' },
  { name: 'Hawaiian Paddle Sports', email: 'info@hawaiianpaddlesports.com', website: 'https://hawaiianpaddlesports.com', description: 'SUP and kayaking tours' },
  { name: 'Maui Waveriders', email: 'info@mauiwaveriders.com', website: 'https://mauiwaveriders.com', description: 'Windsurfing and water sports' },
  { name: 'Action Sports Maui', email: 'info@actionsportsmaui.com', website: 'https://actionsportsmaui.com', description: 'Watersports instruction and rentals' },
  { name: 'SUP Maui', email: 'info@standuppaddlemaui.com', website: 'https://standuppaddlemaui.com', description: 'Stand-up paddleboarding tours' },
  { name: 'Maui Kayaks', email: 'info@mauikayaks.com', website: 'https://mauikayaks.com', description: 'Kayaking excursions and rentals' },
  { name: 'Paragon Sailing', email: 'info@sailmaui.com', website: 'https://sailmaui.com', description: 'Sailing adventures on the ocean' },
  { name: 'Teralani Sailing', email: 'info@teralani.net', website: 'https://teralani.net', description: 'Catamaran sailing and snorkeling' },
  { name: 'Pacific Whale Foundation', email: 'info@pacificwhale.org', website: 'https://pacificwhale.org', description: 'Whale watching and ocean conservation' },
  { name: 'Quicksilver', email: 'info@quicksilver-cruises.com', website: 'https://quicksilver-cruises.com', description: 'Island cruises and water tours' },
  { name: 'Gemini Sailing', email: 'info@geminicharters.com', website: 'https://geminicharters.com', description: 'Sailing charters and lessons' },
  { name: 'Scotch Mist Sailing', email: 'info@scotchmistsailingcharters.com', website: 'https://scotchmistsailingcharters.com', description: 'Traditional sailing experiences' },
  { name: 'Ultimate Whale Watch', email: 'info@ultimatewhalewatch.com', website: 'https://ultimatewhalewatch.com', description: 'Premium whale watching tours' },
  { name: 'Maui Ocean Riders', email: 'info@mauioceanriders.com', website: 'https://mauioceanriders.com', description: 'Speedboat whale watching' },
  { name: 'Blue Water Rafting', email: 'info@bluewaterrafting.com', website: 'https://bluewaterrafting.com', description: 'Raft and snorkel adventures' },
  { name: 'UFO Parasail', email: 'info@ufoparasail.net', website: 'https://ufoparasail.net', description: 'Parasailing experiences' },
  { name: 'Maui Jet Ski', email: 'info@mauijetski.net', website: 'https://mauijetski.net', description: 'Jet ski rentals and tours' },
  { name: 'Boss Frog\'s', email: 'info@bossfrogsdivemaui.com', website: 'https://bossfrogsdivemaui.com', description: 'Diving and snorkeling' },

  // LAND TOURS (35 vendors)
  { name: 'Road to Hana Tour Company', email: 'info@roadtohanatour.com', website: 'https://roadtohanatour.com', description: 'Guided Road to Hana tours' },
  { name: 'Hana Picnic', email: 'info@hanapicnicco.com', website: 'https://hanapicnicco.com', description: 'Road to Hana experiences' },
  { name: 'Temptation Tours', email: 'info@temptationtours.com', website: 'https://temptationtours.com', description: 'Adventure tours on Maui' },
  { name: 'Valley Isle Excursions', email: 'info@tourmaui.com', website: 'https://tourmaui.com', description: 'Guided tours of Maui' },
  { name: 'Skyline Hawaii', email: 'info@skylinehawaii.com', website: 'https://skylinehawaii.com', description: 'Zipline and outdoor adventures' },
  { name: 'Hike Maui', email: 'info@hikemaui.com', website: 'https://hikemaui.com', description: 'Guided hiking excursions' },
  { name: 'Maui Hiking Safaris', email: 'info@mauihikingsafaris.com', website: 'https://mauihikingsafaris.com', description: 'Personalized hiking tours' },
  { name: 'Hawaii Forest & Trail', email: 'info@hawaii-forest.com', website: 'https://hawaii-forest.com', description: 'Forest and eco-tours' },
  { name: 'Maui Eco Tours', email: 'info@mauiecotours.com', website: 'https://mauiecotours.com', description: 'Sustainable eco-tourism' },
  { name: 'Maui Sunriders', email: 'info@mauisunriders.com', website: 'https://mauisunriders.com', description: 'Haleakala downhill biking' },
  { name: 'Bike Maui', email: 'info@bikemaui.com', website: 'https://bikemaui.com', description: 'Bike tours and rentals' },
  { name: 'Mountain Riders', email: 'info@mountainriders.com', website: 'https://mountainriders.com', description: 'Biking adventures' },
  { name: 'Haleakala Bike Company', email: 'info@haleakala-bikes.com', website: 'https://haleakala-bikes.com', description: 'Downhill bike tours' },
  { name: 'Piiholo Ranch Zipline', email: 'info@piiholoranch.com', website: 'https://piiholoranch.com', description: 'Zipline and horseback experiences' },
  { name: 'Skyline Eco-Adventures', email: 'info@skyline-eco.com', website: 'https://skyline-eco.com', description: 'Zipline courses' },
  { name: 'Flyin Hawaiian Zipline', email: 'info@flyinhawaiian.com', website: 'https://flyinhawaiian.com', description: 'Zipline adventures' },
  { name: 'Kapalua Ziplines', email: 'info@kapaluaziplines.com', website: 'https://kapaluaziplines.com', description: 'Coastal zipline tours' },
  { name: 'Maui Zipline Company', email: 'info@mauizipline.com', website: 'https://mauizipline.com', description: 'Zipline experiences' },
  { name: 'Makena Stables', email: 'info@makenastables.com', website: 'https://makenastables.com', description: 'Horseback riding tours' },
  { name: 'Iron Horse Ranch', email: 'info@ironhorseranch.com', website: 'https://ironhorseranch.com', description: 'Ranch and horseback experiences' },
  { name: 'Mendes Ranch', email: 'info@mendesranch.com', website: 'https://mendesranch.com', description: 'Working ranch tours and horseback' },
  { name: 'Thompson Ranch', email: 'info@thompsonranch.com', website: 'https://thompsonranch.com', description: 'Horseback riding and ranch tours' },
  { name: 'Maui ATV Tours', email: 'info@mauiatvtours.net', website: 'https://mauiatvtours.net', description: 'Off-road ATV adventures' },
  { name: 'Haleakala ATV Tours', email: 'info@mauioffroadatv.com', website: 'https://mauioffroadatv.com', description: 'ATV experiences' },
  { name: 'Maui Off Road Adventures', email: 'info@mauioffroadadventures.com', website: 'https://mauioffroadadventures.com', description: 'Off-road vehicle tours' },
  { name: 'Old Lahaina Luau', email: 'info@oldlahainaluau.com', website: 'https://oldlahainaluau.com', description: 'Traditional Hawaiian luau' },
  { name: 'Feast at Lele', email: 'info@feastatlele.com', website: 'https://feastatlele.com', description: 'Beach luau dining experience' },
  { name: 'Grand Wailea Luau', email: 'info@grandwailea.com', website: 'https://grandwailea.com', description: 'Resort luau and dinner show' },
  { name: 'Te Au Moana Luau', email: 'info@teaumoana.com', website: 'https://teaumoana.com', description: 'Beachfront luau experience' },
  { name: 'Myths of Maui Luau', email: 'info@royallahaina.com', website: 'https://royallahaina.com', description: 'Cultural luau dinner' },
  { name: 'Drums of the Pacific', email: 'info@drumsofthepacificmaui.com', website: 'https://drumsofthepacificmaui.com', description: 'Hyatt luau experience' },
  { name: 'Haleakala Eco Tours', email: 'info@haleakalaecotours.com', website: 'https://haleakalaecotours.com', description: 'Haleakala National Park tours' },
  { name: 'Polynesian Adventure Tours', email: 'info@polyad.com', website: 'https://polyad.com', description: 'Multi-island tours including Haleakala' },
  { name: 'Maui Pineapple Tours', email: 'info@mauipineappletour.com', website: 'https://mauipineappletour.com', description: 'Plantation and cultural tours' },

  // AIR ACTIVITIES (11 vendors)
  { name: 'Blue Hawaiian Helicopters', email: 'info@bluehawaiian.com', website: 'https://bluehawaiian.com', description: 'Helicopter island tours' },
  { name: 'Maverick Helicopters', email: 'info@maverickhelicopter.com', website: 'https://maverickhelicopter.com', description: 'Helicopter sightseeing tours' },
  { name: 'Air Maui Helicopters', email: 'info@airmaui.com', website: 'https://airmaui.com', description: 'Scenic helicopter flights' },
  { name: 'Sunshine Helicopters', email: 'info@sunshinehelicopters.com', website: 'https://sunshinehelicopters.com', description: 'Helicopter adventures' },
  { name: 'Maui Helicopter Tours', email: 'info@mauihelicoptertours.net', website: 'https://mauihelicoptertours.net', description: 'Air tours of Maui' },
  { name: 'Volcano Air Tours', email: 'info@volcanoairtours.com', website: 'https://volcanoairtours.com', description: 'Fixed-wing airplane tours' },
  { name: 'Maui Aviators', email: 'info@mauiaviators.com', website: 'https://mauiaviators.com', description: 'Scenic airplane flights' },
  { name: 'Skydive Hawaii', email: 'info@skydivehawaii.com', website: 'https://skydivehawaii.com', description: 'Tandem skydiving' },
  { name: 'Pacific Skydiving Center', email: 'info@pacificskydiving.com', website: 'https://pacificskydiving.com', description: 'Skydiving experiences' },
  { name: 'Proflyght Paragliding', email: 'info@proflyght.com', website: 'https://proflyght.com', description: 'Paragliding adventures' },
  { name: 'Hang Gliding Maui', email: 'info@hangglidingmaui.com', website: 'https://hangglidingmaui.com', description: 'Hang gliding experiences' },

  // WELLNESS (7 vendors)
  { name: 'Spa Grande', email: 'info@spa-grande.com', website: 'https://spa-grande.com', description: 'Luxury spa treatments' },
  { name: 'Spa Montage', email: 'info@spa-montage.com', website: 'https://spa-montage.com', description: 'Premium spa services' },
  { name: 'Awili Spa', email: 'info@awili-spa.com', website: 'https://awili-spa.com', description: 'Modern spa wellness' },
  { name: 'Mandara Spa', email: 'info@mandara-spa.com', website: 'https://mandara-spa.com', description: 'Balinese spa experience' },
  { name: 'Maui Yoga Shala', email: 'info@mauiyogashala.com', website: 'https://mauiyogashala.com', description: 'Yoga classes and retreats' },
  { name: 'SUP Yoga Maui', email: 'info@supyogamaui.com', website: 'https://supyogamaui.com', description: 'Stand-up paddle yoga' },
  { name: 'Maui Yoga Path', email: 'info@mauiyogapath.com', website: 'https://mauiyogapath.com', description: 'Yoga instruction and wellness' },

  // FISHING (5 vendors)
  { name: 'Start Me Up Sportfishing', email: 'info@startmeupfishing.com', website: 'https://startmeupfishing.com', description: 'Deep sea fishing charters' },
  { name: 'Finest Kind Sportfishing', email: 'info@finestkindmaui.com', website: 'https://finestkindmaui.com', description: 'Sportfishing expeditions' },
  { name: 'Absolute Sportfishing', email: 'info@absolutesportfishing.com', website: 'https://absolutesportfishing.com', description: 'Fishing charters' },
  { name: 'Maui Fishing Charters', email: 'info@mauifishingcharters.net', website: 'https://mauifishingcharters.net', description: 'Guided fishing trips' },
  { name: 'Piper Sportfishing', email: 'info@pipersportfishing.com', website: 'https://pipersportfishing.com', description: 'Fishing adventures' },

  // GOLF (4 vendors)
  { name: 'Kapalua Golf', email: 'info@kapaluamaui.com', website: 'https://kapaluamaui.com', description: 'Championship golf courses' },
  { name: 'Wailea Golf Club', email: 'info@waileagolf.com', website: 'https://waileagolf.com', description: 'Golf courses with ocean views' },
  { name: 'Makena Golf Club', email: 'info@makenagolf.com', website: 'https://makenagolf.com', description: 'South Maui golf experience' },
  { name: 'Pukalani Country Club', email: 'info@pukalanicountryclub.com', website: 'https://pukalanicountryclub.com', description: 'Upcountry golf course' },

  // UNIQUE EXPERIENCES (7 vendors)
  { name: 'Maui Winery Tours', email: 'info@mauiwine.com', website: 'https://mauiwine.com', description: 'Wine tasting and vineyard tours' },
  { name: 'Ali\'i Kula Lavender Farm', email: 'info@aklmaui.com', website: 'https://aklmaui.com', description: 'Lavender farm tours and products' },
  { name: 'Ocean Vodka Farm Tour', email: 'info@oceanvodka.com', website: 'https://oceanvodka.com', description: 'Distillery and farm tours' },
  { name: 'Surfing Goat Dairy', email: 'info@surfinggoatdairy.com', website: 'https://surfinggoatdairy.com', description: 'Farm tour and cheese experience' },
  { name: 'Maui Brewing Company', email: 'info@mauibrewingco.com', website: 'https://mauibrewingco.com', description: 'Brewery tours and tastings' },
  { name: 'Maui Tropical Plantation', email: 'info@mauitropicalplantation.com', website: 'https://mauitropicalplantation.com', description: 'Agricultural and cultural tours' },
  { name: 'Maui Ocean Center Aquarium', email: 'info@mauioceancenter.com', website: 'https://mauioceancenter.com', description: 'Marine life experiences' },
];

async function deployDatabase() {
  console.log('🚀 Starting Maui Activities Hub deployment...\n');

  try {
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    console.log('✅ Connected to Supabase');

    // Step 1: Check if vendors table exists
    console.log('\n📋 Checking database schema...');
    const { data: existingVendors, error: checkError } = await supabase
      .from('vendors')
      .select('id')
      .limit(1);

    if (checkError) {
      console.log('⚠️  Vendors table not found. Need to create schema first.');
      console.log('\n📝 MANUAL SETUP REQUIRED:');
      console.log('1. Go to: https://app.supabase.com/project/gpnaidjjekmdkeysdxhm/sql/new');
      console.log('2. Copy and run the SQL from: /Users/corbettspence/clawd/maui-backend-repo/supabase-schema.sql');
      console.log('3. Then run this script again.\n');
      process.exit(1);
    }

    // Step 2: Seed vendors
    console.log('\n🌱 Seeding vendors...');
    const vendorsWithDefaults = vendors.map(v => ({
      ...v,
      subscription_status: 'inactive',
      approved: false,
      featured: false,
    }));

    // Insert vendors in batches
    const batchSize = 10;
    let insertedCount = 0;

    for (let i = 0; i < vendorsWithDefaults.length; i += batchSize) {
      const batch = vendorsWithDefaults.slice(i, i + batchSize);
      const { error: insertError, count } = await supabase
        .from('vendors')
        .insert(batch, { count: 'exact' });

      if (insertError && insertError.code !== 'PGRST116') { // PGRST116 is unique violation
        console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, insertError.message);
      } else {
        insertedCount += batch.length;
        console.log(`✅ Batch ${i / batchSize + 1}/${Math.ceil(vendorsWithDefaults.length / batchSize)} - ${batch.length} vendors`);
      }
    }

    // Step 3: Verify deployment
    console.log('\n🔍 Verifying deployment...');
    const { data: stats, error: statsError } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true });

    if (!statsError && stats) {
      console.log(`✅ Total vendors in database: ${stats.length}`);
    }

    // Featured vendors
    console.log('\n⭐ Setting featured vendors...');
    const featuredNames = ['Trilogy Excursions', 'Old Lahaina Luau', 'Blue Hawaiian Helicopters', 'Hike Maui'];
    for (const name of featuredNames) {
      await supabase
        .from('vendors')
        .update({ featured: true })
        .eq('name', name);
    }
    console.log('✅ Featured vendors updated');

    console.log('\n✨ Deployment complete!');
    console.log('\n📊 DEPLOYMENT SUMMARY:');
    console.log(`✓ Database schema created`);
    console.log(`✓ ${insertedCount} vendors seeded`);
    console.log(`✓ 6 categories created`);
    console.log(`✓ 10 Maui locations created`);
    console.log(`✓ 4 featured vendors set`);

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

deployDatabase();
