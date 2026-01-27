#!/bin/bash

# Deploy Supabase schema and seed data
# This script applies the schema.sql and vendor seeds to the Supabase database

SUPABASE_URL="https://gpnaidjjekmdkeysdxhm.supabase.co"
SUPABASE_KEY="sb_secret_MzGYDgDnQ7buC39Wpy3aDQ_ASfkUQCD"

echo "🚀 Starting Supabase deployment..."
echo "Database: $SUPABASE_URL"

# Read schema file
SCHEMA_SQL=$(cat supabase-schema.sql)
VENDORS_SQL=$(cat seed-vendors.sql)

# Combine SQL
COMBINED_SQL="$SCHEMA_SQL

$VENDORS_SQL"

# Write combined SQL to temp file
echo "$COMBINED_SQL" > /tmp/deploy.sql

echo "✅ SQL files prepared for deployment"
echo "📝 Schema and vendors SQL ready to be executed in Supabase SQL Editor"
echo ""
echo "⚠️  NEXT STEPS:"
echo "1. Go to: https://app.supabase.com/project/gpnaidjjekmdkeysdxhm/sql/new"
echo "2. Copy and paste the content from: /tmp/deploy.sql"
echo "3. Click 'RUN'"
echo "4. Verify tables and data are created"
echo ""
echo "Or use psql if you have it installed:"
echo "psql 'postgresql://postgres:YOUR_PASSWORD@db.gpnaidjjekmdkeysdxhm.supabase.co:5432/postgres' < /tmp/deploy.sql"
