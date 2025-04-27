import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo', // Use 'demo' for testing without a real API key
  dangerouslyAllowBrowser: true // For client-side usage (in production, use a backend proxy)
});

// Define types for chat messages
export interface ChatMessage {
  content: string;
  role: 'user' | 'assistant' | 'system';
}

// Function to get AI response using the OpenAI API
export async function getAIResponse(messages: ChatMessage[], temperature = 0.7) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Update to a suitable model
      messages,
      temperature,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return 'Sorry, I encountered an error. Please try again later.';
  }
}

// Function to analyze CDP data for recommendations
export async function analyzeCDPData(question: string, cdpData: object) {
  try {
    const systemPrompt = `You are an expert in climate disclosure reporting, specifically for CDP (Carbon Disclosure Project).
    Analyze the following CDP data and respond to the user's question with helpful, accurate information.
    Keep responses concise and focused on actionable insights.`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `CDP Data: ${JSON.stringify(cdpData)}\n\nQuestion: ${question}` }
      ],
      temperature: 0.5,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing CDP data:', error);
    return 'Sorry, I encountered an error analyzing the CDP data. Please try again later.';
  }
}

// Sample CDP data for testing
export const sampleCDPData = {
  company: "Sagar Cement",
  year: "2023-2024",
  score: "B",
  categories: {
    governance: { score: "A-", trend: "+1" },
    targets: { score: "B", trend: "no change" },
    riskManagement: { score: "B+", trend: "+2" },
    emissions: { score: "C", trend: "-1" }
  },
  emissionData: {
    scope1: { value: 632000, unit: "tCO2e", verified: true },
    scope2: { value: 89000, unit: "tCO2e", verified: true },
    scope3: { value: 245000, unit: "tCO2e", verified: false, categories: ["Purchased goods", "Transportation", "Waste"] }
  },
  targets: {
    shortTerm: { year: 2025, reduction: "15%", baselineYear: 2019 },
    midTerm: { year: 2030, reduction: "30%", baselineYear: 2019 },
    longTerm: { year: 2045, reduction: "90%", baselineYear: 2019, netZero: true }
  },
  risksOpportunities: [
    { type: "risk", category: "Physical", timeframe: "Medium-term", financial: "High", description: "Water scarcity affecting production" },
    { type: "risk", category: "Transition", timeframe: "Short-term", financial: "Medium", description: "Carbon pricing implementation" },
    { type: "opportunity", category: "Products", timeframe: "Medium-term", financial: "High", description: "Low-carbon cement alternatives" }
  ],
  recommendations: [
    "Complete Scope 3 emissions inventory",
    "Implement third-party verification for emissions data",
    "Align targets with 1.5°C pathway",
    "Develop supplier engagement strategy",
    "Implement internal carbon pricing mechanism",
    "Develop science-based net-zero strategy"
  ]
};

export default openai;