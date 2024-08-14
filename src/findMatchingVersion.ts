import axios from 'axios'
import { gte, minVersion } from 'semver'
import { notifyError, notifyInfo, notifyWarn } from './toast'

/**
 * Asynchronously retrieves the first version of the specified package that satisfies
 * the minimum required version for a specified sub-dependency using the npmjs API.
 *
 * @param upperPackage - The name of the package to check.
 * @param startingVersion - The version to start searching from.
 * @param subDependency - The sub-dependency to find in the package.
 * @param targetSubDepVersion - The minimum required version of the sub-dependency.
 */
export async function findMatchingVersion(
  upperPackage: string,
  startingVersion: string,
  subDependency: string,
  targetSubDepVersion: string,
): Promise<void> {
  notifyInfo(`Initiating search for ${upperPackage}...`)

  try {
    const { data: { versions } } = await axios.get(`https://registry.npmjs.org/${upperPackage}`)

    const allVersions = Object.keys(versions)
      .filter(version => gte(version, startingVersion) && /^\d+\.\d+\.\d+$/.test(version))
      .sort((a, b) => (a < b ? -1 : 1))

    if (allVersions.length === 0) {
      notifyWarn('No versions found matching the starting version criteria.')
      return
    }

    notifyInfo(`Total relevant versions found for ${upperPackage}: ${allVersions.length}`)

    for (const version of allVersions) {
      notifyInfo(`Checking ${upperPackage}@${version}...`)
      const currentVersion = versions[version]
      const dependencies = currentVersion.dependencies || {}

      if (dependencies[subDependency]) {
        const currentSubDepVersionRange = dependencies[subDependency]
        const actualSubDepVersion = minVersion(currentSubDepVersionRange)

        if (actualSubDepVersion && gte(actualSubDepVersion, targetSubDepVersion)) {
          notifyInfo(`Match found: ${upperPackage}@${version} includes ${subDependency} version ${actualSubDepVersion} satisfying the minimum requirement of ${targetSubDepVersion}.`)
          return
        }
      }
    }

    notifyInfo('No matching version found for the specified criteria.')
  }
  catch (error) {
    notifyError('Error occurred while searching:', error)
  }
}
