import chalk from "chalk";
import * as semver from "semver";
import fetch from "node-fetch";
import { getPackageFile, updatePackageFile } from "./fs.js";
const getDependenciesPackages = async (dependenciesName = "dependencies", updatePackages) => {
    const packageFile = await getPackageFile();
    const dependencies = packageFile[dependenciesName] || {};
    const dependenciesKeys = Object.keys(dependencies) || [];
    if (Array.isArray(dependenciesKeys) && dependenciesKeys.length > 0) {
        for (const dependenciesKey of dependenciesKeys) {
            const packageName = dependenciesKey || "";
            const packageCurrentVersion = semver.minVersion(dependencies[packageName] || "0.0.0")?.version;
            const packageResponse = await fetch("https://registry.npmjs.com/" + packageName + "/latest").then((res) => res.json());
            if (packageResponse === "Not Found") {
                throw new Error(chalk.red(packageName) + " paket bulunamadı!");
            }
            const packageLatestVersion = semver.minVersion(packageResponse?.version || "0.0.0")?.version;
            if (packageCurrentVersion !== undefined &&
                packageLatestVersion !== undefined) {
                if (packageCurrentVersion < packageLatestVersion) {
                    updatePackages.push({
                        name: packageName,
                        currentVersion: packageCurrentVersion,
                        latestVersion: packageLatestVersion
                    });
                }
            }
            else {
                console.log(chalk.red("version bulunamadı!"));
            }
        }
        if (updatePackages.length === 0) {
            throw new Error(chalk.green("Tebrikler! tüm paketleriniz güncel!"));
        }
    }
    else if (dependenciesKeys.length === 0) {
        throw new Error(chalk.yellow("Paket bulunamadı!"));
    }
};
const updateDependenciesPackages = async (dependenciesName = "dependencies", updatePackages) => {
    const newDependencies = {};
    for (const pkg of updatePackages) {
        newDependencies[pkg.name] = pkg.latestVersion;
    }
    const packageFile = await getPackageFile();
    const assignDependencies = Object.assign(packageFile[dependenciesName], newDependencies);
    packageFile[dependenciesName] = assignDependencies;
    await updatePackageFile(packageFile);
};
export { getDependenciesPackages, updateDependenciesPackages };
