import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchLessonById } from "../lib/lessonService";
import { completeLesson } from "../lib/progressService";
import { awardXP } from "../lib/statsService";
import { runCCode } from "../lib/judge0Service";
import { useAuth } from "../hooks/useAuth";
import { useLang } from "../hooks/useLang";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Spinner from "../components/ui/Spinner";
import LessonProgress from "../components/lesson/LessonProgress";
import HintBox from "../components/lesson/HintBox";
import QuestionMultipleChoice from "../components/lesson/QuestionMultipleChoice";
import QuestionFillBlank from "../components/lesson/QuestionFillBlank";
import QuestionCode from "../components/lesson/QuestionCode";
import LessonComplete from "../components/lesson/LessonComplete";

export default function LessonScreen() {
  const { t } = useTranslation();
  const { lessonId } = useParams();
  const { isGuest } = useAuth();
  const { localize } = useLang();

  const [lesson, setLesson] = useState(null);
  const [steps, setSteps] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [hasSkipped, setHasSkipped] = useState(false);

  const [code, setCode] = useState("");
  const [codeOutput, setCodeOutput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const base = await fetchLessonById(lessonId);
      if (!isMounted) return;

      const localized = {
        id: base.id,
        section_id: base.section_id,
        title: localize(base, "title"),
        intro: localize(base, "intro"),
        content: localize(base, "content"),
        steps: localize(base, "steps"),
      };

      const normalizedSteps = (localized.steps || []).map((s) =>
        s?.type === "code_task" ? { ...s, type: "code" } : s
      );

      setLesson(localized);
      setSteps(normalizedSteps);

      const firstCode = normalizedSteps.find((s) => s.type === "code");
      if (firstCode) setCode(firstCode.starterCode);
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [lessonId, localize]);

  useEffect(() => {
    setShowHint(false);
    setCodeOutput("");
    setCodeError("");
    setIsCorrect(null);
  }, [questionIndex]);

  // Wrong-answer feedback fades out on its own (not navigation, just decay)
  useEffect(() => {
    if (
      isCorrect === false &&
      steps.length > 0 &&
      questionIndex >= 0 &&
      questionIndex < steps.length &&
      steps[questionIndex].type !== "code"
    ) {
      const timer = setTimeout(() => setIsCorrect(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, steps, questionIndex]);

  if (!lesson || !Array.isArray(steps) || steps.length === 0) {
    return <Spinner className="mx-auto my-16" />;
  }

  const currentStep = steps[questionIndex];
  const isLastStep = questionIndex === steps.length - 1;

  const handleRunCode = async () => {
    setIsRunning(true);
    setCodeOutput("");
    setCodeError("");
    setIsCorrect(null);

    try {
      const result = await runCCode(code);
      const actual = result.stdout.trim();
      const expected = currentStep.expectedOutput.trim();

      setCodeOutput(actual);

      if (result.stderr) {
        setCodeError(result.stderr);
      } else {
        setIsCorrect(actual === expected);
      }
    } catch (err) {
      setCodeError("Execution error: " + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const advanceToNext = () => {
    setSelected(null);
    setInputAnswer("");
    setIsCorrect(null);
    setAnsweredCorrectly(false);
    setShowHint(false);
    setQuestionIndex((prev) => {
      const nextIndex = prev + 1;
      if (steps[nextIndex]?.type === "code") {
        setCode(steps[nextIndex].starterCode);
      }
      return nextIndex;
    });
  };

  const handleSubmit = async () => {
    let correct = false;

    if (currentStep.type === "multiple-choice") {
      correct = selected === currentStep.answer;
    } else if (
      currentStep.type === "short-answer" ||
      currentStep.type === "fill-in-the-blank"
    ) {
      correct =
        inputAnswer.trim().toLowerCase() ===
        currentStep.answer.trim().toLowerCase();
    } else if (currentStep.type === "code") {
      correct = codeOutput.trim() === currentStep.expectedOutput.trim();
    }

    setIsCorrect(correct);

    if (!correct) return;

    if (isLastStep) {
      setCompleted(true);
      await completeLesson(lesson.id);
      if (!hasSkipped) {
        await awardXP(10);
      }
    } else {
      setAnsweredCorrectly(true);
    }
  };

  const handleSkip = () => {
    setHasSkipped(true);

    if (isLastStep) {
      setCompleted(true);
    } else {
      advanceToNext();
    }
  };

  const submitDisabled =
    (currentStep.type === "multiple-choice" && selected === null) ||
    ((currentStep.type === "short-answer" ||
      currentStep.type === "fill-in-the-blank") &&
      inputAnswer.trim() === "") ||
    (currentStep.type === "code" && (isRunning || !codeOutput));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h2 className="text-gradient animate-fade-up my-6 text-3xl font-bold">
        {lesson.title}
      </h2>

      {completed ? (
        <LessonComplete isGuest={isGuest} hasSkipped={hasSkipped} />
      ) : (
        <div className="space-y-6">
          {lesson.intro && questionIndex === 0 && (
            <Card variant="intro">
              <p>{lesson.intro}</p>
            </Card>
          )}

          <Card variant="static" className="space-y-3 leading-relaxed">
            {(lesson.content || []).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </Card>

          <Card
            variant="static"
            className={
              isCorrect === false
                ? "animate-shake"
                : answeredCorrectly
                  ? "animate-pulse-success"
                  : ""
            }
          >
            <LessonProgress current={questionIndex + 1} total={steps.length} />

            <h3 className="text-lg font-semibold text-white">
              {t("lesson.question", {
                current: questionIndex + 1,
                total: steps.length,
              })}
            </h3>

            {currentStep.type !== "code" && (
              <p className="mt-2 leading-relaxed">{currentStep.question}</p>
            )}
            {currentStep.type === "code" && currentStep.description && (
              <p className="mt-2 leading-relaxed whitespace-pre-line">
                {currentStep.description}
              </p>
            )}

            {currentStep.help && (
              <HintBox
                hint={currentStep.help}
                show={showHint}
                onToggle={() => setShowHint((prev) => !prev)}
              />
            )}

            {currentStep.type === "multiple-choice" &&
              Array.isArray(currentStep.options) && (
                <QuestionMultipleChoice
                  options={currentStep.options}
                  selected={selected}
                  onSelect={setSelected}
                />
              )}

            {(currentStep.type === "short-answer" ||
              currentStep.type === "fill-in-the-blank") && (
              <QuestionFillBlank value={inputAnswer} onChange={setInputAnswer} />
            )}

            {currentStep.type === "code" && (
              <QuestionCode
                step={currentStep}
                code={code}
                onCodeChange={setCode}
                onRun={handleRunCode}
                isRunning={isRunning}
                output={codeOutput}
                error={codeError}
                isCorrect={isCorrect}
              />
            )}

            {answeredCorrectly ? (
              <div className="mt-5 space-y-4">
                {currentStep.type !== "code" && (
                  <Alert variant="success">{t("lesson.answerCorrect")}</Alert>
                )}
                <Button onClick={advanceToNext}>{t("lesson.continue")}</Button>
              </div>
            ) : (
              <>
                {isCorrect === false && currentStep.type !== "code" && (
                  <Alert variant="error" className="mt-4">
                    {t("lesson.answerWrong")}
                  </Alert>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button onClick={handleSubmit} disabled={submitDisabled}>
                    {t("lesson.submit")}
                  </Button>
                  <Button variant="secondary" onClick={handleSkip}>
                    {t("lesson.skip")}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
