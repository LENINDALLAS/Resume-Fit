/**
 * Static stand-in for a Gemini response, used only when GEMINI_MOCK_MODE=true.
 * Deliberately kept as a JSON string (not a pre-built object) so it still
 * flows through the same JSON.parse + aiAnalysisResponseSchema validation as
 * a real response -- everything downstream of the network call is exercised faithfully.
 */
export const GEMINI_MOCK_RESPONSE_TEXT = JSON.stringify({
  skills: {
    matched: [
      { skill: "Node.js", matchType: "exact", evidence: "Built REST APIs using Node.js and Express." },
      { skill: "PostgreSQL", matchType: "exact", evidence: "Used PostgreSQL for application data storage." },
      { skill: "Docker", matchType: "exact", evidence: "Deployed services using Docker containers." },
    ],
    missing: [
      { skill: "Kubernetes", importance: "medium", reason: "Mentioned as a plus but not evidenced in the resume." },
      { skill: "AWS Certified Developer", importance: "low", reason: "No certification listed on the resume." },
    ],
  },
  experience: {
    requiredYears: 3,
    estimatedYears: 4,
    relevantYears: 4,
    match: "strong",
    reason: "The candidate has sufficient relevant backend development experience.",
  },
  projects: {
    relevantProjects: [
      {
        name: "Internal API Platform",
        relevance: "high",
        matchedTechnologies: ["Node.js", "Express", "PostgreSQL", "Docker"],
        reason: "Demonstrates relevant full-stack backend development experience.",
      },
    ],
    match: "strong",
  },
  education: {
    required: "Bachelor's degree in Computer Science or related field",
    candidateEducation: [{ degree: "Bachelor of Science", field: "Computer Science" }],
    match: "strong",
    reason: "The candidate has a directly relevant bachelor's degree.",
  },
  certifications: {
    required: ["AWS Certified Developer"],
    matched: [],
    missing: [{ name: "AWS Certified Developer", importance: "low" }],
    match: "none",
  },
  suggestions: [
    "Highlight any Kubernetes or container-orchestration exposure if it exists.",
    "Add measurable outcomes (e.g. latency or throughput improvements) to backend project descriptions.",
  ],
  strengths: [
    "Strong Node.js and Express backend experience.",
    "Relevant PostgreSQL and Docker experience.",
    "Directly relevant educational background.",
  ],
});
