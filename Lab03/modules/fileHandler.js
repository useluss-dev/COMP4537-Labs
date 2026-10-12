import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class FileHandler {
    static DIR = path.join(__dirname, "..", "files");
    static DEFAULT_FILE = "file.txt";

    // appendFile creates the file if it doesn't exist, otherwise adds to the bottom
    async append(text) {
        await fs.mkdir(FileHandler.DIR, { recursive: true });
        const filePath = path.join(FileHandler.DIR, FileHandler.DEFAULT_FILE);
        await fs.appendFile(filePath, text + "\n");
    }

    // path.basename strips any ../ so only files inside DIR can be read
    async read(filename) {
        const safeName = path.basename(filename);
        return fs.readFile(path.join(FileHandler.DIR, safeName), "utf8");
    }
}
