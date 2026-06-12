import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Save } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Spinner from "../components/ui/Spinner";
import LessonInfoForm from "../components/admin/LessonInfoForm";
import StepForm from "../components/admin/StepForm";
import StepList from "../components/admin/StepList";

const emptyMeta = {
  id: "",
  sectionId: "",
  title_en: "",
  title_gr: "",
  intro_en: "",
  intro_gr: "",
  content_en: "",
  content_gr: "",
};

export default function AdminLessonEditor() {
  const { t } = useTranslation();
  const [meta, setMeta] = useState(emptyMeta);
  const [steps, setSteps] = useState([]);
  const [status, setStatus] = useState(null); // null | "loading" | { type, text }

  const handleMetaChange = (field, value) =>
    setMeta((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const toParagraphs = (text) =>
        text
          .split("\n")
          .map((p) => p.trim())
          .filter(Boolean);

      const { error } = await supabase.from("lessons").upsert([
        {
          id: meta.id,
          section_id: meta.sectionId,
          title_en: meta.title_en,
          title_gr: meta.title_gr,
          intro_en: meta.intro_en,
          intro_gr: meta.intro_gr,
          content_en: toParagraphs(meta.content_en),
          content_gr: toParagraphs(meta.content_gr),
          steps_en: steps,
          steps_gr: steps,
        },
      ]);

      if (error) throw error;
      setStatus({ type: "success", text: t("admin.saveSuccess") });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        text: t("admin.saveError", { message: err.message }),
      });
    }
  };

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold text-white">
        {t("admin.createLesson")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <LessonInfoForm meta={meta} onChange={handleMetaChange} />
        <StepForm onAdd={(step) => setSteps((current) => [...current, step])} />
        <StepList
          steps={steps}
          onRemove={(idx) =>
            setSteps((current) => current.filter((_, i) => i !== idx))
          }
        />

        <div className="flex items-center gap-4">
          <Button type="submit" icon={Save} disabled={status === "loading"}>
            {t("admin.saveLesson")}
          </Button>
          {status === "loading" && <Spinner size="sm" />}
        </div>

        {status && status !== "loading" && (
          <Alert variant={status.type}>{status.text}</Alert>
        )}
      </form>
    </section>
  );
}
