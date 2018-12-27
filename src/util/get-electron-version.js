import debug from 'debug';
import fs from 'fs-extra';
import path from 'path';
import readPackageJSON from './read-package-json';

const d = debug('electron-forge:util');

export default async (projectDir) => {
  let result = null;

  const baseModulesDir = path.join(projectDir, 'node_modules');
  if (!await fs.pathExists(baseModulesDir)) {
    throw new Error("Could not find the node_modules folder. Please run 'npm install' and try again.");
  }

  const modulesToExamine = ['electron-prebuilt-compile', 'electron', 'electron-prebuilt'];
  for (const moduleName of modulesToExamine) {
    const moduleDir = path.join(baseModulesDir, moduleName);
    try {
      const packageJSON = await readPackageJSON(moduleDir);
      result = packageJSON.version;
      break;
    } catch (e) {
      d(`Could not read package.json for moduleName=${moduleName}`, e);
    }
  }

  if (!result) {
    d(`getElectronVersion failed to determine Electron version: projectDir=${projectDir}, result=${result}`);
  }

  return result;
};
