import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

const builtins = ['echo', 'exit', 'type'];

rl.prompt();

rl.on("line", (input: string) => {
    const trimmedInput = input.trim();
    const command = trimmedInput.split(" ")[0];
    const args = trimmedInput.slice(command.length).trim();

    if (command == 'exit') {
        rl.close();
        return;
    } else if (command == 'echo') {
        console.log(args);
    } else if (command == 'type') {
        if (builtins.includes(args)) {
            console.log(`${args} is a shell builtin`);
        } else {
            console.log(`${args}: not found`);
        }
    } else if (command) {
        console.log(`${command}: command not found`); // backticks for interpolate 
    }

    rl.prompt();
});