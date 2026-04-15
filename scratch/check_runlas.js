import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ecycsdphxwcyuebrwgki.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjeWNzZHBoeHdjeXVlYnJ3Z2tpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA4OTk0MCwiZXhwIjoyMDkxNjY1OTQwfQ.TaLkclBmvQlW-tnndGuNALV6YUmubF-i6EUV6A4YRU4'
);

async function checkRunlasTable() {
  console.log('--- Checking runlas_forms table ---');
  const { data, error } = await supabase.from('runlas_forms').select('*').limit(5);

  if (error) {
    if (error.code === '42P01') {
      console.log('❌ TABLE DOES NOT EXIST: runlas_forms');
    } else {
      console.log('❌ Error fetching from runlas_forms:', error.message);
      console.log('Error Code:', error.code);
    }
    return;
  }

  console.log('✅ TABLE EXISTS: runlas_forms');
  console.log(`Found ${data.length} records.`);
  if (data.length > 0) {
    console.log('Sample data keys:', Object.keys(data[0]));
    console.log('Sample data:', data[0]);
  }
}

checkRunlasTable();
