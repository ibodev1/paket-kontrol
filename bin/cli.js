#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import meow from "meow";
import chalk from "chalk";
import updateNotifier from "update-notifier";
import semver from "semver";
//@ts-ignore
import packageJson from "../package.json" assert { type: "json" };
import { getDependenciesPackages, updateDependenciesPackages } from "./helpers/dependencies.js";
var notifier = updateNotifier({ pkg: packageJson, updateCheckInterval: 0 });
var updatePackages = [];
var cli = meow("", {
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
var packageTemplate = function (packageJson) {
    return "\n    ".concat(chalk.yellow(packageJson.name), ": \"").concat(chalk.red(packageJson.currentVersion), "\" ==> \"").concat(chalk.green(packageJson.latestVersion), "\"");
};
var updatedPackageTemplate = function (packageJson) {
    return "\n    ".concat(chalk.yellow(packageJson.name), ": \"").concat(chalk.green(packageJson.latestVersion), "\"");
};
var sendNeedUpdateMessage = function (dependenciesName) {
    if (dependenciesName === void 0) { dependenciesName = "dependencies"; }
    var updatesPackageTemplate = "\n  ".concat(chalk.red("----------------------------------------"), "\n  G\u00FCncellenecek paketler; [").concat(chalk.yellow(dependenciesName), "]\n  ").concat(updatePackages.map(packageTemplate).join(""), "\n      \n  G\u00FCncellemek i\u00E7in : ").concat(chalk.green("npx paket-kontrol -u"), "\n  ").concat(chalk.red("----------------------------------------"));
    // console.clear();
    console.log(updatesPackageTemplate);
};
var sendUpdatedMessage = function (dependenciesName) {
    if (dependenciesName === void 0) { dependenciesName = "dependencies"; }
    var updatesPackageTemplate = "\n    ".concat(chalk.red("----------------------------------------"), "\n    G\u00FCncellenen paketler; [").concat(chalk.yellow(dependenciesName), "]\n    ").concat(updatePackages.map(updatedPackageTemplate).join(""), "\n        \n    G\u00FCncellenen paketleri indirmek i\u00E7in : ").concat(chalk.red("npm install"), " yada ").concat(chalk.red("yarn install"), "\n    ").concat(chalk.red("----------------------------------------"));
    // console.clear();
    console.log(updatesPackageTemplate);
};
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var currentMajor_1, latestMajor, majorVersions, releaseUrls, compareUrl, error_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 19, , 20]);
                if (!(notifier.update && notifier.update.latest !== packageJson.version)) return [3 /*break*/, 1];
                currentMajor_1 = (_a = semver.parse(notifier.update.current)) === null || _a === void 0 ? void 0 : _a.major;
                latestMajor = (_b = semver.parse(notifier.update.latest)) === null || _b === void 0 ? void 0 : _b.major;
                majorVersions = currentMajor_1 && latestMajor && latestMajor >= currentMajor_1
                    ? new Array(latestMajor - currentMajor_1)
                        .fill(0)
                        .map(function (x, i) { return currentMajor_1 + i + 1; })
                    : [];
                releaseUrls = majorVersions.map(function (majorVersion) { var _a; return "".concat((_a = packageJson.homepage) !== null && _a !== void 0 ? _a : "", "/releases/tag/v").concat(majorVersion, ".0.0"); });
                compareUrl = "".concat((_c = packageJson.homepage) !== null && _c !== void 0 ? _c : "", "/compare/v").concat(notifier.update.current, "...v").concat(notifier.update.latest);
                notifier.notify({
                    defer: false,
                    isGlobal: true,
                    message: "Update available ".concat(chalk.dim("{currentVersion}")).concat(chalk.reset(" → ")).concat(notifier.update.type === "major"
                        ? chalk.red("{latestVersion}")
                        : notifier.update.type === "minor"
                            ? chalk.yellow("{latestVersion}")
                            : chalk.green("{latestVersion}"), "\nRun ").concat(chalk.cyan("{updateCommand}"), " to update\n").concat(chalk.dim.underline(notifier.update.type === "major"
                        ? releaseUrls.map(function (url) { return chalk.dim.underline(url); }).join("\n")
                        : compareUrl))
                });
                return [3 /*break*/, 18];
            case 1:
                if (!cli.flags.dev) return [3 /*break*/, 7];
                if (!cli.flags.update) return [3 /*break*/, 4];
                return [4 /*yield*/, getDependenciesPackages("devDependencies", updatePackages)];
            case 2:
                _d.sent();
                return [4 /*yield*/, updateDependenciesPackages("devDependencies", updatePackages)];
            case 3:
                _d.sent();
                sendUpdatedMessage("devDependencies");
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, getDependenciesPackages("devDependencies", updatePackages)];
            case 5:
                _d.sent();
                sendNeedUpdateMessage("devDependencies");
                _d.label = 6;
            case 6: return [3 /*break*/, 18];
            case 7:
                if (!cli.flags.peer) return [3 /*break*/, 13];
                if (!cli.flags.update) return [3 /*break*/, 10];
                return [4 /*yield*/, getDependenciesPackages("peerDependencies", updatePackages)];
            case 8:
                _d.sent();
                return [4 /*yield*/, updateDependenciesPackages("peerDependencies", updatePackages)];
            case 9:
                _d.sent();
                sendUpdatedMessage("peerDependencies");
                return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, getDependenciesPackages("peerDependencies", updatePackages)];
            case 11:
                _d.sent();
                sendNeedUpdateMessage("peerDependencies");
                _d.label = 12;
            case 12: return [3 /*break*/, 18];
            case 13:
                if (!cli.flags.update) return [3 /*break*/, 16];
                return [4 /*yield*/, getDependenciesPackages("dependencies", updatePackages)];
            case 14:
                _d.sent();
                return [4 /*yield*/, updateDependenciesPackages("dependencies", updatePackages)];
            case 15:
                _d.sent();
                sendUpdatedMessage("dependencies");
                return [3 /*break*/, 18];
            case 16: return [4 /*yield*/, getDependenciesPackages("dependencies", updatePackages)];
            case 17:
                _d.sent();
                sendNeedUpdateMessage("dependencies");
                _d.label = 18;
            case 18: return [3 /*break*/, 20];
            case 19:
                error_1 = _d.sent();
                if (error_1.path) {
                    console.error(chalk.red(error_1.path) +
                        "\nBelirtilen yolda package.json dosyasını bulamadık.");
                }
                else {
                    console.error(chalk.red(error_1));
                }
                return [3 /*break*/, 20];
            case 20: return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=cli.js.map