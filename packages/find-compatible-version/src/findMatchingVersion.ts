import axios from 'axios';
import { gte, minVersion } from 'semver';
import { notifyError, notifyInfo, notifyWarn } from './toast';

/**
 * Asynchronously retrieves the earliest version of the specified package that meets
 * the minimum required version for a given sub-dependency using the npmjs API.
 *
 * @param upperPackage - The name of the package to check.
 * @param startingVersion - The version to start the search from.
 * @param subDependency - The sub-dependency to locate within the package.
 * @param targetSubDepVersion - The minimum required version of the sub-dependency.
 */
export async function findMatchingVersion(
  upperPackage: string,
  startingVersion: string,
  subDependency: string,
  targetSubDepVersion: string,
): Promise<void> {
  notifyInfo(`Starting search for package: ${upperPackage}...`);

  try {
    const { data: { versions } } = await axios.get(`https://registry.npmjs.org/${upperPackage}`);
    
    const filteredVersions = Object.keys(versions)
      .filter(version => gte(version, startingVersion) && /^\d+\.\d+\.\d+$/.test(version))
      .sort();

    if (filteredVersions.length === 0) {
      notifyWarn(`No versions found for ${upperPackage} matching the starting version criteria.`);
      return;
    }

    notifyInfo(`Number of relevant versions found for ${upperPackage}: ${filteredVersions.length}.`);

    for (const version of filteredVersions) {
      const { dependencies = {} } = versions[version];

      if (subDependency in dependencies) {
        const subDepVersionRange = dependencies[subDependency];
        const resolvedSubDepVersion = minVersion(subDepVersionRange);

        if (resolvedSubDepVersion && gte(resolvedSubDepVersion, targetSubDepVersion)) {
          notifyInfo(`Match found: ${upperPackage}@${version} includes ${subDependency} version ${resolvedSubDepVersion} satisfying the minimum required version of ${targetSubDepVersion}.`);
          return;
        }
      }

      notifyInfo(`Checked ${upperPackage}@${version}, no match found for sub-dependency: ${subDependency}.`);
    }

    notifyInfo(`No suitable version of ${upperPackage} that meets the specified criteria was found.`);
  } catch (error) {
    notifyError(`An error occurred while searching for ${upperPackage}: ${error}`);
  }
}