import { neon } from "@neondatabase/serverless"


import "dotenv/config";

//Criacao de uma conexao simples
export const sql = neon(process.env.DATABASE_URL)

export async function initDB() {
    try {

        await sql`
            CREATE TABLE IF NOT EXISTS profile(
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL,
                created_at DATE NOT NULL DEFAULT CURRENT_DATE
            )
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS brands (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL
            )`;

        await sql`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL
            )`;

        await sql`
            CREATE TABLE IF NOT EXISTS models (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                brand_id INT REFERENCES brands(id) ON DELETE CASCADE
            )`;

        await sql`
            CREATE TABLE IF NOT EXISTS devices (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                type VARCHAR(50),
                brand_id INT REFERENCES brands(id),
                model_id INT REFERENCES models(id),
                category_id INT REFERENCES categories(id),
                power_watts INT,
                voltage_volts INT,
                current_amperes INT,
                location VARCHAR(100),
                userId VARCHAR(100),
                installation_date DATE,
                status VARCHAR(20) DEFAULT 'Active'
            )
            `;

        await sql`
            CREATE TABLE IF NOT EXISTS device_usage_logs (
                id SERIAL PRIMARY KEY,
                device_id INT REFERENCES devices(id) ON DELETE CASCADE,
                start_time TIMESTAMP NOT NULL,
                end_time TIMESTAMP NOT NULL,
                power_watts INT NOT NULL, -- precisa ser salvo no momento do uso
                duration_hours DECIMAL(5,2),
                energy_kwh DECIMAL(10,3)
            )
            `;

        await sql`
            CREATE TABLE IF NOT EXISTS transactions(
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                category VARCHAR(255) NOT NULL,
                created_at DATE NOT NULL DEFAULT CURRENT_DATE
            )
        `
        await sql`
            CREATE TABLE IF NOT EXISTS configurations (
                id SERIAL PRIMARY KEY,
                price_per_kwh_dom DECIMAL(10, 2) NOT NULL,
                price_per_kwh_gen DECIMAL(10, 2) NOT NULL,
                created_at DATE NOT NULL DEFAULT CURRENT_DATE
            )`;
        console.log("Database initialized successfully");

    } catch (error) {
        console.log("Error Initializing DB", error);
        process.exit(1);
    }
} 