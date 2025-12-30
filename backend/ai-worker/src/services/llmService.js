import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

let groq;

if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

export const rewriteArticle = async (originalArticle, referenceContents) => {
    if (!groq) {
        console.error("GROQ_API_KEY not found in environment variables.");
        return originalArticle.content; // Return original if no AI
    }

    const prompt = `
    You are a professional content editor. Your task is to rewrite and improve the following article based on the provided reference materials.

    **Guidelines:**
    1.  **Improve Quality**: Enhance clarity, flow, and structure. Add appropriate subheadings.
    2.  **Match Key Information**: Ensure the core topic remains the same, but enrich it with insights from the references.
    3.  **Tone**: Professional, informative, and engaging.
    4.  **Format**: Return ONLY the body content in partial HTML format (e.g., <p>, <h2>, <ul>). Do NOT include <html> or <body> tags. Do not use markdown.
    5.  **Originality**: Do not just copy the references. Synthesize the information.

    **Reference Material 1:**
    ${referenceContents[0] || 'No reference available.'}

    **Reference Material 2:**
    ${referenceContents[1] || 'No reference available.'}

    **Original Article to Rewrite:**
    Title: ${originalArticle.title}
    Content:
    ${originalArticle.content}
    `;

    try {
        console.log(`Sending to Groq AI for rewriting: ${originalArticle.title}`);
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert article rewriter and SEO specialist.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama3-70b-8192', // Using a capable model available on Groq
        });

        const newContent = completion.choices[0]?.message?.content;
        return newContent || originalArticle.content;

    } catch (error) {
        console.error('LLM Rewrite failed:', error);
        return originalArticle.content;
    }
};
