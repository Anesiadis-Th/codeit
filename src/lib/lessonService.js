import { supabase } from "./supabaseClient";
import i18n from "i18next";

// Fetch all lessons
export async function fetchAllLessons() {
  const lang = i18n.language || "en";

  const { data, error } = await supabase
    .from("lessons")
    .select(
      `
      id,
      section_id,
      order,
      title_${lang}
    `
    )
    .order("order", { ascending: true });

  if (error) throw error;

  const lessons = data.map((lesson) => ({
    ...lesson,
    title: lesson[`title_${lang}`],
  }));

  return lessons;
}

// Fetch one lesson by ID
export async function fetchLessonById(id) {
  const lang = i18n.language || "en";

  const { data, error } = await supabase
    .from("lessons")
    .select(
      `
      id,
      section_id,
      title_${lang},
      intro_${lang},
      content_${lang},
      steps_${lang}
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  return {
    ...data,
    title: data[`title_${lang}`],
    intro: data[`intro_${lang}`],
    content: data[`content_${lang}`],
    steps: data[`steps_${lang}`],
  };
}
