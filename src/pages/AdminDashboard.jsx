import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useLang } from "../hooks/useLang";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import AdminLessonEditor from "./AdminLessonEditor";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { localize } = useLang();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchLessons = async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("id, section_id, title_en, title_gr")
        .order("order", { ascending: true });

      if (error) {
        console.error("Error fetching lessons:", error.message);
        return;
      }
      if (!isMounted) return;

      setLessons(
        (data || []).map((lesson) => ({
          id: lesson.id,
          section_id: lesson.section_id,
          title: localize(lesson, "title"),
        }))
      );
    };

    fetchLessons();

    return () => {
      isMounted = false;
    };
  }, [localize]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="animate-fade-up my-6 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
        <ShieldCheck className="size-9 shrink-0 text-accent-300" aria-hidden="true" />
        <span className="text-gradient">{t("admin.title")}</span>
      </h1>

      <Card variant="static" className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-white">
          {t("admin.existingLessons")}
        </h2>

        {lessons.length === 0 ? (
          <p className="text-sm text-fg-muted">{t("admin.noLessons")}</p>
        ) : (
          <ul className="space-y-2">
            {lessons.map((lesson) => (
              <li
                key={lesson.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-ink-900 px-4 py-3"
              >
                <div>
                  <span className="font-medium">{lesson.title}</span>{" "}
                  <span className="text-xs text-fg-muted">({lesson.id})</span>
                </div>
                {lesson.section_id && (
                  <Badge variant="muted">{lesson.section_id}</Badge>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <AdminLessonEditor />
    </div>
  );
}
