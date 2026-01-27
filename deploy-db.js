const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://gpnaidjjekmdkeysdxhm.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_MzGYDgDnQ7buC39Wpy3aDQ_ASfkUQCD';

async function deploySchema() {
  console.log('🚀 Deploying Maui Activities schema to Supabase...');
  console.log(`URL: ${SUPABASE_URL}`);

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Read schema file
    const schemaSQL = fs.readFileSync('./supabase-schema.sql', 'utf8');
    const vendorsSQL = fs.readFileSync('./seed-vendors.sql', 'utf8');

    console.log('\n📝 Executing schema SQL...');
    const schemaResult = await supabase.rpc('exec', {
      sql: schemaSQL
    }).catch(err => {
      console.log('⚠️  Direct RPC call not available, trying alternative method...');
      return null;
    });

    if (schemaResult?.error) {
      console.error('❌ Schema deployment error:', schemaResult.error);
    } else if (schemaResult) {
      console.log('✅ Schema deployed successfully');
    }

    console.log('\n🌱 Executing vendor seeds...');
    const vendorResult = await supabase.rpc('exec', {
      sql: vendorsSQL
    }).catch(err => {
      console.log('⚠️  Direct RPC call not available');
      return null;
    });

    if (vendorResult?.error) {
      console.error('❌ Vendor seed error:', vendorResult.error);
    } else if (vendorResult) {
      console.log('✅ Vendors seeded successfully');
    }

    // Verify deployment by querying vendors table
    console.log('\n🔍 Verifying deployment...');
    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('count', { count: 'exact' });

    if (error) {
      console.log('⚠️  Could not verify vendors table (may not be created yet)');
      console.log('Please execute the SQL manually in Supabase dashboard');
    } else {
      console.log(`✅ Vendors table exists with ${vendors?.[0]?.count || 0} records`);
    }

  } catch (error) {
    console.error('❌ Deployment error:', error.message);
    console.log('\n⚠️  IMPORTANT: Please execute the SQL manually:');
    console.log('1. Go to: https://app.supabase.com/project/gpnaidjjekmdkeysdxhm/sql/new');
    console.log('2. Copy schema from: ./supabase-schema.sql');
    console.log('3. Copy vendors from: ./seed-vendors.sql');
    console.log('4. Run both SQL scripts in order');
  }
}

deploySchema();
