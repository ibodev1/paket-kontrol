#!/usr/bin/env node
import meow from "meow";
import chalk from "chalk";
import updateNotifier from "update-notifier";
import semver from "semver";
//@ts-ignore
import packageJson from "../package.json" assert { type: "json" };
import {
  getDependenciesPackages,
  updateDependenciesPackages
} from "./helpers/dependencies.js";

const notifier = updateNotifier({ pkg: packageJson, updateCheckInterval: 0 });
const updatePackages: { [key: string]: string }[] = [];
const cli = meow("", {
  importMeta: import.meta,
  help: undefined,
  flags: {
    update: {
      type: "boolean",
      alias: "u"
    },
    dev: {
      type: "boolean",
      alias: "d"
    },
    peer: {
      type: "boolean",
      alias: "p"
    }
  }
});

const packageTemplate = (packageJson: any) => {
  return `\n    ${chalk.yellow(packageJson.name)}: "${chalk.red(
    packageJson.currentVersion
  )}" ==> "${chalk.green(packageJson.latestVersion)}"`;
};

const updatedPackageTemplate = (packageJson: any) => {
  return `\n    ${chalk.yellow(packageJson.name)}: "${chalk.green(
    packageJson.latestVersion
  )}"`;
};

const sendNeedUpdateMessage = (dependenciesName: string = "dependencies") => {
  const updatesPackageTemplate = `
  ${chalk.red("----------------------------------------")}
  Güncellenecek paketler; [${chalk.yellow(dependenciesName)}]
  ${updatePackages.map(packageTemplate).join("")}
      
  Güncellemek için : ${chalk.green("npx paket-kontrol -u")}
  ${chalk.red("----------------------------------------")}`;
  // console.clear();
  console.log(updatesPackageTemplate);
};

const sendUpdatedMessage = (dependenciesName: string = "dependencies") => {
  const updatesPackageTemplate = `
    ${chalk.red("----------------------------------------")}
    Güncellenen paketler; [${chalk.yellow(dependenciesName)}]
    ${updatePackages.map(updatedPackageTemplate).join("")}
        
    Güncellenen paketleri indirmek için : ${chalk.red(
      "npm install"
    )} yada ${chalk.red("yarn install")}
    ${chalk.red("----------------------------------------")}`;
  // console.clear();
  console.log(updatesPackageTemplate);
};

(async () => {
  try {
    if (notifier.update && notifier.update.latest !== packageJson.version) {
      const currentMajor = semver.parse(notifier.update.current)?.major;
      const latestMajor = semver.parse(notifier.update.latest)?.major;
      const majorVersions =
        currentMajor && latestMajor && latestMajor >= currentMajor
          ? new Array(latestMajor - currentMajor)
              .fill(0)
              .map((x, i) => currentMajor + i + 1)
          : [];
      const releaseUrls = majorVersions.map(
        (majorVersion) =>
          `${packageJson.homepage ?? ""}/releases/tag/v${majorVersion}.0.0`
      );
      const compareUrl = `${packageJson.homepage ?? ""}/compare/v${
        notifier.update.current
      }...v${notifier.update.latest}`;
      notifier.notify({
        defer: false,
        isGlobal: true,
        message: `Update available ${chalk.dim(
          "{currentVersion}"
        )}${chalk.reset(" → ")}${
          notifier.update.type === "major"
            ? chalk.red("{latestVersion}")
            : notifier.update.type === "minor"
            ? chalk.yellow("{latestVersion}")
            : chalk.green("{latestVersion}")
        }
Run ${chalk.cyan("{updateCommand}")} to update
${chalk.dim.underline(
  notifier.update.type === "major"
    ? releaseUrls.map((url) => chalk.dim.underline(url)).join("\n")
    : compareUrl
)}`
      });
    } else {
      if (cli.flags.dev) {
        if (cli.flags.update) {
          await getDependenciesPackages("devDependencies", updatePackages);
          await updateDependenciesPackages("devDependencies", updatePackages);
          sendUpdatedMessage("devDependencies");
        } else {
          await getDependenciesPackages("devDependencies", updatePackages);
          sendNeedUpdateMessage("devDependencies");
        }
      } else if (cli.flags.peer) {
        if (cli.flags.update) {
          await getDependenciesPackages("peerDependencies", updatePackages);
          await updateDependenciesPackages("peerDependencies", updatePackages);
          sendUpdatedMessage("peerDependencies");
        } else {
          await getDependenciesPackages("peerDependencies", updatePackages);
          sendNeedUpdateMessage("peerDependencies");
        }
      } else {
        if (cli.flags.update) {
          await getDependenciesPackages("dependencies", updatePackages);
          await updateDependenciesPackages("dependencies", updatePackages);
          sendUpdatedMessage("dependencies");
        } else {
          await getDependenciesPackages("dependencies", updatePackages);
          sendNeedUpdateMessage("dependencies");
        }
      }
    }
  } catch (error: any) {
    if (error.path) {
      console.error(
        chalk.red(error.path) +
          "\nBelirtilen yolda package.json dosyasını bulamadık."
      );
    } else {
      console.error(chalk.red(error));
    }
  }
})();
