const RAPIDAPI_KEY = import.meta.env.VITE_JUDGE0_API_KEY;
const API_URL = "https://judge0-ce.p.rapidapi.com";

export async function runCCode(code) {
  const encodedCode = btoa(code);

  const submissionRes = await fetch(
    `${API_URL}/submissions?base64_encoded=true&wait=true`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code: encodedCode,
        language_id: 50, // C
      }),
    }
  );

  if (!submissionRes.ok) {
    const error = await submissionRes.text();
    throw new Error("Judge0 Error: " + error);
  }

  const result = await submissionRes.json();

  // Decode the base64-encoded stdout and stderr
  const decodedStdout = result.stdout ? atob(result.stdout).trim() : "";
  const decodedStderr = result.stderr ? atob(result.stderr).trim() : "";

  return {
    stdout: decodedStdout,
    stderr: decodedStderr,
    status: result.status?.description || "Unknown",
  };
}
