import { sql } from "../config/db.js";

export async function createModel(req, res) {
    const { name, brand_id } = req.body;
    try {
        const result = await sql`
      INSERT INTO models (name, brand_id) VALUES (${name}, ${brand_id}) RETURNING *
    `;
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao inserir modelo.' });
    }
};

export async function getModel(req, res) {
    try {
        const models = await sql`
            SELECT * FROM models
        `;
        res.status(200).json(models);
    } catch (error) {
        console.error("Erro buscando dados:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateModel(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Id Inválido!!" });
        }

        const result = await sql`
            UPDATE models
            SET name = ${name} WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            return res.status(404).json({ message: "Não encontrado!!" });
        }
        res.status(200).json({ message: "Actualizado com sucesso!!!", updated: result[0] });
    } catch (error) {
        console.error("Falha ao actualizar Categoria:", error);
        res.status(500).json({ error: "Failed to update brand." });
    }
}

export async function deleteModel(req, res) {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Id Inválido!!" });
        }

        const result = await sql`
            DELETE FROM models WHERE id = ${id} RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: "Não encontrado!!" });
        }
        res.status(200).json({ message: "Deletado com sucesso!!" });
    } catch (error) {
        console.error("Error while deleting model:", error);
        return res.status(500).json({ error: "Failed to delete model." });
    }
}

