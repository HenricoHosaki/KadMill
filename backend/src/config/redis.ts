import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  ...(process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {}),
  family: 0,
});

redis.on("connect", () => {
  console.log("Redis conectado");
});

redis.on("error", (err) => {
  console.error("Erro Redis:", err);
});