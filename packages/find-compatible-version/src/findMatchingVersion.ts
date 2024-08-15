import axios from 'axios'
import { gte, minVersion, rcompare, valid } from 'semver'
import { notifyError, notifyInfo, notifyWarn } from './toast'

/**
 * Asynchronously retrieves the earliest compatible version of the specified package that satisfies
 * the minimum required version for a given sub-dependency using the npm registry API.
 *
 * @param upperPackage - The name of the package to check.
 * @param startingVersion - The version to begin the search from.
 * @param subDependency - The specific sub-dependency to locate within the package.
 * @param targetSubDepVersion - The minimum required version of the sub-dependency.
 */
export async function findMatchingVersion(
  upperPackage: string,
  startingVersion: string,
  subDependency: string,
  targetSubDepVersion: string,
): Promise<void> {
  notifyInfo(`Initiating search for package: ${upperPackage}...`)

  try {
    const { data } = await axios.get(`https://registry.npmjs.org/${upperPackage}`)
    const versions = data.versions

    // Filter and sort versions that are valid and greater than or equal to the starting version
    const filteredVersions = Object.keys(versions)
      .filter(version => valid(version) && gte(version, startingVersion))
      .sort(rcompare) // Using rcompare for descending order

    if (filteredVersions.length === 0) {
      notifyWarn(`No versions found for ${upperPackage} matching the specified starting version criteria.`)
      return
    }

    notifyInfo(`Found ${filteredVersions.length} relevant versions for ${upperPackage}.`)

    for (const version of filteredVersions) {
      const dependencies = versions[version].dependencies || {}

      // Check if the sub-dependency exists in the current version's dependencies
      if (subDependency in dependencies) {
        const subDepVersionRange = dependencies[subDependency]
        const resolvedSubDepVersion = minVersion(subDepVersionRange)

        if (resolvedSubDepVersion && gte(resolvedSubDepVersion, targetSubDepVersion)) {
          notifyInfo(`Compatible version found: ${upperPackage}@${version} includes ${subDependency} version ${resolvedSubDepVersion}, satisfying the minimum requirement of ${targetSubDepVersion}.`)
          return // Return when a suitable version is found
        }
      }

      notifyInfo(`Checked ${upperPackage}@${version}; no match found for sub-dependency: ${subDependency}.`)
    }

    notifyInfo(`No suitable version of ${upperPackage} meets the specified criteria.`)
  }
  catch (error) {
    handleError(error, upperPackage)
  }
}

/**
 * Handles errors encountered during the retrieval process.
 *
 * @param error - The error object received from the failed request.
 * @param packageName - The name of the package that was being searched.
 */
function handleError(error: any, packageName: string): void {
  if (axios.isAxiosError(error)) {
    notifyError(`Network error encountered while searching for ${packageName}: ${error.response?.status} - ${error.message}`)
  }
  else {
    notifyError(`Unexpected error encountered while searching for ${packageName}: ${error.message}`)
  }
}
