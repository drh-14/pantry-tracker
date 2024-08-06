import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "Based on the following pantry list, provide recommendations for a recipe to make. Furthermore, please inform the user about item restocks that they should do."}],
    model: "gpt-4o-mini",
  });

  console.log(completion.choices[0]);
}

main();