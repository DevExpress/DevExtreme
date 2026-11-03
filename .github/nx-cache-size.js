const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const root = process.env.GITHUB_WORKSPACE || process.cwd();
const dir = path.join(root, '.nx/workspace-data');
const start = fs.statSync(path.join(root, 'package.json')).mtime.toISOString().replace('T', ' ').slice(0, 19);
const mb = (bytes) => `${Math.round((bytes ?? 0) / 1048576)} MB`;
const label = `${process.env.GITHUB_WORKFLOW} / ${process.env.GITHUB_JOB}`;

for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.db'))) {
  const db = new DatabaseSync(path.join(dir, file));
  const all = db.prepare('SELECT COUNT(*) AS n, SUM(size) AS s FROM cache_outputs').get();
  const job = db.prepare('SELECT COUNT(*) AS n, SUM(size) AS s FROM cache_outputs WHERE accessed_at >= ?').get(start);
  console.log(`nx-cache-size | ${label} | total ${all.n} entries ${mb(all.s)} | this job ${job.n} entries ${mb(job.s)} | since ${start}`);
}
