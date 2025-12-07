import express from "express";
import "dotenv/config";
import cors from "cors";
import routes from "./routes";

const app = express();

// --- CORS CONFIG ---
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://stunning-tulumba-25517c.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- JSON ---
app.use(express.json());

// --- ROUTES ---
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
