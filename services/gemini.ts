import { GoogleGenAI } from "@google/genai";
import { AuditParameter, BrokerAuditResult, ComparisonData, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBrokerUrl = async (
  url: string, 
  selectedParams: AuditParameter[]
): Promise<BrokerAuditResult> => {
  
  const paramList = selectedParams.map(p => `- ${p.label} (ID: ${p.id}): ${p.description}`).join("\n");

  const prompt = `
    SYSTEM INSTRUCTION: You are a strict data extraction script. 
    TASK: Verify the claims on this URL: ${url} using GOOGLE SEARCH.

    FORBIDDEN: Do NOT use your own training data. Only use information found via Google Search or the provided URL.
    
    METRICS TO EXTRACT:
    ${paramList}

    OUTPUT FORMAT:
    For each metric, provide exactly one line in this format:
    ID: [parameter_id] | CLAIM: [what the website says] | TRUTH: [what official/regulator sources say] | MATCH: [YES or NO]

    Example:
    ID: min_deposit | CLAIM: $10 | TRUTH: $10 (verified on official docs) | MATCH: YES

    Always include the "Broker Name" and "Main Region" at the top of your response.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType is NOT set to ensure grounding works best
      }
    });

    const text = response.text;
    if (!text) throw new Error("Search engine returned no data.");

    // Extract Grounding Sources (Mandatory)
    const sources: GroundingSource[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push({ 
            title: chunk.web.title || chunk.web.uri, 
            uri: chunk.web.uri 
          });
        }
      });
    }
    const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

    // Parse text-based response
    const lines = text.split('\n');
    let brokerName = "Unknown Broker";
    let region = "-";
    const comparisons: Record<string, ComparisonData> = {};

    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (lower.includes('broker name:')) {
        brokerName = line.split(':')[1]?.trim() || brokerName;
      } else if (lower.includes('region:')) {
        region = line.split(':')[1]?.trim() || region;
      } else if (line.includes('|') && line.includes('ID:')) {
        const parts = line.split('|').map(p => p.trim());
        const idPart = parts.find(p => p.startsWith('ID:'))?.replace('ID:', '').trim();
        const claimPart = parts.find(p => p.startsWith('CLAIM:'))?.replace('CLAIM:', '').trim();
        const truthPart = parts.find(p => p.startsWith('TRUTH:'))?.replace('TRUTH:', '').trim();
        const matchPart = parts.find(p => p.startsWith('MATCH:'))?.replace('MATCH:', '').trim();

        if (idPart) {
          comparisons[idPart] = {
            parameterId: idPart,
            siteValue: claimPart || "Not detected",
            officialValue: truthPart || "Search inconclusive",
            isMatch: matchPart?.toUpperCase() === 'YES'
          };
        }
      }
    });

    // Cleanup broker name if it's still prefixed or weird
    brokerName = brokerName.replace(/^[*\s]+/, '').split('\n')[0];

    return {
      url,
      brokerName: brokerName === "Unknown Broker" ? (url.split('//')[1]?.split('/')[0] || brokerName) : brokerName,
      region,
      comparisons,
      sources: uniqueSources,
      status: 'completed'
    };

  } catch (error: any) {
    console.error("Search Grounding Audit error:", error);
    return {
      url,
      brokerName: "Search Failed",
      region: "-",
      comparisons: {},
      status: 'error',
      error: error.message || "Search Grounding Error"
    };
  }
};
