import app from "./app"
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;

app.server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("Para encerrar precione CRTL + C");
    console.log("Good Code! 🚀");
});
