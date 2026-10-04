const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);

jest.setTimeout(18000);

function failedTestCount(output) {
  const match = output.match(/Tests:\s+(\d+)\s+failed/);
  return match ? Number(match[1]) : 0;
}

async function runStudentTests(fileName) {
  try {
    const { stdout, stderr } = await exec(`npm test ${fileName}`, {
      encoding: "utf-8",
      timeout: 15000,
      detached: true,
    });
    return `${stdout || ""}\n${stderr || ""}`;
  } catch (error) {
    console.log("\x1B[34m student's tests");
    console.log(error.stderr);
    console.info("\x1B[34m end of student's tests");
    return `${error.stdout || ""}\n${error.stderr || ""}`;
  }
}

describe("Check students' tests", () => {
  it("App test finds at least 2 errors", async () => {
    const result = await runStudentTests("App.test.js");
    expect(failedTestCount(result)).toBeGreaterThanOrEqual(2);
  });

  it("Calculations test finds at least 2 errors", async () => {
    const result = await runStudentTests("Calculations.test.js");
    expect(failedTestCount(result)).toBeGreaterThanOrEqual(2);
  });

  it("ButtonGroup test finds an error", async () => {
    const result = await runStudentTests("ButtonGroup.test.js");
    expect(failedTestCount(result)).toBeGreaterThanOrEqual(1);
  });
});
