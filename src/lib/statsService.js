import { supabase } from "./supabaseClient";

// Initialize stats for new users
export async function initUserStats() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.provider === "anonymous") return; //  skip guest

  const { data, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", user.id);

  if (error) throw error;

  if (data.length === 0) {
    await supabase.from("user_stats").insert([
      {
        user_id: user.id,
        xp: 0,
        streak: 1,
        last_active: new Date().toISOString().slice(0, 10),
      },
    ]);
  }
}

// Award XP and update streak
export async function awardXP(amount = 10) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.provider === "anonymous") return; // skip guest

  const today = new Date().toISOString().slice(0, 10);

  const { data: stats, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) throw error;

  let newStreak = stats.streak;
  const lastDate = stats.last_active;

  if (lastDate !== today) {
    newStreak += 1;
  }

  await supabase
    .from("user_stats")
    .update({
      xp: stats.xp + amount,
      streak: newStreak,
      last_active: today,
    })
    .eq("user_id", user.id);
}

// Fetch stats to display in UI
export async function getUserStats() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return null; // 👈 guard: no query if not logged in

  const { data, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) throw error;
  return data;
}
