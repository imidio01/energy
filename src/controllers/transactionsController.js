import { sql } from "../config/db.js";


export async function getTransactionsByUserId(req, res) {
    try {
        const { userId } = req.params;
        console.log("Usuário: ", userId);


        const transactions = await sql`
                SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
            `;

        res.status(200).json(transactions);

    } catch (error) {
        console.log("Error ao Buscar os dados", error);
        res.status(500).json({ message: "Erro Interno no Servidor!" })
    }
}

export async function getTransactionsDetails(req, res) {
    try {
        const { deviceId } = req.params;
        const devices = await sql`
            SELECT * FROM devices WHERE id = ${deviceId} limit 1
        `;
        console.log("Data:", devices);

        res.status(200).json(devices); // ✅ corrected
    } catch (error) {
        console.error("Erro buscando dados:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function createTransaction(req, res) {
    try {



        const { title, amount, category, user_id } = req.body;


        console.log("Title", title, "CT: ", category);


        if (!title || !user_id || !category || amount === undefined) {
            return res.status(400).json({ message: "Campos são obrigatórios" });
        }


        const transaction = await sql`
            INSERT INTO transactions(user_id,title,amount,category) 
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
        `;

        console.log(transaction);
        res.status(201).json(transaction[0]);

    } catch (error) {
        console.log("Error ao introduzir transacoes", error, title, user_id, category, amount,);
        res.status(500).json({ message: "Erro Interno no Servidor!" })
    }
}

export async function deleteTransaction(req, res) {
    try {
        const { id } = req.params;

        console.log("Transacao: ", id);

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Id inválido" });
        };

        const result = await sql`
         DELETE FROM transactions WHERE id = ${id} RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: "Transacao nao encontrada" })
        }
        res.status(200).json({ message: "Deletado com sucesso" })

    } catch (error) {
        console.log("Error ao deletar transacao", error);
        res.status(500).json({ message: "Erro Interno no Servidor!" })
    }
}

export async function getSummaryByUserId(req, res) {
    const hours = 24; // exemplo: 5h/dia
    //const pricePerKwh = 12; // exemplo: 14,5 MZN por kWh
    let pricePerKwh;
    let consumptionResult, expensesResult, incomeResult, balanceResult, income, expenses;

    try {
        const { userId } = req.params;
        console.log("Usuario:       ", userId)
        const typeCl = await sql`
                SELECT type FROM profile WHERE user_id = ${userId} LIMIT 1
            `;

        const configs = await sql`
                select price_per_kwh_dom,price_per_kwh_gen from configurations LIMIT 1
            `;

        if (typeCl[0].type === "Doméstico") {

            pricePerKwh = Number(configs[0].price_per_kwh_dom);

            consumptionResult = await sql`
                SELECT 
                    COALESCE(SUM(power_watts * ${hours}) / 1000, 0) AS consumption_kwh
                FROM devices
                WHERE userid = ${userId}
            `;

            console.log("consumptionResult:    ", consumptionResult);

            expensesResult = await sql`
                SELECT 
                    COALESCE(SUM((power_watts * ${hours}) / 1000 * ${pricePerKwh}), 0) AS expenses_mt
                FROM devices
                WHERE userid = ${userId}
            `;

            // Para doméstico, o "income" pode não existir — depende do caso
            incomeResult = { income_mt: 0 };

            balanceResult = {
                balance_mt: incomeResult.income_mt - expensesResult[0].expenses_mt
            };

            console.log({
                type: "Doméstico",
                consumption_kwh: consumptionResult[0].consumption_kwh,
                expenses_mt: expensesResult[0].expenses_mt,
                income_mt: incomeResult.income_mt,
                balance_mt: balanceResult.balance_mt
            });

        } else {

            pricePerKwh = Number(configs[0].price_per_kwh_gen);

            consumptionResult = await sql`
                SELECT 
                    COALESCE(SUM(power_watts * ${hours}) / 1000, 0) AS consumption_kwh
                FROM devices
                WHERE userid = ${userId}
            `;

            expensesResult = await sql`
                SELECT 
                    COALESCE(SUM((power_watts * ${hours}) / 1000 * ${pricePerKwh}), 0) AS expenses_mt
                FROM devices
                WHERE userid = ${userId}
            `;

            // Exemplo: cliente geral pode ter geração de energia (painéis solares, etc.)
            // ou faturamento baseado em produção
            incomeResult = await sql`
                SELECT 
                    COALESCE(SUM((generation_watts * ${hours}) / 1000 * ${pricePerKwh}), 0) AS income_mt
                FROM energy_sources
                WHERE userid = ${userId}
            `;

            balanceResult = {
                balance_mt: incomeResult[0].income_mt - expensesResult[0].expenses_mt
            };

            console.log({
                type: "Geral",
                consumption_kwh: consumptionResult[0].consumption_kwh,
                expenses_mt: expensesResult[0].expenses_mt,
                income_mt: incomeResult[0].income_mt,
                balance_mt: balanceResult.balance_mt
            });
        }
        res.status(200).json({
            type: typeCl[0].type,
            consumption_kwh: consumptionResult[0]?.consumption_kwh ? consumptionResult[0]?.consumption_kwh : 0,
            expenses_mt: expensesResult[0].expenses_mt,
            income_mt: incomeResult.income_mt ?? incomeResult[0]?.income_mt ?? 0,
            balance_mt: balanceResult.balance_mt,
            balance: consumptionResult[0]?.consumption_kwh ? consumptionResult[0]?.consumption_kwh : 0,
            income: incomeResult[0]?.income ?? 0, 
            expenses: expensesResult[0].expenses
        });

    } catch (error) {
        console.error("Error while calculating summary:", error);
        return res.status(500).json({ error: "Failed to retrieve summary." });
    }
}