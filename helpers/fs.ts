import * as fs from "node:fs/promises";
import * as path from "node:path";
import chalk from "chalk";

const getPackageFile = async () => {
  try {
    const readFile =
      (await fs.readFile(
        path.resolve(process.cwd() + "\\package.json"),
        "utf8"
      )) ?? {};
    const packageFile = JSON.parse(readFile) ?? {};
    return packageFile;
  } catch (error: any) {
    if (error.path) {
      console.error(
        chalk.red(error.path) +
          "\nBelirtilen yolda package.json dosyasını bulamadık."
      );
    } else {
      console.error(chalk.red(error));
    }
    throw new Error(error);
  }
};

const updatePackageFile = async (newPackageFile: JSON) => {
  try {
    await fs.writeFile(
      path.resolve(process.cwd() + "\\package.json"),
      JSON.stringify(newPackageFile, null, 2),
      "utf-8"
    );
    return true;
  } catch (error: any) {
    if (error.path) {
      console.error(
        chalk.red(error.path) +
          "\nBelirtilen yolda package.json dosyasını bulamadık."
      );
    } else {
      console.error(chalk.red(error));
    }
    throw new Error(error);
  }
};

export { getPackageFile, updatePackageFile };
