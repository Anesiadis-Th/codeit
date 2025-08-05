import { supabase } from "./supabaseClient";

export async function submitCode({ lessonId, code, languageId = 50 }) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("User not logged in");

  // 1. Insert the submission (minimal return)
  const { error: insertError } = await supabase.from("submissions").insert([
    {
      user_id: user.id,
      lesson_id: lessonId,
      code,
      language_id: languageId,
      status: "pending",
      output: "",
    },
  ]);

  if (insertError) throw insertError;

  // 2. Fetch latest submission by this user & lesson
  const { data: rows, error: fetchError } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (fetchError) throw fetchError;
  if (!rows || rows.length === 0) {
    throw new Error("Submission inserted, but failed to fetch.");
  }

  return rows[0]; // ✅ the inserted submission
}
