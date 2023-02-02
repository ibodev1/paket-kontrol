#!/usr/bin/env node
import * as path from 'node:path';
import * as fs from 'node:fs';
import meow from 'meow';
import * as semver from 'semver';
import chalk from 'chalk';

const updatePackages = [];
let hasError = false;

const getPackages = async () => {
  try {
    const readFile
      = (await fs.readFileSync(
        path.resolve(process.cwd() + '\\package.json'),
        'utf8',
      )) || '{}';
    const packageFile = JSON.parse(readFile) || {};
    const dependencies = packageFile.dependencies || {};
    const dependenciesKeys = Object.keys(dependencies) || [];
    if (Array.isArray(dependenciesKeys) && dependenciesKeys.length > 0) {
      for (const dependenciesKey of dependenciesKeys) {
        const packageName = dependenciesKey || '';
        const packageCurrentVersion = semver.minVersion(
          dependencies[packageName] || '0.0.0',
        )?.version;
        const packageResponse = await fetch(
          'https://registry.npmjs.com/' + packageName + '/latest',
        ).then(res => res.json());
        if (packageResponse === 'Not Found') {
          console.log(chalk.red(packageName) + ' paket bulunamadı!');
          hasError = true;
        }

        const packageLatestVersion = semver.minVersion(
          packageResponse?.version || '0.0.0',
        )?.version;
        if (packageCurrentVersion < packageLatestVersion) {
          updatePackages.push({
            name: packageName,
            currentVersion: packageCurrentVersion,
            latestVersion: packageLatestVersion,
          });
        }
      }
    }
  } catch (error) {
    hasError = true;
    if (error.path) {
      console.error(
        chalk.red(error.path)
          + '\nBelirtilen yolda package.json dosyasını bulamadık.',
      );
    } else {
      console.error('Error : ' + chalk.red(error));
    }
  }
};

const cli = meow('', {
  importMeta: import.meta,
  help: undefined,
  flags: {
    update: {
      type: 'boolean',
      alias: 'u',
    },
  },
});

function packageTemplate(pkg) {
  return `\n    ${chalk.yellow(pkg.name)}: "${chalk.red(
    pkg.currentVersion,
  )}" ==> "${chalk.green(pkg.latestVersion)}"`;
}

function updatedPackageTemplate(pkg) {
  return `\n    ${chalk.yellow(pkg.name)}: "${chalk.green(pkg.latestVersion)}"`;
}

(async () => {
  try {
    await getPackages();

    if (updatePackages.length > 0 && !hasError) {
      if (cli.flags.update) {
        const newDependencies = {};
        for (const pkg of updatePackages) {
          newDependencies[pkg.name] = pkg.latestVersion;
        }

        const packageFile = JSON.parse(
          await fs.readFileSync(
            path.resolve(process.cwd() + '\\package.json'),
            'utf8',
          ),
        );
        const assignDependencies = Object.assign(
          packageFile.dependencies,
          newDependencies,
        );
        packageFile.dependencies = assignDependencies;
        await fs.writeFileSync(
          path.resolve(process.cwd() + '\\package.json'),
          JSON.stringify(packageFile, null, 2),
          'UTF-8',
        );
        const updatesPackageTemplate = `
    ${chalk.red('----------------------------------------')}
    Güncellenen paketler;
    ${updatePackages.map(updatedPackageTemplate).join('')}
        
    Güncellenen paketleri indirmek için : ${chalk.red(
    'npm install',
  )} yada ${chalk.red('yarn install')}
    ${chalk.red('----------------------------------------')}`;
        console.clear();
        console.log(updatesPackageTemplate);
      } else {
        const updatesPackageTemplate = `
    ${chalk.red('----------------------------------------')}
    Güncellenecek paketler;
    ${updatePackages.map(packageTemplate).join('')}
        
    Güncellemek için : ${chalk.green('npx paket-kontrol -u')}
    ${chalk.red('----------------------------------------')}`;
        console.clear();
        console.log(updatesPackageTemplate);
      }
    } else if (!hasError) {
      console.clear();
      console.log(chalk.green('Tebrikler! tüm paketleriniz güncel!'));
    } else {
      console.error(chalk.red('Bir hata oluştu!'));
    }
  } catch (error) {
    hasError = true;
    if (error.path) {
      console.error(
        chalk.red(error.path)
          + '\nBelirtilen yolda package.json dosyasını bulamadık.',
      );
    } else {
      console.error('Error : ' + chalk.red(error));
    }
  }
})();
