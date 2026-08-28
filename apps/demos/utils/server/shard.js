function readShardConfig(env = process.env) {
  const SHARD_TOTAL = Math.max(1, parseInt(env.CSP_SHARD_TOTAL, 10) || 1);
  const n = parseInt(env.CSP_SHARD_INDEX, 10);
  const SHARD_INDEX = n >= 1 && n <= SHARD_TOTAL ? n : 1;
  return { SHARD_TOTAL, SHARD_INDEX };
}

function applyShard(items, keyFn, { SHARD_TOTAL, SHARD_INDEX }) {
  if (SHARD_TOTAL <= 1) return items;
  const sorted = [...items].sort((a, b) => keyFn(a).localeCompare(keyFn(b)));
  return sorted.filter((_, i) => i % SHARD_TOTAL === SHARD_INDEX - 1);
}

module.exports = { readShardConfig, applyShard };
