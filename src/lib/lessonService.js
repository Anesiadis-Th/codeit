import { supabase } from "./supabaseClient";

// Fetch all lessons
// Fetch all lessons, ordered manually
export async function fetchAllLessons() {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .order("order", { ascending: true }); // ✅ This line ensures correct order
  if (error) throw error;
  return data;
}

// Fetch one lesson by ID
export async function fetchLessonById(id) {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
