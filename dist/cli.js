#!/usr/bin/env node
import meow from "meow";
import chalk from "chalk";
import { getDependenciesPackages, updateDependenciesPackages } from "./helpers/dependencies.js";
const updatePackages = [];
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
const packageTemplate = (pkg) => {
    return `\n    ${chalk.yellow(pkg.name)}: "${chalk.red(pkg.currentVersion)}" ==> "${chalk.green(pkg.latestVersion)}"`;
};
const updatedPackageTemplate = (pkg) => {
    return `\n    ${chalk.yellow(pkg.name)}: "${chalk.green(pkg.latestVersion)}"`;
};
const sendNeedUpdateMessage = (dependenciesName = "dependencies") => {
    const updatesPackageTemplate = `
  ${chalk.red("----------------------------------------")}
  Güncellenecek paketler; [${chalk.yellow(dependenciesName)}]
  ${updatePackages.map(packageTemplate).join("")}
      
  Güncellemek için : ${chalk.green("npx paket-kontrol -u")}
  ${chalk.red("----------------------------------------")}`;
    // console.clear();
    console.log(updatesPackageTemplate);
};
const sendUpdatedMessage = (dependenciesName = "dependencies") => {
    const updatesPackageTemplate = `
    ${chalk.red("----------------------------------------")}
    Güncellenen paketler; [${chalk.yellow(dependenciesName)}]
    ${updatePackages.map(updatedPackageTemplate).join("")}
        
    Güncellenen paketleri indirmek için : ${chalk.red("npm install")} yada ${chalk.red("yarn install")}
    ${chalk.red("----------------------------------------")}`;
    // console.clear();
    console.log(updatesPackageTemplate);
};
(async () => {
    try {
        if (cli.flags.dev) {
            if (cli.flags.update) {
                await getDependenciesPackages("devDependencies", updatePackages);
                await updateDependenciesPackages("devDependencies", updatePackages);
                sendUpdatedMessage("devDependencies");
            }
            else {
                await getDependenciesPackages("devDependencies", updatePackages);
                sendNeedUpdateMessage("devDependencies");
            }
        }
        else if (cli.flags.peer) {
            if (cli.flags.update) {
                await getDependenciesPackages("peerDependencies", updatePackages);
                await updateDependenciesPackages("peerDependencies", updatePackages);
                sendUpdatedMessage("peerDependencies");
            }
            else {
                await getDependenciesPackages("peerDependencies", updatePackages);
                sendNeedUpdateMessage("peerDependencies");
            }
        }
        else {
            if (cli.flags.update) {
                await getDependenciesPackages("dependencies", updatePackages);
                await updateDependenciesPackages("dependencies", updatePackages);
                sendUpdatedMessage("dependencies");
            }
            else {
                await getDependenciesPackages("dependencies", updatePackages);
                sendNeedUpdateMessage("dependencies");
            }
        }
    }
    catch (error) {
        if (error.path) {
            console.error(chalk.red(error.path) +
                "\nBelirtilen yolda package.json dosyasını bulamadık.");
        }
        else {
            console.error(chalk.red(error));
        }
    }
})();
