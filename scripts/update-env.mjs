// scripts/update-env.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.resolve(__dirname, "../package.json");
const envPath = path.resolve(__dirname, "../.env");

// Read package.json
const pkj = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

// --- 🧠 Auto-increment patch version ---
let [major, minor, patch] = pkj.version.split(".").map(Number);
patch += 1;
const newVersion = `${major}.${minor}.${patch}`;

// --- 🕒 Generate last updated date ---
const today = new Date().toISOString().split("T")[0];

// --- 🧾 Update package.json ---
pkj.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(pkj, null, 2) + "\n");

// --- 🧩 Read .env and update ---
let env = "";
if (fs.existsSync(envPath)) {
  env = fs.readFileSync(envPath, "utf8");
}

function setEnvVar(content, key, value) {
  const regex = new RegExp(`^${key}=.*$`, "m");
  if (regex.test(content)) {
    return content.replace(regex, `${key}="${value}"`);
  } else {
    return `${content.trim()}\n${key}="${value}"\n`;
  }
}

env = setEnvVar(env, "VITE_VERSION", newVersion);
env = setEnvVar(env, "VITE_LAST_UPDATED", today);

fs.writeFileSync(envPath, env.trim() + "\n");

console.log(`✅ Auto-updated version and .env`);
console.log(`→ VITE_VERSION=${newVersion}`);
console.log(`→ VITE_LAST_UPDATED=${today}`);
