import { sql } from "../config/db.js";

export async function createDevice(req, res) {
    const {
        name,
        brand,
        model,
        category_id,
        type,
        power_watts,
        voltage_volts,
        current_amperes,
        location,
        responsible_person,
        installation_date,
        status
    } = req.body;
    try {
        const result = await sql`
        INSERT INTO devices (
            name, brand, model, category_id, type,
            power_watts, voltage_volts, current_amperes, location,
            responsible_person, installation_date, status
        ) VALUES (
            ${name}, ${brand}, ${model}, ${category_id}, ${type},
            ${power_watts}, ${voltage_volts}, ${current_amperes}, ${location},
            ${responsible_person}, ${installation_date}, ${status}
        ) RETURNING *
        `;
        res.json(result[0]);
    } catch (error) {
        console.error("Erro ao inserir equipamento:", error); // Logs full error in terminal
        res.status(500).json({ error: error.message || 'Erro ao inserir equipamento.' });
    }
};

export async function getDeviceByUserId(req, res) {
    try {
        const { userId } = req.params;
        const devices = await sql`
            SELECT * FROM devices WHERE userid = ${userId} order by installation_date desc
        `;
        console.log("Data:", 1);

        res.status(200).json(devices);
    } catch (error) {
        console.error("Erro buscando dados:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAllDevices(req, res) {
    try {
        const devices = await sql`
            SELECT * FROM devices order by installation_date desc
        `;
        console.log("Data:", 1);

        res.status(200).json(devices);
    } catch (error) {
        console.error("Erro buscando dados:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getDeviceDetailsByDeviceId(req, res) {
    try {
        const { deviceId } = req.params;
        const devices = await sql`
            SELECT * FROM devices WHERE id = ${deviceId} limit 1
        `;
        console.log("Data:", 1);

        res.status(200).json(devices);
    } catch (error) {
        console.error("Erro buscando dados:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteDevice(req, res) {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Id Inválido!!" });
        }

        const result = await sql`
            DELETE FROM devices WHERE id = ${id} RETURNING *
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

export async function updateDevice(req, res) {
    try {
        const { id } = req.params;
        const { name, brand, category_id, type, power_watts, voltage_volts, current_amperes,
            location, installation_date, model, status
        } = req.body;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Id Inválido!!" });
        }

        const result = await sql`
            UPDATE devices
            SET name = ${name}, brand = ${brand}, model = ${model}, category_id = ${category_id},
            type = ${type}, power_watts = ${power_watts}, voltage_volts = ${voltage_volts},
            current_amperes = ${current_amperes}, location = ${location}, installation_date = ${installation_date},
            status = ${status} WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            return res.status(404).json({ message: "Não encontrado!!" });
        }
        res.status(200).json({ message: "Actualizado com sucesso!!!", updated: result[0] });
    } catch (error) {
        console.error("Falha ao actualizar Equipamento:", error);
        res.status(500).json({ error: "Failed to update equipment." });
    }
}