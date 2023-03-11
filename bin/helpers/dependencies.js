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
import chalk from "chalk";
import * as semver from "semver";
import fetch from "node-fetch";
import { getPackageFile, updatePackageFile } from "./fs.js";
var getDependenciesPackages = function (dependenciesName, updatePackages) {
    if (dependenciesName === void 0) { dependenciesName = "dependencies"; }
    return __awaiter(void 0, void 0, void 0, function () {
        var packageFile, dependencies, dependenciesKeys, _i, dependenciesKeys_1, dependenciesKey, packageName, packageCurrentVersion, packageResponse, packageLatestVersion;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getPackageFile()];
                case 1:
                    packageFile = _c.sent();
                    dependencies = packageFile[dependenciesName] || {};
                    dependenciesKeys = Object.keys(dependencies) || [];
                    if (!(Array.isArray(dependenciesKeys) && dependenciesKeys.length > 0)) return [3 /*break*/, 6];
                    _i = 0, dependenciesKeys_1 = dependenciesKeys;
                    _c.label = 2;
                case 2:
                    if (!(_i < dependenciesKeys_1.length)) return [3 /*break*/, 5];
                    dependenciesKey = dependenciesKeys_1[_i];
                    packageName = dependenciesKey || "";
                    packageCurrentVersion = (_a = semver.minVersion(dependencies[packageName] || "0.0.0")) === null || _a === void 0 ? void 0 : _a.version;
                    return [4 /*yield*/, fetch("https://registry.npmjs.com/" + packageName + "/latest").then(function (res) { return res.json(); })];
                case 3:
                    packageResponse = _c.sent();
                    if (packageResponse === "Not Found") {
                        throw new Error(chalk.red(packageName) + " paket bulunamadı!");
                    }
                    packageLatestVersion = (_b = semver.minVersion((packageResponse === null || packageResponse === void 0 ? void 0 : packageResponse.version) || "0.0.0")) === null || _b === void 0 ? void 0 : _b.version;
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
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (updatePackages.length === 0) {
                        throw new Error(chalk.green("Tebrikler! tüm paketleriniz güncel!"));
                    }
                    return [3 /*break*/, 7];
                case 6:
                    if (dependenciesKeys.length === 0) {
                        throw new Error(chalk.yellow("Paket bulunamadı!"));
                    }
                    _c.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
};
var updateDependenciesPackages = function (dependenciesName, updatePackages) {
    if (dependenciesName === void 0) { dependenciesName = "dependencies"; }
    return __awaiter(void 0, void 0, void 0, function () {
        var newDependencies, _i, updatePackages_1, pkg, packageFile, assignDependencies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newDependencies = {};
                    for (_i = 0, updatePackages_1 = updatePackages; _i < updatePackages_1.length; _i++) {
                        pkg = updatePackages_1[_i];
                        newDependencies[pkg.name] = pkg.latestVersion;
                    }
                    return [4 /*yield*/, getPackageFile()];
                case 1:
                    packageFile = _a.sent();
                    assignDependencies = Object.assign(packageFile[dependenciesName], newDependencies);
                    packageFile[dependenciesName] = assignDependencies;
                    return [4 /*yield*/, updatePackageFile(packageFile)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
export { getDependenciesPackages, updateDependenciesPackages };
//# sourceMappingURL=dependencies.js.map