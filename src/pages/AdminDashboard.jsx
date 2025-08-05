import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import globalStyles from "../styles/globals.module.css";
import AdminLessonEditor from "./AdminLessonEditor";

export default function AdminDashboard() {
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
  }, [isAdmin]);

  const fetchLessons = async () => {
    const { data, error } = await supabase.from("lessons").select("id, title");
    if (error) {
      console.error("Error fetching lessons:", error.message);
      return;
    }
    setLessons(data);
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
              {lesson.id} - {lesson.title}
            </li>
          ))}
        </ul>
      )}

      <hr />

      <AdminLessonEditor />
    </div>
  );
}
