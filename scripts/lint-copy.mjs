import { execSync } from "child_process";
import { exit } from "process";

let result = "";
try {
  result = execSync(
    'grep -rn "\\u2013\\|\\u2014" src/app src/components src/data src/lib --include="*.tsx" --include="*.ts"',
    { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], cwd: process.cwd() }
  ).trim();
} catch (e) {
  // grep exits 1 when no matches — that's the success case
  if (e.status === 1) {
    console.log("No em/en dashes found.");
    exit(0);
  }
  // Real error
  console.error(e.message);
  exit(2);
}

if (result) {
  console.error("Em/en dashes found in source files:\n" + result);
  exit(1);
}

console.log("No em/en dashes found.");
exit(0);
