import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import globalStyles from "../styles/globals.module.css";
import AdminLessonEditor from "./AdminLessonEditor";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const { i18n } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching admin status:", error.message);
        setLoading(false);
        return;
      }

      setIsAdmin(data?.is_admin === true);
      setLoading(false);
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    if (isAdmin) fetchLessons();
  }, [isAdmin, i18n.language]);

  const fetchLessons = async () => {
    const { data, error } = await supabase
      .from("lessons")
      .select("id, section_id, title_en, title_gr")
      .order("order", { ascending: true });

    if (error) {
      console.error("Error fetching lessons:", error.message);
      return;
    }
    const lang =
      (i18n.language || "en").toLowerCase().startsWith("gr") ||
      (i18n.language || "en").toLowerCase().startsWith("el")
        ? "gr"
        : "en";
    const withDisplay = (data || []).map((l) => ({
      id: l.id,
      section_id: l.section_id,
      title:
        lang === "gr" ? l.title_gr || l.title_en : l.title_en || l.title_gr,
    }));
    setLessons(withDisplay);
  };

  if (loading) return <p>Checking permissions...</p>;
  if (!isAdmin) return <p>⛔ Access denied.</p>;

  return (
    <div className={globalStyles.container}>
      <h2 className={globalStyles.title}>Admin Panel</h2>

      <h3>Existing Lessons</h3>
      {lessons.length === 0 ? (
        <p>No lessons found.</p>
      ) : (
        <ul>
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <strong>{lesson.title}</strong> <small>({lesson.id})</small>
            </li>
          ))}
        </ul>
      )}

      <hr />

      <AdminLessonEditor />
    </div>
  );
}
