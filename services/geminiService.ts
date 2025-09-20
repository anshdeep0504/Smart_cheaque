import { GoogleGenAI, Type } from "@google/genai";
import { Cheque, ExtractedChequeData } from '../types';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("CRITICAL: Gemini API key is missing.");
}

const ai = new GoogleGenAI({ apiKey });

export const extractChequeDetailsFromImage = async (
    imagePart: { inlineData: { mimeType: string; data: string; } }
): Promise<ExtractedChequeData> => {
    const model = 'gemini-2.5-flash';
    const textPart = {
        text: "Analyze the attached image of a financial cheque. Extract the following details: payee name, cheque number, amount, and the date. The date should be in YYYY-MM-DD format. Ensure the amount is a number."
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: {
                            type: Type.STRING,
                            description: "The name of the payee."
                        },
                        chequeNumber: {
                            type: Type.STRING,
                            description: "The unique number of the cheque."
                        },
                        amount: {
                            type: Type.NUMBER,
                            description: "The numerical amount of the cheque."
                        },
                        date: {
                            type: Type.STRING,
                            description: "The date on the cheque in YYYY-MM-DD format."
                        }
                    },
                    required: ["name", "chequeNumber", "amount", "date"]
                }
            }
        });
        
        const jsonString = response.text.trim();
        const parsedData = JSON.parse(jsonString);
        
        // Basic validation of the parsed data
        if (
            typeof parsedData.name === 'string' &&
            typeof parsedData.chequeNumber === 'string' &&
            typeof parsedData.amount === 'number' &&
            typeof parsedData.date === 'string'
        ) {
            return parsedData as ExtractedChequeData;
        } else {
            throw new Error("AI response did not match the expected format.");
        }

    } catch (error) {
        console.error("Error calling Gemini API for cheque extraction:", error);
        throw new Error("Failed to analyze cheque image. Please check the image or try entering the details manually.");
    }
};


export const askAboutChequesStream = async (cheques: Cheque[], query: string) => {
    const model = 'gemini-2.5-flash';
    
    // Create a concise string representation of the cheque data, excluding images
    const chequeDataString = JSON.stringify(cheques.map(c => ({
        name: c.name,
        chequeNumber: c.chequeNumber,
        amount: c.amount,
        date: c.date,
        status: c.status
    })), null, 2);

    const systemInstruction = `You are an expert financial assistant for an Indian SME. Your task is to analyze the provided cheque data and answer user questions accurately and concisely. The current date is ${new Date().toLocaleDateString()}. Here is the current list of cheques in JSON format:\n${chequeDataString}`;
    
    const contents = `User Query: "${query}"`;

    try {
        const responseStream = await ai.models.generateContentStream({
            model: model,
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return responseStream;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get response from AI assistant.");
    }
};