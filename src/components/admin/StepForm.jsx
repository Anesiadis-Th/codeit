import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import Button from "../ui/Button";

const emptyStepData = {
  question: "",
  options: ["", "", "", ""],
  answer: 0,
  help: "",
  description: "",
  starterCode: "",
  expectedOutput: "",
};

export default function StepForm({ onAdd }) {
  const { t } = useTranslation();
  const [stepType, setStepType] = useState("multiple-choice");
  const [stepData, setStepData] = useState(emptyStepData);

  const update = (field, value) =>
    setStepData((data) => ({ ...data, [field]: value }));

  const handleAdd = () => {
    let step;
    if (stepType === "multiple-choice") {
      step = {
        type: "multiple-choice",
        question: stepData.question,
        options: stepData.options.filter(Boolean),
        answer: Number(stepData.answer),
        help: stepData.help,
      };
    } else if (stepType === "code") {
      step = {
        type: "code",
        description: stepData.description,
        starterCode: stepData.starterCode,
        expectedOutput: stepData.expectedOutput,
        help: stepData.help,
      };
    } else if (stepType === "fill-in-the-blank") {
      step = {
        type: "fill-in-the-blank",
        question: stepData.question,
        answer: stepData.answer,
        help: stepData.help,
      };
    }

    onAdd(step);
    setStepData(emptyStepData);
  };

  return (
    <Card variant="static">
      <h3 className="mb-4 text-lg font-semibold text-white">
        {t("admin.addStep")}
      </h3>

      <div className="flex flex-col gap-3">
        <Select value={stepType} onChange={(e) => setStepType(e.target.value)}>
          <option value="multiple-choice">Multiple Choice</option>
          <option value="fill-in-the-blank">Fill in the Blank</option>
          <option value="code">Code Task</option>
        </Select>

        {stepType === "multiple-choice" && (
          <>
            <Input
              type="text"
              placeholder="Question"
              value={stepData.question}
              onChange={(e) => update("question", e.target.value)}
            />
            {stepData.options.map((opt, idx) => (
              <Input
                key={idx}
                type="text"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => {
                  const updated = [...stepData.options];
                  updated[idx] = e.target.value;
                  update("options", updated);
                }}
              />
            ))}
            <Input
              type="number"
              placeholder="Correct Answer Index (0-based)"
              value={stepData.answer}
              onChange={(e) => update("answer", e.target.value)}
            />
          </>
        )}

        {stepType === "fill-in-the-blank" && (
          <>
            <Input
              type="text"
              placeholder="Question with blank"
              value={stepData.question}
              onChange={(e) => update("question", e.target.value)}
            />
            <Input
              type="text"
              placeholder="Correct Answer"
              value={stepData.answer}
              onChange={(e) => update("answer", e.target.value)}
            />
          </>
        )}

        {stepType === "code" && (
          <>
            <Textarea
              placeholder="Description"
              value={stepData.description}
              onChange={(e) => update("description", e.target.value)}
              rows={2}
            />
            <Textarea
              placeholder="Starter Code"
              value={stepData.starterCode}
              onChange={(e) => update("starterCode", e.target.value)}
              rows={6}
              className="font-mono"
            />
            <Input
              type="text"
              placeholder="Expected Output"
              value={stepData.expectedOutput}
              onChange={(e) => update("expectedOutput", e.target.value)}
            />
          </>
        )}

        <Textarea
          placeholder="Hint (optional)"
          value={stepData.help}
          onChange={(e) => update("help", e.target.value)}
          rows={2}
        />

        <div>
          <Button variant="subtle" icon={Plus} onClick={handleAdd}>
            {t("admin.addStep")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
