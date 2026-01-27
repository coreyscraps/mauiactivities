#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://gpnaidjjekmdkeysdxhm.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_MzGYDgDnQ7buC39Wpy3aDQ_ASfkUQCD';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const activityTemplates = [
  // Water Activities
  { name: 'Snorkeling Tour', description: 'Explore vibrant coral reefs and tropical fish', basePrice: 89, duration: 180, difficulty: 'easy', category: 'Water Activities' },
  { name: 'Scuba Diving Certification', description: 'Get certified and dive deeper into Maui waters', basePrice: 350, duration: 480, difficulty: 'moderate', category: 'Water Activities' },
  { name: 'Sunset Sailing', description: 'Romantic sailing experience with ocean views', basePrice: 125, duration: 240, difficulty: 'easy', category: 'Water Activities' },
  { name: 'Whale Watching Tour', description: 'See majestic humpback whales (seasonal)', basePrice: 79, duration: 180, difficulty: 'easy', category: 'Water Activities' },
  { name: 'Surfing Lesson', description: 'Learn to surf on Maui\'s best beaches', basePrice: 99, duration: 120, difficulty: 'moderate', category: 'Water Activities' },
  { name: 'Jet Ski Adventure', description: 'Thrilling jet ski experience on the ocean', basePrice: 149, duration: 90, difficulty: 'moderate', category: 'Water Activities' },
  { name: 'Kayaking & Snorkeling', description: 'Paddle to secluded snorkeling spots', basePrice: 95, duration: 180, difficulty: 'moderate', category: 'Water Activities' },
  { name: 'Stand-Up Paddleboarding', description: 'Balance and paddle on calm ocean waters', basePrice: 65, duration: 90, difficulty: 'easy', category: 'Water Activities' },

  // Land Tours
  { name: 'Road to Hana Tour', description: 'Scenic drive through 600 curves and 54 bridges', basePrice: 120, duration: 480, difficulty: 'easy', category: 'Land Tours' },
  { name: 'Haleakala Sunrise Experience', description: 'Watch the sunrise from a 10,000ft volcano', basePrice: 85, duration: 300, difficulty: 'easy', category: 'Land Tours' },
  { name: 'Guided Hiking Adventure', description: 'Trek through Maui\'s hidden waterfalls', basePrice: 110, duration: 360, difficulty: 'moderate', category: 'Land Tours' },
  { name: 'Zip-Line Canopy Tour', description: 'Zip through the rainforest canopy', basePrice: 140, duration: 180, difficulty: 'moderate', category: 'Land Tours' },
  { name: 'ATV Off-Road Tour', description: 'Adventure through Maui\'s backcountry', basePrice: 155, duration: 240, difficulty: 'moderate', category: 'Land Tours' },
  { name: 'Horseback Riding Tour', description: 'Ride through scenic Maui landscapes', basePrice: 135, duration: 180, difficulty: 'easy', category: 'Land Tours' },
  { name: 'Luau Experience', description: 'Traditional Hawaiian feast and entertainment', basePrice: 99, duration: 240, difficulty: 'easy', category: 'Land Tours' },
  { name: 'Pineapple Plantation Tour', description: 'Learn about Maui\'s agriculture and history', basePrice: 45, duration: 120, difficulty: 'easy', category: 'Land Tours' },

  // Adventure
  { name: 'Helicopter Tour', description: 'See Maui from the sky with stunning aerial views', basePrice: 249, duration: 60, difficulty: 'easy', category: 'Adventure' },
  { name: 'Skydiving Experience', description: 'Tandem skydive with views of the coastline', basePrice: 299, duration: 120, difficulty: 'hard', category: 'Adventure' },
  { name: 'Paragliding Adventure', description: 'Soar above Maui\'s beautiful landscapes', basePrice: 199, duration: 90, difficulty: 'hard', category: 'Adventure' },
  { name: 'Rock Climbing Experience', description: 'Scale volcanic rock formations', basePrice: 125, duration: 180, difficulty: 'hard', category: 'Adventure' },

  // Wellness
  { name: 'Yoga Retreat Class', description: 'Sunrise yoga with ocean views', basePrice: 45, duration: 90, difficulty: 'easy', category: 'Wellness' },
  { name: 'Spa Massage Treatment', description: 'Traditional Hawaiian massage therapy', basePrice: 120, duration: 60, difficulty: 'easy', category: 'Wellness' },
  { name: 'Meditation & Mindfulness', description: 'Calm your mind in paradise', basePrice: 35, duration: 75, difficulty: 'easy', category: 'Wellness' },

  // Dining
  { name: 'Sunset Dinner Cruise', description: 'Fine dining experience on the ocean', basePrice: 165, duration: 240, difficulty: 'easy', category: 'Dining' },
  { name: 'Cooking Class & Meal', description: 'Learn Hawaiian cuisine and enjoy your creation', basePrice: 95, duration: 180, difficulty: 'easy', category: 'Dining' },
  { name: 'Local Food Tour', description: 'Taste authentic Maui flavors and specialties', basePrice: 85, duration: 180, difficulty: 'easy', category: 'Dining' },
];

async function seedActivities() {
  try {
    console.log('🌱 Seeding activities...\n');

    // Get all vendors
    const { data: vendors, error: vendorError } = await supabase
      .from('vendors')
      .select('id, name')
      .limit(100);

    if (vendorError) throw vendorError;
    console.log(`✅ Found ${vendors.length} vendors\n`);

    // Get categories
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('id, name');

    if (categoryError) throw categoryError;

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // Get locations
    const { data: locations, error: locationError } = await supabase
      .from('locations')
      .select('id, name')
      .limit(10);

    if (locationError) throw locationError;

    // Create activities for each vendor
    let totalInserted = 0;
    const batchSize = 10;

    for (let i = 0; i < vendors.length; i += batchSize) {
      const vendorBatch = vendors.slice(i, i + batchSize);
      
      const activitiesToInsert = [];
      
      vendorBatch.forEach((vendor, idx) => {
        // Assign 2-4 activities per vendor
        const numActivities = Math.floor(Math.random() * 3) + 2;
        
        for (let j = 0; j < numActivities; j++) {
          const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
          const location = locations[Math.floor(Math.random() * locations.length)];
          
          activitiesToInsert.push({
            vendor_id: vendor.id,
            name: template.name,
            description: template.description,
            category_id: categoryMap[template.category],
            location_id: location?.id,
            duration_minutes: template.duration,
            difficulty_level: template.difficulty,
            base_price: Math.round(template.basePrice + (Math.random() * 40 - 20)),
            status: 'published',
            rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
            review_count: Math.floor(Math.random() * 50) + 5,
          });
        }
      });

      // Insert batch
      const { error } = await supabase
        .from('activities')
        .insert(activitiesToInsert);

      if (error) {
        console.error(`❌ Error inserting batch: ${error.message}`);
      } else {
        totalInserted += activitiesToInsert.length;
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}: Inserted ${activitiesToInsert.length} activities`);
      }
    }

    console.log(`\n✨ Done! Created ${totalInserted} activities\n`);
    
    // Verify
    const { data: activityCount } = await supabase
      .from('activities')
      .select('id', { count: 'exact', head: true });

    console.log(`📊 Total activities in database: ${activityCount?.length || 0}`);

  } catch (error) {
    console.error('❌ Error seeding activities:', error);
  }
}

seedActivities();
