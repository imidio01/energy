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
    const pricePerKwh = 12; // exemplo: 14,5 MZN por kWh

    try {
        const { userId } = req.params;

        const balanceResult = await sql`
            SELECT 
                COALESCE(SUM(power_watts * ${hours}) / 1000, 0) AS balance
            FROM devices      

        `;
        //      SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}

        const incomeResult = await sql`
            SELECT
             ((sum(power_watts) * ${hours})/1000) * ${pricePerKwh}  AS income
            FROM devices       
        `;
        const expensesResult = await sql`
            SELECT 
                COALESCE(SUM(power_watts * ${hours}) / 1000, 0) AS expenses
            FROM devices
        `;

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expensesResult[0].expenses,
        });
    } catch (error) {
        console.error("Error while calculating summary:", error);
        return res.status(500).json({ error: "Failed to retrieve summary." });
    }
}