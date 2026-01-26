import Redis, { RedisOptions } from "ioredis";

// Montamos as opções básicas primeiro
const redisOptions: RedisOptions = {
  host: process.env.REDISHOST || process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDISPORT || process.env.REDIS_PORT) || 6379,
  retryStrategy(times: number) {
    return Math.min(times * 50, 2000);
  },
  maxRetriesPerRequest: null,
  connectTimeout: 10000,
};

// Só adicionamos a senha ao objeto se ela realmente existir
// Isso evita o erro de "string | undefined" no TypeScript
const password = process.env.REDISPASSWORD || process.env.REDIS_PASSWORD;
if (password) {
  redisOptions.password = password;
}

export const redis = new Redis(redisOptions);

redis.on("connect", () => {
  console.log("✅ Redis conectado com sucesso!");
});

redis.on("error", (err) => {
  if (err.message.includes("Connection is closed")) {
    console.warn("⚠️ Redis: Conexão fechada, tentando reconectar...");
  } else {
    console.error("❌ Erro crítico no Redis:", err);
  }
});