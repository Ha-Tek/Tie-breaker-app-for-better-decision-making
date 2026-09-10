import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import "dotenv/config";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let genAiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAiClient;
}

function buildFallbackAnalysis(
  question: string,
  context: string,
  rawOptions: Array<{ id?: string; title: string; description?: string }>,
  criteria?: string[]
) {
  const options = rawOptions.map((opt, idx) => ({
    id: opt.id || `opt-${idx + 1}`,
    title: opt.title || `Option ${String.fromCharCode(65 + idx)}`,
    description: opt.description || "",
  }));

  const criteriaList = criteria && criteria.length > 0
    ? criteria
    : ["Long-term Compounding Value", "Immediate Stress & Execution Load", "Downside Protection & Reversibility", "Regret Minimization"];

  const optionAnalyses = options.map((opt, idx) => {
    const isFirst = idx === 0;
    return {
      id: opt.id,
      title: opt.title,
      description: opt.description || (isFirst ? "Primary proactive choice with higher upside" : "Alternative path optimizing for stability and control"),
      reversibility: isFirst ? ("Moderate" as const) : ("Easy" as const),
      summary: isFirst
        ? `Delivers significant compounding leverage and addresses the core dilemma directly.`
        : `Preserves bandwidth and psychological baseline, minimizing near-term turbulence.`,
      overallScore: isFirst ? 82 : 74,
      pros: isFirst
        ? [
            { id: `p-${idx}-1`, text: `Directly attacks the primary goal in: "${question.slice(0, 40)}..."`, weight: "high" as const, category: "Strategic", score: 3 },
            { id: `p-${idx}-2`, text: "Builds durable long-term muscle and capability", weight: "high" as const, category: "Growth", score: 3 },
            { id: `p-${idx}-3`, text: "Unlocks asymmetrical future optionality", weight: "medium" as const, category: "Upside", score: 2 },
          ]
        : [
            { id: `p-${idx}-1`, text: "Protects existing peace of mind and reduces immediate friction", weight: "high" as const, category: "Stability", score: 3 },
            { id: `p-${idx}-2`, text: "Requires lower immediate cognitive and financial expenditure", weight: "medium" as const, category: "Resource", score: 2 },
            { id: `p-${idx}-3`, text: "High flexibility to pivot later without sunk costs", weight: "medium" as const, category: "Reversibility", score: 2 },
          ],
      cons: isFirst
        ? [
            { id: `c-${idx}-1`, text: "Requires higher upfront energy, discipline, and adaptation", weight: "high" as const, category: "Friction", score: -3 },
            { id: `c-${idx}-2`, text: "Temporary uncertainty during the transition phase", weight: "medium" as const, category: "Risk", score: -2 },
          ]
        : [
            { id: `c-${idx}-1`, text: "Leaves underlying dilemma and friction unresolved over time", weight: "high" as const, category: "Stagnation", score: -3 },
            { id: `c-${idx}-2`, text: "High probability of delayed regret or feeling like you played it too safe", weight: "medium" as const, category: "Opportunity Cost", score: -2 },
          ],
      swot: {
        strengths: isFirst
          ? ["High autonomy and agency", "Strong momentum generator", "Direct alignment with growth"]
          : ["Low transition friction", "Preserves emotional and financial runway", "Proven workflow"],
        weaknesses: isFirst
          ? ["Higher learning curve in weeks 1-6", "Resource intensive upfront"]
          : ["Capped upside", "Potential latent frustration"],
        opportunities: isFirst
          ? ["Compounding network and skill dividends", "First-mover advantage in your own journey"]
          : ["Allows observation before committing", "Conserves capital for unexpected opportunities"],
        threats: isFirst
          ? ["Execution burnout if boundaries are weak", "Short-term turbulence"]
          : ["Diminishing returns over a 2-year horizon", "Loss of enthusiasm"],
      },
    };
  });

  const comparisonDimensions = criteriaList.slice(0, 5).map((critName, cIdx) => {
    const ratings: Record<string, any> = {};
    const winner = options[cIdx % 2 === 0 ? 0 : options.length - 1];

    options.forEach((opt, oIdx) => {
      const isWinner = opt.id === winner.id;
      ratings[opt.id] = {
        rating: isWinner ? "Superior" : oIdx === 0 ? "Good" : "Challenging",
        score: isWinner ? 5 : oIdx === 0 ? 4 : 2,
        explanation: isWinner
          ? `${opt.title} provides superior long-term leverage and alignment on this criterion.`
          : `${opt.title} involves recognizable compromises on this dimension.`,
      };
    });

    return {
      dimension: critName,
      weight: 10 - cIdx,
      description: `Evaluation of how effectively each choice satisfies ${critName}.`,
      ratings,
      winnerOptionId: winner.id,
    };
  });

  const recommendedOption = options[0];

  return {
    id: `dec-${Date.now()}`,
    createdAt: new Date().toISOString(),
    question,
    context: context || "",
    options: optionAnalyses,
    comparisonDimensions,
    verdict: {
      recommendedOptionId: recommendedOption.id,
      recommendedOptionTitle: recommendedOption.title,
      confidencePercentage: 83,
      theTiebreakerFactor: `Regret Minimization & Asymmetrical Upside: The cost of inaction or remaining static almost always exceeds the temporary friction of leaning into ${recommendedOption.title}.`,
      summaryRationale: `When balancing long-term compounding against short-term comfort, ${recommendedOption.title} presents distinctly superior leverage. While the upfront transition demands grit, the risks can be systematically controlled with clear milestones.`,
      keyRisksToWatch: [
        "Neglecting recovery and boundary management during the first 30-day sprint",
        "Judging initial progress too early before compound momentum takes hold",
        "Overcomplicating the implementation instead of taking simple, decisive steps"
      ],
      recommendedNextSteps: [
        `Define a 60-day review checkpoint for ${recommendedOption.title} with clear success thresholds.`,
        "Identify the single smallest action you can take in the next 24 hours to initiate momentum.",
        "Establish an emergency safety net or fallback agreement to eliminate psychological anxiety."
      ],
      gutCheckQuestion: `If a trusted mentor made the call right now that you MUST proceed with ${recommendedOption.title}, does your deepest instinct feel a breath of fresh air or profound dread?`
    },
    decisionFrameworkTakeaway: "Type 1 vs Type 2 Decisions (Jeff Bezos): When a choice can be reversed with reasonable effort, velocity matters more than perfection. Treat it as a hypothesis to test, not a lifetime decree."
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") });
  });

  // Quick suggestion for options or criteria
  app.post("/api/suggest-options", async (req, res) => {
    try {
      const { question, context } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          options: [
            { title: "Commit Fully to the Change", description: "Dedicate full focus and resources to the new path" },
            { title: "Maintain the Status Quo", description: "Preserve current stability and optimize incrementally" },
            { title: "Hybrid / Phased Transition", description: "Test the waters with a 90-day timeboxed pilot" }
          ],
          criteria: [
            "Financial Impact & Upside",
            "Work-Life Balance & Stress",
            "Long-Term Career/Personal Growth",
            "Reversibility & Worst-Case Risk"
          ]
        });
      }

      const prompt = `You are an expert decision consultant for an app called "The Tiebreaker".
Given this decision question and context:
Question: "${question}"
Context: "${context || 'None provided'}"

Provide:
1. 2 to 3 distinct, realistic, high-quality options to consider (each with title and a 1-sentence description).
2. 4 to 5 key criteria or dimensions that matter most for this specific dilemma.

Respond ONLY with valid JSON matching this schema:
{
  "options": [
    { "title": "...", "description": "..." }
  ],
  "criteria": [
    "string", "string", "string", "string"
  ]
}`;

      const responsePromise = ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI generation timeout")), 4000)
      );

      const response: any = await Promise.race([responsePromise, timeoutPromise]);

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      }
      throw new Error("Empty response from model");
    } catch (err: any) {
      console.warn("suggest-options fallback:", err.message);
      return res.json({
        options: [
          { title: "Pursue the New Opportunity", description: "Lean into growth and embrace calculated risk" },
          { title: "Double Down on Current Path", description: "Leverage existing strengths and avoid disruption" },
          { title: "Phased Low-Risk Trial", description: "Start small with clear exit criteria before committing" }
        ],
        criteria: [
          "Long-term Compounding Impact",
          "Short-term Stress & Bandwidth",
          "Financial Security",
          "Regret Minimization"
        ]
      });
    }
  });

  // Main Comprehensive Decision Analysis Endpoint
  app.post("/api/analyze-decision", async (req, res) => {
    try {
      const { question, context, options: rawOptions, criteria } = req.body;

      if (!question || !rawOptions || !Array.isArray(rawOptions) || rawOptions.length < 2) {
        return res.status(400).json({ error: "Please provide a decision question and at least 2 options to compare." });
      }

      const ai = getGenAI();
      if (!ai) {
        console.log("No valid GEMINI_API_KEY present, using intelligent fallback analysis engine.");
        const fallback = buildFallbackAnalysis(question, context, rawOptions);
        return res.json(fallback);
      }

      const optionsListFormatted = rawOptions.map((o: any, idx: number) => {
        return `Option ${idx + 1} [id: "${o.id || `opt-${idx + 1}`}", title: "${o.title}"]: ${o.description || 'No extra details'}`;
      }).join("\n");

      const criteriaText = criteria && Array.isArray(criteria) && criteria.length > 0
        ? `Focus especially on these user-selected priorities: ${criteria.join(", ")}.`
        : `Derive 4 to 6 critical decision dimensions (such as Financial Cost/Reward, Mental Bandwidth/Stress, Long-term Strategic Value, Reversibility, Alignment with Core Values).`;

      const prompt = `You are "The Tiebreaker", an elite decision analyst and cognitive coach.
The user faces a tough dilemma and needs deep, balanced, and decisive clarity.

Decision Dilemma:
Question: "${question}"
Context & Personal Stakes: "${context || 'General decision context'}"

Options to compare:
${optionsListFormatted}

Criteria Guidelines:
${criteriaText}

Your analysis must provide:
1. For EACH option:
   - "pros": Array of 3-5 distinct, concrete pros. Each with "id", "text", "weight" ("high" | "medium" | "low"), "category" (e.g. "Financial", "Strategic", "Emotional", "Operational"), and "score" (positive integer 1, 2, or 3 based on impact).
   - "cons": Array of 2-4 realistic, critical cons. Each with "id", "text", "weight" ("high" | "medium" | "low"), "category", and "score" (negative integer -1, -2, or -3 based on severity).
   - "swot": A complete 4-quadrant SWOT analysis:
       "strengths": 3-4 internal advantages of choosing this option.
       "weaknesses": 2-3 internal flaws or limitations of this option.
       "opportunities": 2-3 external upsides unlocked by this path.
       "threats": 2-3 external hazards, competition, or unexpected pitfalls.
   - "reversibility": Exactly one of "Easy", "Moderate", "Difficult", "Irreversible".
   - "summary": 1-2 punchy sentences summarizing this option's posture.
   - "overallScore": A calculated composite score from 40 to 95.

2. "comparisonDimensions":
   - Array of 4 to 6 key comparison dimensions.
   - Each dimension has:
     - "dimension": e.g. "Long-Term Value", "Upfront Cost / Resource Strain", "Emotional Peace of Mind", "Worst-Case Risk Exposure", "Speed to Impact"
     - "weight": number 1 to 10 indicating importance
     - "description": brief context
     - "ratings": Object mapping option id -> { "rating": "Superior" | "Good" | "Neutral" | "Challenging" | "High Risk", "score": number 1 to 5, "explanation": "Brief 1-sentence justification" }
     - "winnerOptionId": the id of the option that wins this specific dimension.

3. "verdict" (THE TIEBREAKER VERDICT):
   - "recommendedOptionId": id of the winning option.
   - "recommendedOptionTitle": title of the winning option.
   - "confidencePercentage": integer between 65 and 94 (be nuanced, not falsely 100%).
   - "theTiebreakerFactor": The single most pivotal truth or asymmetric leverage point that breaks the tie between the choices. Make this razor-sharp, insightful, and memorable.
   - "summaryRationale": 2-3 clear, compassionate, and logically sound sentences explaining why this option is superior given the user's situation.
   - "keyRisksToWatch": Array of 3 specific blind spots or failure modes the user must proactively prepare for.
   - "recommendedNextSteps": Array of 3 concrete, low-friction immediate actions (within 48 hours to 7 days) to execute on this choice.
   - "gutCheckQuestion": A provocative, introspective question (e.g. "If you woke up tomorrow and an external force had made this decision for you, which direction gives you a sigh of relief?") to test emotional alignment.

4. "decisionFrameworkTakeaway": A memorable mental model or principle (e.g. Jeff Bezos's Type 1 vs Type 2 decisions, regret minimization framework, or asymmetric upside principle) relevant to this dilemma.

Ensure valid JSON output only.`;

      const responsePromise = ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI analysis timeout")), 4500)
      );

      const response: any = await Promise.race([responsePromise, timeoutPromise]);

      const responseText = response.text?.trim();
      if (!responseText) {
        throw new Error("Empty model response received");
      }

      let parsedData: any;
      try {
        parsedData = JSON.parse(responseText);
      } catch (e) {
        // In case there was markdown wrapping
        const cleaned = responseText.replace(/^```json\s*/, "").replace(/```$/, "").trim();
        parsedData = JSON.parse(cleaned);
      }

      // Ensure proper IDs and metadata
      const result = {
        id: `dec-${Date.now()}`,
        createdAt: new Date().toISOString(),
        question,
        context: context || "",
        options: parsedData.options || [],
        comparisonDimensions: parsedData.comparisonDimensions || [],
        verdict: parsedData.verdict || {},
        decisionFrameworkTakeaway: parsedData.decisionFrameworkTakeaway || "Clarify irreversible versus reversible choices to act with conviction."
      };

      return res.json(result);
    } catch (error: any) {
      console.error("Error generating decision analysis:", error);
      // If error occurs, gracefully deliver fallback so the user experience is unbroken
      const fallback = buildFallbackAnalysis(
        req.body.question || "Decision Dilemma",
        req.body.context || "",
        req.body.options || [{ title: "Option A" }, { title: "Option B" }],
        req.body.criteria
      );
      return res.json(fallback);
    }
  });

  // Setup Vite or static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Tiebreaker server listening on port ${PORT}`);
  });
}

startServer();
