import { promisify } from 'node:util'
import { exec as execCallback } from 'node:child_process'
import semver from 'semver'

const exec = promisify(execCallback)

/**
 * Asynchronously finds the first version of the upper package that includes
 * a specified sub-dependency version or a newer one.
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
  console.log(`Starting the search process...`)

  try {
    // Fetch all versions of the specified upper package
    console.log(`Fetching all versions of ${upperPackage} starting from ${startingVersion}...`)
    const { stdout: versions } = await exec(`npm view ${upperPackage} versions --json`)
    const allVersions = JSON.parse(versions).filter((version: string) => semver.gte(version, startingVersion))

    console.log(`Total relevant versions fetched for ${upperPackage}: ${allVersions.length}`)

    // Search for the first version that includes the target sub-dependency version
    console.log(`Searching for the first version of ${upperPackage} that includes ${subDependency}@${targetSubDepVersion} or newer...`)
    for (const version of allVersions) {
      console.log(`Checking ${upperPackage}@${version} ...`)
      const { stdout: deps } = await exec(`npm view ${upperPackage}@${version} dependencies --json`)
      const dependencies = JSON.parse(deps || '{}')

      // Check if the sub-dependency exists and if it meets the version requirement
      if (dependencies[subDependency]) {
        const currentSubDepVersionRange = dependencies[subDependency]
        console.log(`Actual version of ${subDependency} in ${upperPackage}@${version}: ${currentSubDepVersionRange}`)

        const minVersion = semver.minVersion(currentSubDepVersionRange)
        if (minVersion && semver.gte(minVersion, targetSubDepVersion)) {
          console.log(`Match found: ${upperPackage}@${version} includes ${subDependency} version ${minVersion} which satisfies the requirement of ${targetSubDepVersion} or higher.`)
          return // Exit once a match is found
        }
      }
    }

    console.log(`No matching version found for the specified criteria.`)
  }
  catch (error) {
    console.error('An error occurred during the search:', error)
  }
}

// Extract command line arguments for usage in the script
const [,, currentPackageVersion, targetSubDep] = process.argv

if (!currentPackageVersion || !targetSubDep) {
  console.log('Missing arguments. Please provide the current package version and the target sub-dependency version.')
  console.log('Usage: findMatchingVersion(\'current-package\', \'version\', \'sub-dependency\', \'target-version\')')
}
else {
  const [upperPackage, startingVersion] = currentPackageVersion.split('@')
  const [subDependency, targetSubDepVersion] = targetSubDep.split('@')
  findMatchingVersion(upperPackage, startingVersion, subDependency, targetSubDepVersion)
}
