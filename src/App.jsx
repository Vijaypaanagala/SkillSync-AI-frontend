import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import CircularProgress from "./CircularProgress";

function App() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [loading ,setLoading]=useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume || !jd) {
      alert("Please upload a resume and enter job description.");
      return;
    }
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jd", jd);

    try {
      setLoading(true);
      const response = await axios.post("https://skillsync-ai-backend.onrender.com/match", formData);
      setLoading(false);
      setResult(response.data);
      setAnimatedScore(0); // Reset score for animation
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };

  // Animate score visually and numerically
  useEffect(() => {
    if (!result) return;
    const target = Math.round(result.skill_score * 100);
    let current = 0;

    const animate = () => {
      if (current < target) {
         current += Math.min(1, (target - current) * 0.05); 
        setAnimatedScore(current);
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [result]);

  const getBorderColor = (score) => {
    if (score < 40) return "#ff4e50"; // red
    if (score < 70) return "#f9a825"; // orange
    return "#00c853"; // green
  };
  const getScoreMessage = (score) => {
  if (score >= 0.7) return "✅ Good to apply!";
  if (score >= 0.4) return "⚠️ Some skills are missing.";
  return "❌ Not a good match currently.";
};


  return (
    <div className={darkMode ? "app dark" : "app"}>
      <nav className="navbar">
        <div className="nav-left">
          <h1>SkillSync AI</h1>
        </div>
        <div className="nav-right">
          <button className="help-btn" onClick={() => setShowHelp(!showHelp)}>
            Help
          </button>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle dark/light mode"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>
      </nav>

     {showHelp && (
  <div className="modal-backdrop" onClick={() => setShowHelp(false)}>
    <div className="help-popup" onClick={(e) => e.stopPropagation()}>
      <h3>How to use SkillSync AI</h3>
      <ul>
        <li>Upload your resume in PDF format.</li>
        <li>Paste the job description in the box next to it.</li>
        <li>Click "Match" to analyze your skills vs job requirements.</li>
        <li>See your skill match score and missing skills highlighted.</li>
      </ul>
      <button onClick={() => setShowHelp(false)}>Close</button>
    </div>
  </div>
)}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Upload Resume (PDF):</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
          />
        </div>
        <div className="form-group">
          <label>Job Description:</label>
          <textarea
            rows="10"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste job description here"
          />
        </div>
      </form>
      <button className="match-btn" onClick={handleSubmit}>
        {loading?"loading...":"Match"}
      </button>

      {result && (
        <div className="result">
          <CircularProgress
            progress={animatedScore}
            getColor={getBorderColor}
          />
          <div className={darkMode?"score-messageD":"score-message"}>
      <p>{getScoreMessage(result.skill_score)}</p>
        </div>
        <div className="skills-container">
  <div className="matching-skills">
    <h3>Matching Skills</h3>
    <ul>  
      {result.matched_skills.length === 0 && (
        <li style={{ color: "red" }}>No matching skills! 😔</li>
      )}
      {result.matched_skills.map((skill, i) => (
        <li key={i} className="matching-skill-item">
          <span className="right">✔</span> {skill}
        </li>
      ))}
    </ul>
  </div>

  <div className="missing-skills">
    <h3>Missing Skills</h3>
    <ul>  
      {result.missing_skills.length === 0 && (
        <li style={{ color: "green" }}>No missing skills! 🎉</li>
      )}
      {result.missing_skills.map((skill, i) => (
        <li key={i} className="missing-skill-item">
          <span className="cross">✖</span> {skill}
        </li>
      ))}
    </ul>
  </div>
</div>

        </div>
      )}
    </div>
  );
}

export default App;
