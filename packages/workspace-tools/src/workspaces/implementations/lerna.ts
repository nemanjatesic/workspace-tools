import fs from "fs";
import jju from "jju";
import path from "path";
import { getPackagePaths } from "../../getPackagePaths";
import { searchUp } from "../../paths";
import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import { getWorkspacePackageInfo } from "../getWorkspacePackageInfo";
import { logVerboseWarning } from "../../logging";

export function getLernaWorkspaceRoot(cwd: string): string {
  const lernaJsonPath = searchUp("lerna.json", cwd);

  if (!lernaJsonPath) {
    throw new Error("Could not find lerna workspace root");
  }

  return path.dirname(lernaJsonPath);
}

/**
 * Get an array with names, paths, and package.json contents for each package in a lerna workspace.
 * (See `../getWorkspaces` for why it's named this way.)
 */
export function getLernaWorkspaces(cwd: string): WorkspaceInfo {
  try {
    const lernaWorkspaceRoot = getLernaWorkspaceRoot(cwd);
    const lernaJsonPath = path.join(lernaWorkspaceRoot, "lerna.json");

    const lernaConfig = jju.parse(fs.readFileSync(lernaJsonPath, "utf-8"));

    const packagePaths = getPackagePaths(lernaWorkspaceRoot, lernaConfig.packages);
    const workspaceInfo = getWorkspacePackageInfo(packagePaths);
    return workspaceInfo;
  } catch (err) {
    logVerboseWarning(`Error getting lerna workspaces for ${cwd}`, err);
    return [];
  }
}

export { getLernaWorkspaceRoot as getWorkspaceRoot };
export { getLernaWorkspaces as getWorkspaces };
