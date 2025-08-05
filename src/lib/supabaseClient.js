import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wsztkioepqioqozdsrxg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzenRraW9lcHFpb3FvemRzcnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDM0NDIsImV4cCI6MjA2MjYxOTQ0Mn0.Fn4ZTkeEDsEzLCOVh4YFq_nFV7QALgDPGhDZIcnPfeU";
export const supabase = createClient(supabaseUrl, supabaseKey);
