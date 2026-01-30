import Redis, { RedisOptions } from "ioredis";

/**
 * Cria uma varíavel que recebe o type RedisOptions recebendo
 * as propriedades Host, Port e Password configurados no arquivo .env
 * @notes tentativas por requisição sem limite determinado e timeout configurado para 10000 após inatividade.
 */
const redisOptions: RedisOptions = {
  host: process.env.REDISHOST || process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDISPORT || process.env.REDIS_PORT) || 6379,
  retryStrategy(times: number) {
    return Math.min(times * 50, 2000);
  },
  maxRetriesPerRequest: null,
  connectTimeout: 10000,
};

const password = process.env.REDISPASSWORD || process.env.REDIS_PASSWORD;
if (password) {
  redisOptions.password = password;
}

/**
 * Instancia a variável redisOptions conectando o Redis e retornando se foi um sucesso ou a conexão teve erro
 */
export const redis = new Redis(redisOptions);

redis.on("connect", () => {
  console.log("Redis conectado com sucesso!");
});

redis.on("error", (err) => {
  if (err.message.includes("Connection is closed")) {
    console.warn("Redis: Conexão fechada, tentando reconectar...");
  } else {
    console.error("Erro crítico no Redis:", err);
  }
});