import debug from "debug";
import definition from "./helpers/definition.js";
import steps from "./helpers/steps.js";
import err from "./helpers/err.js";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";
// Host a copy of the definition file parsed using yaml's module
let def = null;

/**
 * Initialize
 *
 * @param {Object} program Commander's original object
 */
const init = async (program) => {
  let error;
  let exitCode = 0;
  let output = {};
  // File path specified from the cli
  if (program.file) {
    def = await definition.loadFile(program.file);
  } else if (program.string) {
    // YAML string
    def = await definition.loadString(program.string);
  } else if (program.yaml || program.json) {
    // YAML/JSON
    def = program.yaml || program.json;
  } else {
    // No definition
    err.fatal("No definition specified");
  }

  await definition.validate(def);

  const browserOpts = definition.cfg(def, "main", "browser") || {};

  let options = {
    args: ["--no-sandbox"],
    width: browserOpts.width || 1200,
    height: browserOpts.height || 800,
    scaleFactor: browserOpts.scaleFactor || 1,
    timeout: browserOpts.timeout || 30 * 1000,
    delay: browserOpts.delay || 0,
    headless: browserOpts.headless !== false,
  };

  let puppeteerPackage;
  if (browserOpts.executablePath) {
    puppeteerPackage = puppeteerCore;
    options.executablePath = browserOpts.executablePath;
    options.userDataDir = browserOpts.userDataDir;
  } else {
    puppeteerPackage = puppeteer;
  }

  debug(`Puppeteer options ${JSON.stringify(options)}`);

  const browser = await puppeteerPackage.launch(options);
  debug("Browser launched");

  const page = await browser.newPage();
  debug("New page created");

  const defaultSteps = definition.cfg(def, "main", "steps");
  debug("Get definition steps");
  try {
    const runSteps = async (allSteps) => {
      for (const singleStep of allSteps) {
        if(singleStep !== undefined){
          if (singleStep.run) {
            const subSteps = definition.cfg(def, singleStep.run, "steps");
            await runSteps(subSteps);
          }
          let stepResult = await steps.exec(program.flags, singleStep, page);
          output = Object.assign({}, output, stepResult.result || {});
        }
      }
    };
    await runSteps(defaultSteps);
  } catch (ex) {
    console.log(`ex1`, ex)
    error = ex;
    exitCode = 5;
  } finally {
    // Always gracefully close the browser
    if (!browserOpts.keepOpen) await browser.close();
  }

  if (exitCode) {
    err.fatal(error);
  }

  if (program.cli) {
    console.log(JSON.stringify(output, " ", 2));
  } else {
    return output;
  }
};

export default init;
