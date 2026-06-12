import { useTranslation } from "react-i18next";
import Input from "../ui/Input";

export default function QuestionFillBlank({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <Input
      type="text"
      className="my-4"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t("lesson.typeAnswer")}
    />
  );
}
