
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../i18n";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getALDRecommendation(element: string, localPrecursors: string[], lang: Language = 'zh') {
    const prompt = `You are an ALD expert. For element "${element}", based on local precursors: [${localPrecursors.join(', ')}] and global literature, provide recommendations.
    IMPORTANT: Provide all text fields in ${lang === 'zh' ? 'Chinese' : 'English'}.
    
    Output JSON array:
    - reactantA: Precursor A
    - reactantB: Reactant B
    - reactionTemp: Temp
    - doseA: Saturated time/dose A
    - heatA: Heating temp A
    - doseB: Saturated time/dose B
    - heatB: Heating temp B
    - source: Literature source title
    - score: Weighted score (0-100)
    - details: Analysis process
    - isLocal: boolean, if matches local list`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              reactantA: { type: Type.STRING },
              reactantB: { type: Type.STRING },
              reactionTemp: { type: Type.STRING },
              doseA: { type: Type.STRING },
              heatA: { type: Type.STRING },
              doseB: { type: Type.STRING },
              heatB: { type: Type.STRING },
              source: { type: Type.STRING },
              score: { type: Type.NUMBER },
              details: { type: Type.STRING },
              isLocal: { type: Type.BOOLEAN }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  }

  async analyzeTicket(ticketContent: string, lang: Language = 'zh') {
    const prompt = `Analyze this maintenance ticket. Extract core info and judge cause/solutions.
    Ticket: ${ticketContent}
    IMPORTANT: Provide all response text in ${lang === 'zh' ? 'Chinese' : 'English'}.
    
    Output JSON object:
    - coreInfo: object with key-value pairs
    - validityCheck: string assessment
    - causeMatch: string assessment
    - recommendations: string array (Top 3)`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '{}');
  }

  async analyzeWarehouse(data: any, lang: Language = 'zh') {
    const prompt = `As a smart laboratory warehouse analyst, analyze this inventory data: ${JSON.stringify(data)}.
    Apply the rule: "Procurement threshold = consumption_rate * lead_time + safety_stock".
    IMPORTANT: Write the response in ${lang === 'zh' ? 'Chinese' : 'English'}. Format in Markdown. Include specific procurement suggestions.`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    return response.text || '';
  }

  async analyzeLabAnalytics(items: any[], history: any[], lang: Language = 'zh') {
    const prompt = `As a Lab Efficiency Specialist, analyze the following:
    1. Brand Comparison: Compare different brands of reagents based on cost and success rates.
    2. Energy: Optimize storage temperature zones for energy saving.
    3. Gas Usage: Identify potential leaks based on consumption trends.
    Items: ${JSON.stringify(items)}
    History: ${JSON.stringify(history)}
    IMPORTANT: Provide results in ${lang === 'zh' ? 'Chinese' : 'English'} Markdown.`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt
    });
    return response.text || '';
  }

  async transcribeVoiceToText(base64Audio: string, mimeType: string, lang: Language = 'zh') {
    const prompt = `You are an industrial expert. Transcribe this voice recording into text.
    Correct any minor spoken errors. Context: Maintenance fault description or Inventory log.
    Language: ${lang === 'zh' ? 'Chinese' : 'English'}.
    Return ONLY the transcribed text.`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { inlineData: { data: base64Audio, mimeType: mimeType } },
        { text: prompt }
      ]
    });
    return response.text || '';
  }

  async processVoiceInput(base64Audio: string, mimeType: string, lang: Language = 'zh') {
    const prompt = `Extract laboratory inventory info from voice (reagent name, CAS, spec, qty). Language: ${lang === 'zh' ? 'Chinese' : 'English'}.
    Output JSON object:
    - name: string
    - brand: string
    - spec: string
    - quantity: number
    - unit: string
    - expiryDate: YYYY-MM-DD`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { inlineData: { data: base64Audio, mimeType: mimeType } },
        { text: prompt }
      ],
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  }

  async processImageInput(base64Image: string, mimeType: string, lang: Language = 'zh') {
    const prompt = `Identify material info from this lab reagent label or shipping invoice image. Language: ${lang === 'zh' ? 'Chinese' : 'English'}.
    Output JSON object:
    - name: string
    - brand: string
    - spec: string
    - quantity: number
    - unit: string
    - expiryDate: YYYY-MM-DD`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { inlineData: { data: base64Image, mimeType: mimeType } },
        { text: prompt }
      ],
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  }
}

export const gemini = new GeminiService();
