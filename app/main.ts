import { createInterface } from "readline";
import * as fs from "fs"; // file system operations 
import * as path from "path"; // path handling utilities 

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

const builtins = ['echo', 'exit', 'type'];

function findExecutable(command: string): string | null {
    const pathEnv = process.env.PATH || "";
    const directories = pathEnv.split(path.delimiter); // OS-agnostic path separator (: on Unix, ; on Windows)

    for (const dir of directories) {
        const fullPath = path.join(dir, command);
        try {
            // if file exists &&  check execute permission 
            if (fs.existsSync(fullPath) && fs.statSync(fullPath).mode & fs.constants.X_OK) {
                return fullPath;
            }
        } catch {
            // Directories doesn't exist or can't be accessed, skip it 
        }
    }
    return null;
}

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
            const executablePath = findExecutable(args);
            if (executablePath) {
                console.log(`${args} is ${executablePath}`);
            } else {
                console.log(`${args}: not found`);
            }
        }
    } else if (command) {
        console.log(`${command}: command not found`); // backticks for interpolate 
    }

    rl.prompt();
});