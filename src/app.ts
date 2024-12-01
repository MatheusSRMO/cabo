import express from "express";
import language from "./routes/languageRoute";
import cors from "cors";

class App {
    public server: express.Application;

    constructor() {
        this.server = express();
        this.middleware();
        this.router();
    }

    private middleware() {
        this.server.use(express.json());
        this.server.use(cors());
    }

    private router() {
        this.server.use(language);
    }
}

export default new App();
