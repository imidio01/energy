import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import userRoute from "./routes/userRoute.js";
import brandRoute from "./routes/brandRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import deviceRoute from "./routes/deviceRoute.js";
import modelRoute from "./routes/modelRoute.js";

dotenv.config();

const app = express();

app.use(rateLimiter);

app.use(express.json());

app.use((req, res, next) => {
    console.log("Requisição feita ao servidor: ", req.method);
    next();
});

const PORT = process.env.PORT;

app.get("/health", (req, res) => {
    res.send("Funcionadndo!!!");
});

//Rotas
app.use("/api/transactions", transactionsRoute);
app.use("/api/profile", userRoute);
app.use("/api/brand", brandRoute);
app.use("/api/category", categoryRoute);
app.use("/api/device", deviceRoute);
app.use("/api/model", modelRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Servidor aberto na porta: ", PORT);
    });
})