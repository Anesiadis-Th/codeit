import globalStyles from "../styles/globals.module.css";
import adminStyles from "../styles/admin.module.css";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminLessonEditor() {
  const [id, setId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [title_en, setTitleEn] = useState("");
  const [title_gr, setTitleGr] = useState("");
  const [intro_en, setIntroEn] = useState("");
  const [intro_gr, setIntroGr] = useState("");
  const [content_en, setContentEn] = useState("");
  const [content_gr, setContentGr] = useState("");
  const [steps, setSteps] = useState([]);

  const [newStepType, setNewStepType] = useState("multiple-choice");
  const [newStepData, setNewStepData] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: 0,
    help: "",
    description: "",
    starterCode: "",
    expectedOutput: "",
  });

  const [status, setStatus] = useState(null);

  const handleAddStep = () => {
    let step;
    if (newStepType === "multiple-choice") {
      step = {
        type: "multiple-choice",
        question: newStepData.question,
        options: newStepData.options.filter(Boolean),
        answer: Number(newStepData.answer),
        help: newStepData.help,
      };
    } else if (newStepType === "code") {
      step = {
        type: "code",
        description: newStepData.description,
        starterCode: newStepData.starterCode,
        expectedOutput: newStepData.expectedOutput,
        help: newStepData.help,
      };
    } else if (newStepType === "fill-in-the-blank") {
      step = {
        type: "fill-in-the-blank",
        question: newStepData.question,
        answer: newStepData.answer,
        help: newStepData.help,
      };
    }

    setSteps([...steps, step]);
    setNewStepData({
      question: "",
      options: ["", "", "", ""],
      answer: 0,
      help: "",
      description: "",
      starterCode: "",
      expectedOutput: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const contentEnArray = content_en
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean);
      const contentGrArray = content_gr
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean);

      const { error } = await supabase.from("lessons").upsert([
        {
          id,
          section_id: sectionId,
          title_en,
          title_gr,
          intro_en,
          intro_gr,
          content_en: contentEnArray,
          content_gr: contentGrArray,
          steps_en: steps,
          steps_gr: steps, // copy for now
        },
      ]);

      if (error) throw error;
      setStatus("✅ Lesson saved successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to save lesson: " + err.message);
    }
  };

  return (
    <div className={globalStyles.container}>
      <h2 className={globalStyles.title}>Create a Lesson</h2>

      <form onSubmit={handleSubmit}>
        <div className={adminStyles.formSection}>
          <h3>Lesson Info</h3>
          <input
            type="text"
            className={adminStyles.input}
            placeholder="Lesson ID (e.g. c-arrays)"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          <input
            type="text"
            className={adminStyles.input}
            placeholder="Section ID (e.g. pointers-c)"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
          />

          <input
            type="text"
            className={adminStyles.input}
            placeholder="Lesson Title (English)"
            value={title_en}
            onChange={(e) => setTitleEn(e.target.value)}
          />

          <input
            type="text"
            className={adminStyles.input}
            placeholder="Lesson Title (Greek)"
            value={title_gr}
            onChange={(e) => setTitleGr(e.target.value)}
          />

          <textarea
            className={adminStyles.textarea}
            placeholder="Lesson Intro (English)"
            value={intro_en}
            onChange={(e) => setIntroEn(e.target.value)}
            rows={2}
          />

          <textarea
            className={adminStyles.textarea}
            placeholder="Lesson Intro (Greek)"
            value={intro_gr}
            onChange={(e) => setIntroGr(e.target.value)}
            rows={2}
          />

          <textarea
            className={adminStyles.textarea}
            placeholder="Lesson content (English, 1 paragraph per line)"
            value={content_en}
            onChange={(e) => setContentEn(e.target.value)}
            rows={4}
          />

          <textarea
            className={adminStyles.textarea}
            placeholder="Lesson content (Greek, 1 paragraph per line)"
            value={content_gr}
            onChange={(e) => setContentGr(e.target.value)}
            rows={4}
          />
        </div>

        <div className={adminStyles.formSection}>
          <h3>Add Step</h3>
          <select
            value={newStepType}
            onChange={(e) => setNewStepType(e.target.value)}
            className={adminStyles.select}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="fill-in-the-blank">Fill in the Blank</option>
            <option value="code">Code Task</option>
          </select>

          {/* Step Inputs */}
          {newStepType === "multiple-choice" && (
            <>
              <input
                type="text"
                className={adminStyles.input}
                placeholder="Question"
                value={newStepData.question}
                onChange={(e) =>
                  setNewStepData({ ...newStepData, question: e.target.value })
                }
              />
              {newStepData.options.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  className={adminStyles.input}
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const updated = [...newStepData.options];
                    updated[idx] = e.target.value;
                    setNewStepData({ ...newStepData, options: updated });
                  }}
                />
              ))}
              <input
                type="number"
                className={adminStyles.input}
                placeholder="Correct Answer Index (0-based)"
                value={newStepData.answer}
                onChange={(e) =>
                  setNewStepData({ ...newStepData, answer: e.target.value })
                }
              />
            </>
          )}

          {newStepType === "fill-in-the-blank" && (
            <>
              <input
                type="text"
                className={adminStyles.input}
                placeholder="Question with blank"
                value={newStepData.question}
                onChange={(e) =>
                  setNewStepData({ ...newStepData, question: e.target.value })
                }
              />
              <input
                type="text"
                className={adminStyles.input}
                placeholder="Correct Answer"
                value={newStepData.answer}
                onChange={(e) =>
                  setNewStepData({ ...newStepData, answer: e.target.value })
                }
              />
            </>
          )}

          {newStepType === "code" && (
            <>
              <textarea
                className={adminStyles.textarea}
                placeholder="Description"
                value={newStepData.description}
                onChange={(e) =>
                  setNewStepData({
                    ...newStepData,
                    description: e.target.value,
                  })
                }
                rows={2}
              />
              <textarea
                className={adminStyles.textarea}
                placeholder="Starter Code"
                value={newStepData.starterCode}
                onChange={(e) =>
                  setNewStepData({
                    ...newStepData,
                    starterCode: e.target.value,
                  })
                }
                rows={6}
                style={{ fontFamily: "monospace" }}
              />
              <input
                type="text"
                className={adminStyles.input}
                placeholder="Expected Output"
                value={newStepData.expectedOutput}
                onChange={(e) =>
                  setNewStepData({
                    ...newStepData,
                    expectedOutput: e.target.value,
                  })
                }
              />
            </>
          )}

          <textarea
            className={adminStyles.textarea}
            placeholder="Hint (optional)"
            value={newStepData.help}
            onChange={(e) =>
              setNewStepData({ ...newStepData, help: e.target.value })
            }
            rows={2}
          />

          <button
            type="button"
            className={adminStyles.button}
            onClick={handleAddStep}
          >
            Add Step
          </button>
        </div>

        <div className={adminStyles.formSection}>
          <h3>Step Preview</h3>
          <pre className={adminStyles.previewBox}>
            {JSON.stringify(steps, null, 2)}
          </pre>
        </div>

        <button type="submit" className={adminStyles.button}>
          Save Lesson
        </button>

        {status && <p>{status}</p>}
      </form>
    </div>
  );
}
