import { supabase } from "./supabaseClient";

// Get progress for the current user
export async function fetchUserProgress() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return []; // safe default when signed out

  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user.id);

  if (error) throw error;
  return data || [];
}

// Mark a lesson as completed
export async function completeLesson(lessonId) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("progress")
    .upsert(
      [
        {
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          updated_at: new Date().toISOString(),
        },
      ]
      // Optional: if your table uses a composite unique key, you can be explicit:
      // { onConflict: "user_id,lesson_id" }
    )
    .select();

  if (error) throw error;
  return data || [];
}
