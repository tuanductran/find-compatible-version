import axios from 'axios'
import { gte, minVersion } from 'semver'

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
  console.log(`Initiating search for ${upperPackage}...`)

  try {
    // Fetch all versions of the upper package using the npm registry API
    const { data: { versions } } = await axios.get(`https://registry.npmjs.org/${upperPackage}`)

    // Filter and sort valid versions
    const allVersions = Object.keys(versions)
      .filter(version => gte(version, startingVersion) && /^\d+\.\d+\.\d+$/.test(version))
      .sort((a, b) => (a < b ? -1 : 1)) // Ensure versions are sorted in ascending order

    if (allVersions.length === 0) {
      console.warn('No versions found matching the starting version criteria.')
      return
    }

    console.log(`Total relevant versions found for ${upperPackage}: ${allVersions.length}`)

    // Iterate through versions to find a matching sub-dependency
    for (const version of allVersions) {
      console.log(`Checking ${upperPackage}@${version}...`)
      const currentVersion = versions[version]
      const dependencies = currentVersion.dependencies || {}

      // If the sub-dependency exists, validate its version
      if (dependencies[subDependency]) {
        const currentSubDepVersionRange = dependencies[subDependency]
        const actualSubDepVersion = minVersion(currentSubDepVersionRange)

        if (actualSubDepVersion && gte(actualSubDepVersion, targetSubDepVersion)) {
          console.log(`Match found: ${upperPackage}@${version} includes ${subDependency} version ${actualSubDepVersion} satisfying the minimum requirement of ${targetSubDepVersion}.`)
          return // Return after the first match is found
        }
      }
    }

    console.info('No matching version found for the specified criteria.')
  }
  catch (error) {
    console.error('Error occurred while searching:', error)
  }
}

// Handling command-line arguments for invocation
const [,, currentPackageVersion, targetSubDep] = process.argv

if (!currentPackageVersion || !targetSubDep) {
  console.error('Missing required arguments. Provide the current package version and the target sub-dependency version.')
  console.log('Usage: findMatchingVersion(\'current-package@starting-version\', \'sub-dependency@target-version\')')
  process.exit(1)
}

const [upperPackage, startingVersion] = currentPackageVersion.split('@')
const [subDependency, targetSubDepVersion] = targetSubDep.split('@')

// Validate input formats to protect against injection attacks
if (upperPackage && startingVersion && subDependency && targetSubDepVersion) {
  findMatchingVersion(upperPackage, startingVersion, subDependency, targetSubDepVersion)
    .catch(console.error)
}
else {
  console.error('Invalid input parameters. Ensure inputs are formatted correctly.')
  process.exit(1)
}
