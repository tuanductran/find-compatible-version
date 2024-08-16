import axios from 'axios'
import { gte, minVersion, rcompare, valid } from 'semver'
import { notifyError, notifySuccess, notifyWarn } from './toast'
import { isEmpty } from './isEmpty'

interface VersionData {
  versions: Record<string, {
    dependencies?: Record<string, string>
  }>
}

/**
 * Asynchronously retrieves the latest compatible version of the specified package that satisfies
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
  try {
    const { data } = await axios.get<VersionData>(`https://registry.npmjs.org/${upperPackage}`)
    const versions = data.versions || {}

    if (isEmpty(versions)) {
      notifyWarn(`No versions found for ${upperPackage}.`)
      return
    }

    // Filter and sort valid versions.
    const validVersions = Object.keys(versions)
      .filter(version => valid(version) && gte(version, startingVersion))
      .sort(rcompare)

    if (isEmpty(validVersions)) {
      notifyWarn(`No valid versions for ${upperPackage}.`)
      return
    }

    notifySuccess(`Found ${validVersions.length} valid versions of ${upperPackage}.`)

    // Iterate over sorted versions to find a matching one.
    for (const version of validVersions) {
      const dependencies = versions[version]?.dependencies || {}

      // Check if the sub-dependency exists in the package's dependencies.
      if (subDependency in dependencies) {
        const subDepVersionRange = dependencies[subDependency]

        if (subDepVersionRange) {
          const resolvedSubDepVersion = minVersion(subDepVersionRange)
          if (resolvedSubDepVersion && gte(resolvedSubDepVersion, targetSubDepVersion)) {
            notifySuccess(`Compatible version: ${upperPackage}@${version} with ${subDependency} resolved to ${resolvedSubDepVersion}.`)
            return
          }

          notifyWarn(`${upperPackage}@${version} has ${subDependency} resolved to ${resolvedSubDepVersion}, not meeting ${targetSubDepVersion}.`)
        }
        else {
          notifyWarn(`Failed to resolve ${subDependency} version for ${upperPackage}@${version}.`)
        }
      }
      else {
        notifyWarn(`${subDependency} missing in ${upperPackage}@${version}.`)
      }
    }

    notifyWarn(`No compatible version found for ${upperPackage} with required sub-dependencies.`)
  }
  catch (error) {
    handleError(error, upperPackage)
  }
}

/**
 * Handles potential errors that may occur during data fetching.
 *
 * @param error - The error encountered during data fetching.
 * @param packageName - The name of the package being searched.
 */
function handleError(error: unknown, packageName: string): void {
  const errorMessage = axios.isAxiosError(error)
    ? `Error fetching ${packageName}: ${error.response?.status} ${error.response?.statusText}. ${error.message}`
    : `Error: ${(error as Error).message || 'An unknown error occurred.'}`

  notifyError(errorMessage)
}
