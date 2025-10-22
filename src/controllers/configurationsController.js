import { sql } from "../config/db.js";

export async function createConfiguration(req, res) {
    try {
        const { price_per_kwh_dom, price_per_kwh_gen} = req.body;
        
        await sql`
            INSERT INTO configurations (price_per_kwh_dom, price_per_kwh_gen)
            VALUES (${price_per_kwh_dom}, ${price_per_kwh_gen})
            `;
        res.status(201).json({ message: "Configurations created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error creating configurations" });
    }
};

export async function updateConfiguration(req, res) {
    try {
        const { price_per_kwh_dom, price_per_kwh_gen } = req.body;

        await sql`
            UPDATE configurations
            SET price_per_kwh_dom = ${price_per_kwh_dom}, price_per_kwh_gen = ${price_per_kwh_gen}
            `;

        res.status(200).json({ message: "Configurations updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error updating configurations" });
    }
}

export async function getConfiguration(req, res) {
    try {
        const profile = await sql`
            SELECT * FROM configurations ORDER BY created_at DESC limit 1
        `;
        res.status(200).json(profile);
    } catch (error) {
        console.error("Erro buscando dados:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}