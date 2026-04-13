"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DiagnosePage() {
  const [status, setStatus] = useState("Checking...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      try {
        const { data, error } = await supabase.from("opportunities").select("count");
        if (error) {
          setError(error.message);
          setStatus("Supabase Error");
        } else {
          setStatus("Supabase OK");
        }
      } catch (e: any) {
        setError(e.message);
        setStatus("Crash");
      }
    }
    check();
  }, []);

  return (
    <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
      <h1>Diagnostic Page</h1>
      <p>Status: <strong>{status}</strong></p>
      {error && <pre style={{ color: "red", background: "#fee", padding: "10px" }}>{error}</pre>}
      <hr />
      <p>If you see this, basic React rendering is working.</p>
    </div>
  );
}
