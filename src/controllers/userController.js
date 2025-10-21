import { sql } from "../config/db.js";

export async function createUserProfile(req, res) {
    try {
        const { user_id, name, location, type } = req.body;
        console.log("_id: ", user_id);
        await sql`
            INSERT INTO profile (user_id, name, location, type)
            VALUES (${user_id}, ${name}, ${location}, ${type})
            `;
        res.status(201).json({ message: "Profile created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error creating profile" });
    }
};

export async function updateUserProfile(req, res) {
    try {
        const { id } = req.params;
        const { name, location, type } = req.body;

        await sql`
            UPDATE profile
            SET name = ${name}, location = ${location}, type = ${type}
            WHERE user_id = ${id}
            `;

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error updating profile" });
    }
}

export async function getUserProfile(req, res) {
    try {
        const { userId } = req.params;
        const profile = await sql`
            SELECT * FROM profile WHERE user_id = ${userId} ORDER BY created_at DESC limit 1
        `;
        res.status(200).json(profile);
    } catch (error) {
        console.error("Erro buscando dados:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}