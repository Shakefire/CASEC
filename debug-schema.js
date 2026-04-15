import { createClient } from "@supabase/supabase-js";

// Hardcoded for direct debugging
const supabase = createClient(
  "https://ecycsdphxwcyuebrwgki.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjeWNzZHBoeHdjeXVlYnJ3Z2tpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA4OTk0MCwiZXhwIjoyMDkxNjY1OTQwfQ.TaLkclBmvQlW-tnndGuNALV6YUmubF-i6EUV6A4YRU4"
);

async function testDatabase() {
  console.log("--- Supabase Schema Debug ---");
  
  try {
    const { data, error } = await supabase.from('opportunities').select('*').limit(1);
    
    if (error) {
      console.error("SELECT Error:", error.message);
      return;
    }

    const columns = Object.keys(data[0] || {});
    console.log("Available columns in 'opportunities' table:");
    console.log(columns.join(", "));

    const requiredFields = ['posted_by_name', 'location', 'requirements', 'eligibility'];
    const missing = requiredFields.filter(f => !columns.includes(f));
    
    if (missing.length > 0) {
      console.error("MISSING COLUMNS:", missing.join(", "));
    } else {
      console.log("All professional columns found.");
    }

    // Test Insert
    console.log("\nAttempting Test Insert...");
    const dummyPayload = {
      title: "Self-Test Job",
      description: "Testing from script",
      posted_by_name: "Debug Tool",
      location: "San Francisco",
      requirements: ["Requirement 1"],
      eligibility: ["Eligibility A"],
      type: "job",
      deadline: "2026-01-01"
    };

    const { data: ins, error: insErr } = await supabase.from('opportunities').insert([dummyPayload]).select();
    
    if (insErr) {
      console.error("INSERT FAILED:", insErr.message);
      console.error("Details:", insErr.details);
    } else {
      console.log("INSERT SUCCESSFUL!");
      await supabase.from('opportunities').delete().eq('id', ins[0].id);
      console.log("Test record cleaned up.");
    }

  } catch (err) {
    console.error("REACH ERROR:", err.message);
  }
}

testDatabase();
