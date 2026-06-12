import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";

const fields = [
  { name: "id", placeholder: "Lesson ID (e.g. c-arrays)" },
  { name: "sectionId", placeholder: "Section ID (e.g. pointers-c)" },
  { name: "title_en", placeholder: "Lesson Title (English)" },
  { name: "title_gr", placeholder: "Lesson Title (Greek)" },
  { name: "intro_en", placeholder: "Lesson Intro (English)", rows: 2 },
  { name: "intro_gr", placeholder: "Lesson Intro (Greek)", rows: 2 },
  {
    name: "content_en",
    placeholder: "Lesson content (English, 1 paragraph per line)",
    rows: 4,
  },
  {
    name: "content_gr",
    placeholder: "Lesson content (Greek, 1 paragraph per line)",
    rows: 4,
  },
];

export default function LessonInfoForm({ meta, onChange }) {
  const { t } = useTranslation();

  return (
    <Card variant="static">
      <h3 className="mb-4 text-lg font-semibold text-white">
        {t("admin.lessonInfo")}
      </h3>
      <div className="flex flex-col gap-3">
        {fields.map(({ name, placeholder, rows }) =>
          rows ? (
            <Textarea
              key={name}
              rows={rows}
              placeholder={placeholder}
              value={meta[name]}
              onChange={(e) => onChange(name, e.target.value)}
            />
          ) : (
            <Input
              key={name}
              type="text"
              placeholder={placeholder}
              value={meta[name]}
              onChange={(e) => onChange(name, e.target.value)}
            />
          )
        )}
      </div>
    </Card>
  );
}
