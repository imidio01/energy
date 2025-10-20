import { sql } from "../config/db.js";

export async function createCategory(req, res) {
    const { name } = req.body;
    try {
        const result = await sql`
      INSERT INTO categories (name) VALUES (${name}) RETURNING *
    `;
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao inserir categoria.' });
    }
};

export async function getCategory(req, res) {
    try {
        const categories = await sql`
            SELECT * FROM categories
        `;
        res.status(200).json(categories);
    } catch (error) {
        console.error("Erro buscando dados:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Id Inválido!!" });
        }

        const result = await sql`
            UPDATE categories
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

export async function deleteCategory(req, res) {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Id Inválido!!" });
        }

        const result = await sql`
            DELETE FROM categories WHERE id = ${id} RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: "Não encontrado!!" });
        }
        res.status(200).json({ message: "Deletado com sucesso!!" });
    } catch (error) {
        console.error("Error while deleting category:", error);
        return res.status(500).json({ error: "Failed to delete category." });
    }
}

