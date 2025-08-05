import { supabase } from "./supabaseClient";

// Get progress for the current user
export async function fetchUserProgress() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user.id);

  if (error) throw error;
  return data;
}

// Mark a lesson as completed
export async function completeLesson(lessonId) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase
    .from("progress")
    .upsert([
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        updated_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) throw error;
  return data;
}
