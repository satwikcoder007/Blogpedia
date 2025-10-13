import os
import json
import time
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnableSequence

# Load environment variables
load_dotenv()

# Initialize model
model = ChatOpenAI(
    temperature=0.5,
    model="gpt-4o-mini",
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

# Define the prompt
template = PromptTemplate.from_template("""
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
""")

# Create the chain
chain = RunnableSequence(first=template, last=model)


# --- Helper: Retry logic for rate limits (HTTP 429) ---
def invoke_with_retry(input_data, retries=5, delay=1.0):
    for attempt in range(1, retries + 1):
        try:
            return chain.invoke(input_data)
        except Exception as e:
            if hasattr(e, "status_code") and e.status_code == 429:
                wait_time = delay * attempt
                print(f"Rate limit hit (429). Attempt {attempt}/{retries}. Retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise e
    raise Exception("Max retries reached (429)")


# --- Main tag generator ---
def generate_tags(title: str, content: str):
    response = invoke_with_retry({"title": title, "content": content})

    res = getattr(response, "content", None)
    if isinstance(res, list) and len(res) > 0:
        res = res[0].get("text", "")

    try:
        if isinstance(res, str):
            res = json.loads(res)
    except Exception as e:
        print("Failed to parse response:", res)
        raise ValueError("Invalid JSON returned by model")

    return res.get("tags", [])


# Example usage
if __name__ == "__main__":
    tags = generate_tags(
        "AI tools for content creators",
        "Exploring how AI can automate writing, editing, and content strategy for creators."
    )
    print("Generated tags:", tags)
