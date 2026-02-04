"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const LICENSE_ENV = "DevExpress_License";
const LICENSE_PATH_ENV = "DevExpress_LicensePath";
const LICENSE_FILE = "DevExpress_License.txt";

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function readTextFileIfExists(filePath) {
  try {
    if (!filePath) return null;
    if (!fs.existsSync(filePath)) return null;
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    return isNonEmptyString(raw) ? raw : null;
  } catch {
    return null;
  }
}

function normalizeKey(raw) {
  if (!isNonEmptyString(raw)) return null;
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;
  const lcxLike = lines.find((l) => l.startsWith("LCX"));
  return (lcxLike || lines[0]).trim();
}

function getDefaultLicenseFilePath() {
  const home = os.homedir();

  if (process.platform === "win32") {
    const appData = process.env.APPDATA || path.join(home, "AppData", "Roaming");
    return path.join(appData, "DevExpress", LICENSE_FILE);
  }

  if (process.platform === "darwin") {
    return path.join(
      home,
      "Library",
      "Application Support",
      "DevExpress",
      LICENSE_FILE
    );
  }

  return path.join(home, ".config", "DevExpress", LICENSE_FILE);
}

function resolveFromLicensePathEnv(licensePathValue) {
  if (!isNonEmptyString(licensePathValue)) return null;

  const p = licensePathValue.trim();

  try {
    if (fs.existsSync(p)) {
      const stat = fs.statSync(p);
      if (stat.isFile()) return p;
      if (stat.isDirectory()) return path.join(p, LICENSE_FILE);
    }
  } catch {}

  if (p.toLowerCase().endsWith(".txt")) return p;
  return path.join(p, LICENSE_FILE);
}

function getDevExpressLCXKey() {
  // 1) env DevExpress_License
  const envKey = normalizeKey(process.env[LICENSE_ENV]);
  if (envKey) return { key: envKey, source: `env:${LICENSE_ENV}` };

  // 2) env DevExpress_LicensePath
  const licensePath = resolveFromLicensePathEnv(process.env[LICENSE_PATH_ENV]);
  const fromCustom = normalizeKey(readTextFileIfExists(licensePath));
  if (fromCustom) return { key: fromCustom, source: `file:${licensePath}` };

  // 3) default OS location
  const defaultPath = getDefaultLicenseFilePath();
  const fromDefault = normalizeKey(readTextFileIfExists(defaultPath));
  if (fromDefault) return { key: fromDefault, source: `file:${defaultPath}` };

  return { key: null, source: null };
}

module.exports = {
  getDevExpressLCXKey,
};