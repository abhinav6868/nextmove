import "dotenv/config";
import { runCompanyPipeline } from "../lib/pipeline";

async function main() {
  console.log("--- Starting Milestone 1 Pipeline Test ---");
  const testUrl = "https://hasura.io";
  const testName = "Hasura";

  console.log(`Ingesting real company: ${testName} (${testUrl})`);
  const result = await runCompanyPipeline(testUrl, testName);

  console.log("\nPipeline Execution Result:");
  console.log("Success:", result.success);
  console.log("Company ID:", result.companyId);
  console.log("Run ID:", result.runId);
  console.log("Calculated Total Score:", result.totalScore);
  console.log("Signals Created:", result.signalsCount);
  console.log("\nStep Logs:");
  for (const log of result.logs) {
    console.log(`  [${log.step}] ${log.status} (${log.duration_ms ? log.duration_ms + "ms" : "started"}) - ${log.details || ""}`);
  }

  process.exit(result.success ? 0 : 1);
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
