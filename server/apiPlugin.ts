import { GoogleGenAI } from "@google/genai";
import express from "express";

export function apiPlugin() {
  return {
    name: 'api-plugin',
    configureServer(server: any) {
      server.middlewares.use(express.json());
      
      server.middlewares.use('/api/gemini/generate', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end(JSON.stringify({ error: 'Method not allowed' }));
        }

        try {
          const { prompt, systemInstruction } = req.body || {};
          const apiKey = process.env.GEMINI_API_KEY;

          if (!apiKey) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: 'GEMINI_API_KEY environment variable is not configured.' }));
          }

          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          });

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
              systemInstruction: systemInstruction || "You are an expert AI HR Document & Legal Writing Assistant for Malaysian Employment Law (Employment Act 1955 & Sarawak Labour Ordinance). Provide concise, compliant, professional HR drafts and text suggestions. Automatically redact names, NRICs, and salary numbers with [EMPLOYEE_NAME], [NRIC], [SALARY_AMOUNT] if present.",
            }
          });

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ text: response.text }));
        } catch (error: any) {
          console.error("Gemini API Error:", error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message || 'Failed to process AI request' }));
        }
      });
    }
  }
}
