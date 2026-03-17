import { createInterface } from "readline";
import * as fs from "fs"; // file system operations 
import * as path from "path"; // path handling utilities 
import { spawnSync } from "child_process"; // import to run external programs 

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
    const parts = trimmedInput.split(/\s+/) // Split by whitespace 
    const command = parts[0];
    const args = parts.slice(1); // All arguments after command 

    if (command == 'exit') {
        rl.close();
        return;
    } else if (command == 'echo') {
        console.log(args.join(" ")); // Join args back with spaces 
    } else if (command == 'type') {
        const targetCommand = args[0]; // Get first argument for type command 
        if (builtins.includes(targetCommand)) {
            console.log(`${targetCommand} is a shell builtin`);
        } else {
            const executablePath = findExecutable(targetCommand);
            if (executablePath) {
                console.log(`${targetCommand} is ${executablePath}`);
            } else {
                console.log(`${targetCommand}: not found`);
            }
        }
    } else if (command) {
        const executablePath = findExecutable(command);
        if (executablePath) {
            // Runs program synchronously (shell waits for it to complete)
            // stdio: "inherit" - Program uses the same stdin/stdout as the shell 
            // argv0 option sets the program name that executed process sees as its first argument 
            spawnSync(executablePath, args, { stdio: "inherit", argv0: command }); // Run external program, passing through stdin/stdout
        } else {
            console.log(`${command}: command not found`); // backticks for interpolate 
        }
    }

    rl.prompt();
});