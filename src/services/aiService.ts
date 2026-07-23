export interface AIResponse {
  text: string;
  error?: string;
}

export function redactSensitiveData(text: string): string {
  if (!text) return '';
  return text
    // Redact NRIC format (e.g. 900101-14-5544)
    .replace(/\b\d{6}-\d{2}-\d{4}\b/g, '[NRIC]')
    // Redact Salary amounts like RM 5,000 or RM5000
    .replace(/RM\s?\d+(?:,\d{3})*(?:\.\d{2})?/gi, 'RM [SALARY_AMOUNT]')
    // Redact Email
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
}

export async function generateAIDraft(prompt: string, systemInstruction?: string): Promise<AIResponse> {
  const redactedPrompt = redactSensitiveData(prompt);

  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: redactedPrompt,
        systemInstruction: systemInstruction || "You are an AI HR Document & Legal Writing Assistant for Malaysian Employment Law (Employment Act 1955 & Sarawak Labour Ordinance). Provide concise, professional, compliant drafts and suggestions. Ensure employee personal data is anonymized with placeholders [EMPLOYEE_NAME], [NRIC], [SALARY_AMOUNT].",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { text: '', error: err.error || 'AI generation failed.' };
    }

    const data = await res.json();
    return { text: data.text || '' };
  } catch (error: any) {
    return { text: '', error: error.message || 'Network error connecting to AI service.' };
  }
}
