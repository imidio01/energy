import { sql } from "../config/db.js";

export async function createBrand(req, res) {
    const { name } = req.body;
    try {
        const result = await sql`
      INSERT INTO brands (name) VALUES (${name}) RETURNING *
    `;
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao inserir marca.' });
    }
};

export async function getBrand(req, res) {
    try {
        const brands = await sql`
            SELECT * FROM brands
        `;
        res.status(200).json(brands);
    } catch (error) {
        console.error("Erro buscando dados:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateBrand(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Id Inválido!!" });
        }

        const result = await sql`
            UPDATE brands
            SET name = ${name} WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            return res.status(404).json({ message: "Não encontrado!!" });
        }
        res.status(200).json({ message: "Actualizado com sucesso!!!", updated: result[0] });
    } catch (error) {
        console.error("Falha ao actualizar Marca:", error);
        res.status(500).json({ error: "Failed to update brand." });
    }
}

export async function deleteBrand(req, res) {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Id Inválido!!" });
        }

        const result = await sql`
            DELETE FROM brands WHERE id = ${id} RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: "Não encontrado!!" });
        }

        res.status(200).json({ message: "Deletado com sucesso!!" });
    } catch (error) {
        console.error("Error while deleting transaction:", error);
        return res.status(500).json({ error: "Failed to delete transaction." });
    }
}

