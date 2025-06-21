import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { Plus, Loader2 } from "lucide-react";
import API from '../utils/api';

axios.defaults.withCredentials = true;

const ProblemDetail = () => {
  const { problem_id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("description");
  const [problem, setProblem] = useState(null);
  const [testcases, setTestcases] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("// write your code here");
  const [outputs, setOutputs] = useState([]);
  const [running, setRunning] = useState(false);
  const [aiReview, setAiReview] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await API.get("/auth/verify");
        setCurrentUser(res.data.user);
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    verifyAuth();
  }, []);

  const fetchProblemAndTestcases = async () => {
    try {
      const [problemRes, testcaseRes] = await Promise.all([
        API.get(`problems/${problem_id}`),
        API.get(`testcases/${problem_id}`),
      ]);
      setProblem(problemRes.data);
      setTestcases(testcaseRes.data);
    } catch (err) {
      console.error("Error fetching problem/testcases:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    if (!currentUser) return;
    
    try {
      const res = await API.get(`/submissions/${problem_id}/${currentUser.userId}`
      );
      setSubmissions(res.data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  useEffect(() => {
    fetchProblemAndTestcases();
  }, [problem_id]);

  useEffect(() => {
    if (tab === "submissions") {
      fetchSubmissions();
    }
  }, [tab, currentUser]);

  const getLanguageExtension = () => {
    switch (language) {
      case "cpp": return cpp();
      case "java": return java();
      case "python": return python();
      default: return javascript();
    }
  };

  const handleRun = async () => {
    if (!currentUser) {
      alert("Please login to run your code.");
      navigate("/Enter");
      return;
    }

    setRunning(true);
    const results = [];

    try {
      for (const tc of testcases) {
        try {
          const res = await API.post("/run", {
            code,
            language,
            input: tc.input,
          });

          results.push({
            output: res.data.status === "SUCCESS" 
              ? res.data.output?.trim() 
              : res.data.status,
            status: res.data.status,
            correct: tc.isCustom ? undefined : (
              res.data.status === "SUCCESS" &&
              tc.expected_output?.trim() === res.data.output?.trim()
            )
          });
        } catch (err) {
          results.push({ 
            output: "SERVER_ERROR",
            status: "SERVER_ERROR",
            correct: false 
          });
        }
      }
      setOutputs(results);
    } catch (err) {
      console.error("Run error:", err);
      alert("Error running code. Please try again.");
    } finally {
      setRunning(false);
    }
  };

const handleSubmit = async () => {
  if (!currentUser) {
    alert("Please login to submit your code.");
    navigate("/Enter");
    return;
  }

  try {
    setRunning(true);
    const res = await API.post(
      "/submit",
      {
        code,
        language,
        problem_id: parseInt(problem_id),
        user_id: currentUser.userId,
        username: currentUser.username
      }
    );

    if (res.data.success) {
      alert(
        res.data.verdict === "Accepted"
          ? "✅ Correct Answer!" 
          : `❌ ${res.data.verdict || 'Wrong Answer'}. ${res.data.message || ''}`
      );
    } else {
      alert(`⚠️ ${res.data.message }`);
    }
    fetchSubmissions();
  } catch (err) {
    const errorMsg = err.response?.data?.error || 
                   err.response?.data?.message || 
                   "Error submitting solution";
    alert(`⚠️ ${errorMsg}`);
    console.error("Submit error:", err);
  } finally {
    setRunning(false);
  }
};

  const handleAiReview = async () => {
    if (!code || code.trim() === "") {
      alert("Please write some code first");
      return;
    }

    if (!currentUser) {
      alert("Please login to use AI review.");
      return;
    }

    setReviewLoading(true);
    setAiReview("");

    try {
      const res = await API.post(
        "/ai-review",
        { code, language }
      );
      
      if (res.data.review) {
        setAiReview(res.data.review);
      } else {
        setAiReview("Received empty response from AI service");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                     err.response?.data?.error || 
                     err.message || 
                     "Error generating AI review";
      console.error("Full error:", err);
      setAiReview(`⚠️ ${errorMsg}`);
    } finally {
      setReviewLoading(false);
    }
  };

  const addTestcase = () => {
    setTestcases([...testcases, { input: "", expected_output: "", isCustom: true }]);
  };

  const updateTestcaseInput = (index, value) => {
    const newTCs = [...testcases];
    newTCs[index].input = value;
    setTestcases(newTCs);
  };

  const updateTestcaseExpected = (index, value) => {
    const newTCs = [...testcases];
    newTCs[index].expected_output = value;
    setTestcases(newTCs);
  };

  if (!authChecked || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-8 text-red-500 text-center">
        Problem not found. Please check the problem ID.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* LEFT SIDE - PROBLEM DETAILS */}
      <div className="w-1/2 p-6 overflow-y-auto bg-black">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("description")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              tab === "description"
                ? "bg-green-600 text-white shadow-md"
                : "bg-black text-green-300 hover:bg-gray-900"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setTab("submissions")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              tab === "submissions"
                ? "bg-green-600 text-white shadow-md"
                : "bg-black text-green-300 hover:bg-gray-900"
            }`}
          >
            Submissions
          </button>
        </div>

        {tab === "description" ? (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-100">{problem.title}</h1>
            <p className="text-gray-300 whitespace-pre-line">{problem.description}</p>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-green-400">Input Format</h2>
                <p className="text-gray-300 whitespace-pre-line mt-2">{problem.input_format || "N/A"}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-green-400">Output Format</h2>
                <p className="text-gray-300 whitespace-pre-line mt-2">{problem.output_format || "N/A"}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-green-400">Difficulty</h2>
               <span
  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
    problem.difficulty?.toLowerCase() === "easy"
      ? "bg-green-900 text-green-300"
      : problem.difficulty?.toLowerCase() === "medium"
      ? "bg-yellow-900 text-yellow-300"
      : problem.difficulty?.toLowerCase() === "hard"
      ? "bg-red-900 text-red-300"
      : "bg-gray-800 text-gray-300"
  }`}
>
  {problem.difficulty || "N/A"}
</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-100">Your Submissions</h2>
            {submissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No submissions yet. Solve the problem to see your submissions here.
              </div>
            ) : selectedSubmission ? (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="flex items-center text-green-400 hover:text-green-300 mb-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Submissions
                </button>

                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-2">Submitted Code</h3>
                  <CodeMirror
                    value={selectedSubmission.code || "// No code available"}
                    extensions={[getLanguageExtension()]}
                    theme={dracula}
                    readOnly
                    minHeight="200px"
                  />
                </div>

             {/* In the selected submission view */}
                <div className="mt-4 bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium text-green-400">Language:</span> {selectedSubmission.language}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium text-green-400">Verdict:</span>{" "}
                    {selectedSubmission.verdict || "N/A"}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium text-green-400">Submitted At:</span>{" "}
                    {new Date(selectedSubmission.submitted_at).toLocaleString()}
                  </p>
                  {selectedSubmission.message && (
                    <p className="text-sm text-gray-300">
                      <span className="font-medium text-green-400">Message:</span> {selectedSubmission.message}
                    </p>
                  )}
                </div>

              </div>
            ) : (
              <ul className="space-y-3">

            {submissions.map((s) => (
              <li
                key={s._id}
                onClick={() => setSelectedSubmission(s)}
                className="cursor-pointer hover:bg-gray-900 p-3 rounded-lg border border-gray-800"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Language:</span> {s.language}
                    </p>
                    <p className="text-sm text-gray-300 mt-1">
                      <span className="font-medium">Submitted:</span>{" "}
                      {new Date(s.submitted_at).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      s.verdict === "Accepted" 
                        ? "bg-green-800 text-green-200" 
                        : s.verdict === "Pending" || s.verdict === "Running"
                          ? "bg-yellow-800 text-yellow-200"
                          : "bg-red-800 text-red-200"
                    }`}
                  >
                    {s.verdict}
                  </span>
                </div>
              </li>
            ))}
                
              </ul>
            )}
          </div>
        )}
      </div>

      {/* RIGHT SIDE - CODE EDITOR */}
      <div className="w-1/2 bg-black text-gray-200 flex flex-col">
        {/* Control Bar */}
        <div className="flex items-center justify-between p-4 bg-black">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 rounded-lg bg-black text-gray-200 border border-gray-800 focus:ring-2 focus:ring-green-500"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>

          <div className="flex gap-3">
            <button
              onClick={handleRun}
              disabled={running}
              className={`flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors ${
                running ? 'opacity-80' : ''
              }`}
            >
              {running ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running
                </>
              ) : 'Run'}
            </button>

            <button
              onClick={handleSubmit}
              disabled={running}
              className={`flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors ${
                running ? 'opacity-80' : ''
              }`}
            >
              {running ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting
                </>
              ) : 'Submit'}
            </button>

            <button
              onClick={handleAiReview}
              disabled={reviewLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-bold text-white bg-gradient-to-r from-pink-500 via-yellow-400 via-green-400 via-blue-400 to-purple-500 shadow-lg hover:brightness-110"
              style={{ backgroundSize: '200% 200%', animation: 'gradientMove 4s ease infinite' }}
            >
              {reviewLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Reviewing
                </>
              ) : (
                <>
                  <span className="drop-shadow">✨ AI Review</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 p-4 overflow-y-auto">
          <CodeMirror
            value={code}
            height="100%"
            minHeight="300px"
            extensions={[getLanguageExtension()]}
            theme={dracula}
            onChange={(value) => setCode(value)}
            className="rounded-lg overflow-hidden border border-gray-800"
          />
          {aiReview && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">AI Review</h3>
              <div className="text-gray-300 whitespace-pre-wrap">{aiReview}</div>
            </div>
          )}
        </div>

        {/* Testcases */}
        <div className="p-4 overflow-y-auto max-h-[40vh]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-100">Test Cases</h3>
            <button
              onClick={addTestcase}
              className="flex items-center gap-1 bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
            >
              <Plus size={16} />
              Add Test Case
            </button>
          </div>
          <div className="space-y-4">
            {testcases.map((tc, idx) => (
              <div key={idx}>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Input #{idx + 1} {tc.isCustom && "(Custom)"}
                    </label>
                    <textarea
                      rows={2}
                      value={tc.input}
                      onChange={(e) => updateTestcaseInput(idx, e.target.value)}
                      className="w-full p-2 rounded-lg bg-black border border-gray-800 text-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                  {tc.isCustom && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Expected Output
                      </label>
                      <textarea
                        rows={2}
                        value={tc.expected_output}
                        onChange={(e) => updateTestcaseExpected(idx, e.target.value)}
                        className="w-full p-2 rounded-lg bg-black border border-gray-800 text-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                  )}
                  {outputs[idx] && (
                    <div className="mt-2">
                      <p className={`text-sm ${
                        outputs[idx].status === "SUCCESS" ? "text-green-300" :
                        outputs[idx].status === "COMPILATION_ERROR" ? "text-red-300" :
                        outputs[idx].status === "RUNTIME_ERROR" ? "text-amber-300" :
                        outputs[idx].status === "TIME_LIMIT_EXCEEDED" ? "text-purple-300" :
                        "text-gray-300"
                      }`}>
                        {outputs[idx].status === "SUCCESS" ? "Output: " : "⚠ "}
                        {outputs[idx].output}
                      </p>
                      {!tc.isCustom && outputs[idx].correct !== undefined && (
                        <p className={`mt-1 text-sm font-medium ${
                          outputs[idx].correct ? "text-green-300" : "text-red-300"
                        }`}>
                          {outputs[idx].correct ? "✔ Correct answer" : "✖ Wrong answer"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default ProblemDetail;