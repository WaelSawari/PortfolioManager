/**
 * Applies all Prisma migration SQL files directly to Turso via @libsql/client.
 * Use this instead of `prisma migrate deploy` since Prisma CLI can't speak libsql://.
 */
const { createClient } = require("@libsql/client");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });

function parseStatements(sql) {
  // Split on semicolons, keep comments attached to their statement, drop empties
  return sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const migrationsDir = path.join(__dirname, "migrations");
  const migrationDirs = fs
    .readdirSync(migrationsDir)
    .filter((d) => fs.statSync(path.join(migrationsDir, d)).isDirectory())
    .sort();

  for (const dir of migrationDirs) {
    const sqlFile = path.join(migrationsDir, dir, "migration.sql");
    if (!fs.existsSync(sqlFile)) continue;

    const sql = fs.readFileSync(sqlFile, "utf-8");
    const statements = parseStatements(sql);

    console.log(`\n📦 Applying: ${dir} (${statements.length} statements)`);

    for (const stmt of statements) {
      try {
        await client.execute(stmt);
        const preview = stmt.replace(/\s+/g, " ").substring(0, 70);
        console.log(`  ✓ ${preview}...`);
      } catch (e) {
        if (e.message && e.message.includes("already exists")) {
          console.log(`  ⚠️  Skipped (table/index already exists)`);
        } else {
          console.error(`\n  ✗ Error: ${e.message}`);
          console.error(`    Statement: ${stmt.substring(0, 120)}`);
          throw e;
        }
      }
    }
    console.log(`  ✅ Done: ${dir}`);
  }

  console.log("\n🎉 All migrations applied to Turso!");
  client.close();
}

main().catch((e) => {
  console.error("❌ Migration failed:", e.message);
  process.exit(1);
});
