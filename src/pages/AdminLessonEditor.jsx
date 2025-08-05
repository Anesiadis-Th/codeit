import globalStyles from "../styles/globals.module.css";
import adminStyles from "../styles/admin.module.css";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminLessonEditor() {
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [intro, setIntro] = useState("");
  const [content, setContent] = useState(""); // Paragraphs separated by \n
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
    if (newStepType === "multiple-choice") {
      const quizStep = {
        type: "multiple-choice",
        question: newStepData.question,
        options: newStepData.options.filter(Boolean),
        answer: Number(newStepData.answer),
        help: newStepData.help,
      };
      setSteps([...steps, quizStep]);
    } else if (newStepType === "code") {
      const codeStep = {
        type: "code",
        description: newStepData.description,
        starterCode: newStepData.starterCode,
        expectedOutput: newStepData.expectedOutput,
        help: newStepData.help,
      };
      setSteps([...steps, codeStep]);
    } else if (newStepType === "fill-in-the-blank") {
      const blankStep = {
        type: "fill-in-the-blank",
        question: newStepData.question,
        answer: newStepData.answer,
        help: newStepData.help,
      };
      setSteps([...steps, blankStep]);
    }

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
      const contentArray = content
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean);

      const { error } = await supabase.from("lessons").upsert([
        {
          id,
          title,
          intro,
          content: contentArray,
          steps,
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
            placeholder="Lesson Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className={adminStyles.textarea}
            placeholder="Lesson Intro (optional)"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={3}
          />

          <textarea
            className={adminStyles.textarea}
            placeholder="Lesson content (1 paragraph per line)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
        </div>

        <div className={adminStyles.formSection}>
          <h3>Add Question</h3>
          <select
            value={newStepType}
            onChange={(e) => setNewStepType(e.target.value)}
            className={adminStyles.select}
          >
            <option value="multiple-choice">Multiple Choice Question</option>
            <option value="fill-in-the-blank">Fill in the Blank</option>
            <option value="code">Code Task</option>
          </select>

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
                    const updatedOptions = [...newStepData.options];
                    updatedOptions[idx] = e.target.value;
                    setNewStepData({
                      ...newStepData,
                      options: updatedOptions,
                    });
                  }}
                />
              ))}
              <input
                type="number"
                className={adminStyles.input}
                min="0"
                max={newStepData.options.length - 1}
                placeholder="Correct Answer Index (0-based)"
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
                placeholder="Description (what user should do)"
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
                placeholder="Starter C code"
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

          {newStepType === "fill-in-the-blank" && (
            <>
              <input
                type="text"
                className={adminStyles.input}
                placeholder="Question with a blank (e.g. 'C is a ____ language')"
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
          <h3>Question Preview</h3>
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
