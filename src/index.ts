import { promisify } from 'node:util'
import { exec as execCallback } from 'node:child_process'
import { gte, minVersion } from 'semver'

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

    const sanitizedUpperPackage = upperPackage.replace(/[^\w-]/g, '')
    const { stdout: versions } = await exec(`npm view ${sanitizedUpperPackage} versions --json`)

    // Filter versions to only keep valid semantic versioning (exclude pre-releases)
    const allVersions = JSON.parse(versions)
      .filter((version: string) => gte(version, startingVersion) && /^\d+\.\d+\.\d+$/.test(version))

    if (allVersions.length === 0) {
      console.log('No versions found that meet the starting version criteria.')
      return
    }

    console.log(`Total relevant versions fetched for ${sanitizedUpperPackage}: ${allVersions.length}`)

    // Search for the first version that includes the target sub-dependency version
    console.log(`Searching for the first version of ${sanitizedUpperPackage} that includes ${subDependency}@${targetSubDepVersion} or newer...`)
    for (const version of allVersions) {
      console.log(`Checking ${sanitizedUpperPackage}@${version} ...`)

      const sanitizedVersion = version.replace(/[^\w.-]/g, '')
      const { stdout: deps } = await exec(`npm view ${sanitizedUpperPackage}@${sanitizedVersion} dependencies --json`)
      const dependencies = JSON.parse(deps || '{}')

      // Check if the sub-dependency exists and if it meets the version requirement
      if (dependencies[subDependency]) {
        const currentSubDepVersionRange = dependencies[subDependency]
        console.log(`Actual version of ${subDependency} in ${sanitizedUpperPackage}@${sanitizedVersion}: ${currentSubDepVersionRange}`)

        const dependenciesVersion = minVersion(currentSubDepVersionRange)
        if (dependenciesVersion && gte(dependenciesVersion, targetSubDepVersion)) {
          console.log(`Match found: ${sanitizedUpperPackage}@${sanitizedVersion} includes ${subDependency} version ${dependenciesVersion} which satisfies the requirement of ${targetSubDepVersion} or higher.`)
          return // Exit once a match is found
        }
      }
    }

    console.log('No matching version found for the specified criteria.')
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
  findMatchingVersion(upperPackage, startingVersion, subDependency, targetSubDepVersion).catch(console.error)
}
