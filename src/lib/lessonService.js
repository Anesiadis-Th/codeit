import { supabase } from "./supabaseClient";

// Fetch all lessons
export async function fetchAllLessons() {
  const { data, error } = await supabase
    .from("lessons")
    .select(
      `
      id,
      section_id,
      "order",
      title_en,
      title_gr
    `
    )
    .order("order", { ascending: true });

  if (error) throw error;
  return data;
}

// Fetch one lesson by ID
export async function fetchLessonById(id) {
  const { data, error } = await supabase
    .from("lessons")
    .select(
      `
      id,
      section_id,
      title_en, title_gr,
      intro_en, intro_gr,
      content_en, content_gr,
      steps_en, steps_gr
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
