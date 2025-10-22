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
import configurationRoute from "./routes/configurationRoute.js"

import job from "./config/cron.js";

dotenv.config();

const app = express();

if(process.env.NODE_ENV==="production") job.start();

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

app.get("/api/health", (req, res) => {
    res.status(200).json({status: "OK!"});
});
//Rotas
app.use("/api/transactions", transactionsRoute);
app.use("/api/profile", userRoute);
app.use("/api/brand", brandRoute);
app.use("/api/category", categoryRoute);
app.use("/api/device", deviceRoute);
app.use("/api/model", modelRoute);
app.use("/api/configuration", configurationRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Servidor aberto na porta: ", PORT);
    });
})