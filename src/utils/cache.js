const redis = require("../clients/redis.client");
const crypto = require("crypto");

// Generic hash generator
const hashBuffer = (buffer) =>
    crypto.createHash("sha256").update(buffer).digest("hex");

// Generic get cache
const getCache = async (type, hash) => {
    const key = `${type}:${hash}`;
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
};

// Generic save cache
const saveCache = async (type, hash, data, expire = 86400) => {
    const key = `${type}:${hash}`;
    await redis.set(key, JSON.stringify(data), "EX", expire);
};

module.exports = {
    hashBuffer,
    getCache,
    saveCache
};
