// Copyright 2021-2023 The Connect Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { readFile, glob } from "node:fs/promises";

/**
 * Retrieves the workspace version from the package directory.
 *
 * @param {string} packagesDir
 * @returns {string}
 */
export async function findWorkspaceVersion(packagesDir) {
    let version = undefined;
    for await (const path of glob(packagesDir + '/**/package.json')) {
        const pkg = JSON.parse(await readFile(path, "utf-8"));
        if (pkg.private === true) {
            continue;
        }
        if (!pkg.version) {
            throw new Error(`${path} is missing "version"`);
        }
        if (version === undefined) {
            version = pkg.version;
        } else if (version !== pkg.version) {
            throw new Error(`${path} has unexpected version ${pkg.version}`);
        }

    }
    if (version === undefined) {
      throw new Error(`unable to find workspace version`);
    }
    return version;
  }

process.stdout.write(`${await findWorkspaceVersion("./")}\n`);
