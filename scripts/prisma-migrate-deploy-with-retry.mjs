import { spawn } from "node:child_process";

const maxAttempts = Number(process.env.PRISMA_MIGRATE_MAX_ATTEMPTS || 5);
const baseDelayMs = Number(process.env.PRISMA_MIGRATE_RETRY_DELAY_MS || 5000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runMigrateDeploy = () =>
  new Promise((resolve) => {
    const child = spawn("npx", ["prisma", "migrate", "deploy"], {
      stdio: "inherit",
      shell: process.platform === "win32",
      env: process.env,
    });

    child.on("exit", (code) => {
      resolve(code ?? 1);
    });

    child.on("error", () => {
      resolve(1);
    });
  });

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  console.log(`[prisma-migrate] Attempt ${attempt}/${maxAttempts}`);

  const exitCode = await runMigrateDeploy();
  if (exitCode === 0) {
    console.log("[prisma-migrate] Migration deploy succeeded.");
    process.exit(0);
  }

  if (attempt < maxAttempts) {
    const delay = baseDelayMs * attempt;
    console.warn(
      `[prisma-migrate] Failed with exit code ${exitCode}. Retrying in ${delay}ms...`
    );
    await sleep(delay);
  }
}

console.error(
  `[prisma-migrate] Migration deploy failed after ${maxAttempts} attempts.`
);
process.exit(1);