import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();

rl.on("line", (input: string) => {
    const trimmedInput = input.trim();
    const command = trimmedInput.split(" ")[0];

    if (command) {
        console.log(`${command}: command not found`); // backticks for interpolate 
    }

    rl.prompt();
});