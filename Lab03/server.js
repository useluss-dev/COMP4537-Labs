import http from "http";
import { MESSAGES } from "./lang/en/en.js";
import { Utils } from "./modules/utils.js";
import { FileHandler } from "./modules/fileHandler.js";

class Server {
    static INDEX = "/Lab03/";
    static GET_DATE = "/Lab03/getDate/";
    static WRITE_FILE = "/Lab03/writeFile/";
    static READ_FILE = "/Lab03/readFile/";

    constructor(port) {
        this.port = port;
        this.utils = new Utils();
        this.fileHandler = new FileHandler();
    }

    start() {
        http.createServer((req, res) => this.handleRequest(req, res)).listen(
            this.port,
            () => console.log(`Listening on port ${this.port}`)
        );
    }

    matches(pathname, endpoint) {
        return pathname === endpoint || pathname === endpoint.slice(0, -1);
    }

    send(res, status, body, type = "text/plain") {
        res.writeHead(status, { "Content-Type": type });
        res.end(body);
    }

    async handleRequest(req, res) {
        const q = new URL(req.url, "http://localhost");
        const pathname = q.pathname;

        try {
            if (this.matches(pathname, Server.GET_DATE)) {
                this.handleGetDate(q, res);
            } else if (this.matches(pathname, Server.WRITE_FILE)) {
                await this.handleWriteFile(q, res);
            } else if (pathname.startsWith(Server.READ_FILE)) {
                await this.handleReadFile(pathname, res);
            } else if (this.matches(pathname, Server.INDEX)) {
                await this.handleIndex(res);
            } else {
                this.send(res, 404, MESSAGES.NOT_FOUND);
            }
        } catch (err) {
            console.error(err);
            this.send(res, 500, MESSAGES.SERVER_ERROR);
        }
    }

    async handleIndex(res) {
        const html = await fs.readFile(path.join(__dirname, "index.html"));
        this.send(res, 200, html, "text/html");
    }

    handleGetDate(q, res) {
        const name = q.searchParams.get("name") || "stranger";
        const text =
            MESSAGES.GREETING.replace("%1", name) + this.utils.getDate();
        this.send(res, 200, `<p style="color: blue;">${text}</p>`, "text/html");
    }

    async handleWriteFile(q, res) {
        const text = q.searchParams.get("text");
        if (!text) {
            return this.send(res, 400, MESSAGES.MISSING_TEXT);
        }
        await this.fileHandler.append(text);
        this.send(res, 200, MESSAGES.WRITE_SUCCESS.replace("%1", text));
    }

    async handleReadFile(pathname, res) {
        const filename = decodeURIComponent(
            pathname.slice(Server.READ_FILE.length)
        );
        try {
            const content = await this.fileHandler.read(filename);
            this.send(res, 200, content);
        } catch (err) {
            if (err.code === "ENOENT" || err.code === "EISDIR") {
                return this.send(
                    res,
                    404,
                    MESSAGES.FILE_NOT_FOUND.replace("%1", filename)
                );
            }
            throw err;
        }
    }
}

new Server(process.env.PORT || 8888).start();
