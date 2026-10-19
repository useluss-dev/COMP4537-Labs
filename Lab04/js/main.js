const API_BASE = "https://comp4537.mitchellschoolwork.net/lab05/api/v1/sql";

class Patient {
    constructor(name, dateOfBirth) {
        this.name = name;
        this.dateOfBirth = dateOfBirth;
    }

    toValuesTuple() {
        const safeName = this.name.replace(/'/g, "''");
        return `('${safeName}', '${this.dateOfBirth}')`;
    }
}

class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async post(sql) {
        const res = await fetch(this.baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: sql }),
        });
        return this.#toResult(res);
    }

    async get(sql) {
        const url = `${this.baseUrl}/${encodeURIComponent(sql)}`;
        const res = await fetch(url, { method: "GET" });
        return this.#toResult(res);
    }

    async #toResult(res) {
        const text = await res.text();
        let body = text;
        try {
            body = JSON.stringify(JSON.parse(text), null, 2);
        } catch (e) {
            // not JSON; show raw text
        }
        return { ok: res.ok, status: res.status, body: body };
    }
}

class PatientApp {
    constructor(api) {
        this.api = api;
        this.samplePatients = [
            new Patient("Sara Brown", "1901-01-01"),
            new Patient("John Smith", "1941-01-01"),
            new Patient("Jack Ma", "1961-01-30"),
            new Patient("Elon Musk", "1999-01-01"),
        ];

        this.insertBtn = document.getElementById("insertBtn");
        this.queryBtn = document.getElementById("queryBtn");
        this.queryInput = document.getElementById("queryInput");
        this.output = document.getElementById("output");

        this.#applyStrings();
        this.insertBtn.addEventListener("click", () => this.handleInsert());
        this.queryBtn.addEventListener("click", () => this.handleQuery());
    }

    #applyStrings() {
        document.title = STRINGS.PAGE_TITLE;
        document.getElementById("heading").textContent = STRINGS.HEADING;
        document.getElementById("insertHeading").textContent =
            STRINGS.INSERT_HEADING;
        document.getElementById("queryHeading").textContent =
            STRINGS.QUERY_HEADING;
        document.getElementById("responseHeading").textContent =
            STRINGS.RESPONSE_HEADING;
        document.getElementById("queryLabel").textContent = STRINGS.QUERY_LABEL;
        this.insertBtn.textContent = STRINGS.INSERT_BUTTON;
        this.queryBtn.textContent = STRINGS.QUERY_BUTTON;
        this.queryInput.placeholder = STRINGS.QUERY_PLACEHOLDER;
        this.output.textContent = STRINGS.RESPONSE_EMPTY;
    }

    #buildInsertSql() {
        const values = this.samplePatients
            .map((p) => p.toValuesTuple())
            .join(", ");
        return `INSERT INTO patient (name, dateOfBirth) VALUES ${values}`;
    }

    async handleInsert() {
        await this.#run(() => this.api.post(this.#buildInsertSql()));
    }

    async handleQuery() {
        const sql = this.queryInput.value.trim();
        if (sql === "") {
            this.output.textContent = STRINGS.ERR_EMPTY_QUERY;
            return;
        }
        // No filtering here on purpose: protection is enforced server-side
        // with a SELECT-only database user.
        await this.#run(() => this.api.get(sql));
    }

    async #run(request) {
        this.output.textContent = STRINGS.LOADING;
        try {
            const result = await request();
            const prefix = result.ok
                ? ""
                : `${STRINGS.ERR_HTTP}${result.status})\n`;
            this.output.textContent = prefix + result.body;
        } catch (err) {
            this.output.textContent = STRINGS.ERR_NETWORK + err.message;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new PatientApp(new ApiClient(API_BASE));
});
