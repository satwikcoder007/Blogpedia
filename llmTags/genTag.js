import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { configDotenv } from "dotenv";
import { RunnableSequence } from "@langchain/core/runnables";

configDotenv();

const model = new ChatOpenAI({
  temperature: 0.5,
  model: "gpt-4o-mini",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const template = PromptTemplate.fromTemplate(`
You are an assistant that generates concise, context-relevant tags for blog articles.

Requirements:
- Return **2 to 3** tags.
- Each tag must be 1–3 words, widely recognizable, and derived from the content.
- No hashtags, no sentences, no unrelated terms, no duplicates.
- Lowercase; prefer noun phrases (e.g., "machine learning", "personal finance").

Return **JSON only** with no extra text:
{{"tags": ["tag1", "tag2", "tag3"]}}

Input:
Title: {title}
Content: {content}
`);

const chain = RunnableSequence.from([template, model]);

// --- Helper: Retry logic for 429s ---
async function invokeWithRetry(input, retries = 5, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await chain.invoke(input);
    } catch (err) {
      if (err.status === 429) {
        console.warn(
          `Rate limit hit (429). Attempt ${attempt} of ${retries}. Retrying in ${delay *
            attempt}ms...`
        );
        await new Promise((r) => setTimeout(r, delay * attempt));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Max retries reached (429)");
}

export async function generateTags(title, content) {
  const response = await invokeWithRetry({ title, content });

  let res = response.content;
  try {
    if (typeof res === "string") {
      res = JSON.parse(res);
    }
  } catch (e) {
    console.error("Failed to parse response:", res);
    throw new Error("Invalid JSON returned by model");
  }

  return res.tags || [];
}

// const tags = await generateTags(
//   "How AI is Changing Healthcare",
//   "Artificial intelligence is revolutionizing healthcare by enabling faster diagnoses, personalized treatment plans, and predictive analytics..."
// );

// console.log(tags); 
// -> ["artificial intelligence", "healthcare", "predictive analytics"]
