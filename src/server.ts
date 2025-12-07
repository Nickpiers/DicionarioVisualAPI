import express from "express";
import "dotenv/config";
import cors from "cors";
import routes from "./routes";
import bcrypt from "bcryptjs";

const app = express();

// --- CORS CONFIG ---
app.use(
  cors({
    origin: ["http://localhost:5173", "https://dicionariovisual.netlify.app"],
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

// TESTES DE DEPLOY REMOVER DEPOIS
app.get("/test-env", (req, res) => {
  res.json({
    JWT_SECRET: process.env.JWT_SECRET ? "LOADED" : "MISSING",
  });
});

app.get("/bcrypt-test", async (req, res) => {
  const testPassword = "123";
  const storedHash =
    "$2a$10$y3jQnJPwmETxAf.Dl7EtFObK8u0UqjhMT8GR42kUZjP1k2XHvUSeG";

  const ok = await bcrypt.compare(testPassword, storedHash);

  res.json({
    password: testPassword,
    hash: storedHash,
    matches: ok,
  });
});
