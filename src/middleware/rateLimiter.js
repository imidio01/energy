import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {

    try {

        const { success } = await ratelimit.limit("my-rate-limit");

        if (!success) {
            return res.status(429).json({
                message: "Excedeu o limite de tentativas, tente mais tarde!",
            });
        }

        next();

    } catch (error) {
        console.log("Erro no limite de transacoes", error);
        next(error);
    }
}

export default rateLimiter; 