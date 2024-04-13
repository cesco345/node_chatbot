import openai from "./config/open-ai.js";
import readLineSync from "readline-sync";
import colors from "colors";

async function main() {
  console.log(colors.bold.green("Welcome to the chatbot!"));
  console.log(colors.bold.green("You can start chatting with the bot now!"));

  // Store chat history
  const chatHistory = [];

  while (true) {
    const userInput = readLineSync.question(colors.bold.yellow("You: "));

    try {
      // Send the chat history and user input to OpenAI
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      // Add the user input to the chat history
      messages.push({ role: "user", content: userInput });

      // Call the API with user input
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      });
      const completionText = completion.choices[0].message.content;

      if (userInput.toLowerCase() === "exit") {
        console.log(colors.bold.green("Bot: Goodbye!"));
        return;
      }
      console.log(colors.green("Bot:") + completionText);

      // Add the bot response to the chat history
      chatHistory.push(["user", userInput]);
      chatHistory.push(["assistant", completionText]);
    } catch (error) {
      console.log(colors.red("An error occurred: " + error.message));
    }
  }
}

main();
