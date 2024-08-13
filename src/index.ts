import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import semver from 'semver';

const exec = promisify(execCallback);

/**
 * Finds a compatible version of an npm package based on the dependency requirements.
 * 
 * @param packageName - The name of the package to check.
 * @param versionFrom - The version to compare against.
 * @param dependencyName - The name of the dependency to check compatibility.
 * @param requiredDepVersion - The required version of the dependency.
 * @returns The compatible version of the package or undefined if none found.
 */
export async function findCompatibleVersion(
    packageName: string, 
    versionFrom: string, 
    dependencyName: string, 
    requiredDepVersion: string
): Promise<string | undefined> {
    console.log('Starting version compatibility search...');

    try {
        console.log(`Fetching versions for ${packageName} starting from ${versionFrom}...`);
        const { stdout: versionData } = await exec(`npm view ${packageName} versions --json`);
        const availableVersions = JSON.parse(versionData).filter((version: string) => semver.gte(version, versionFrom));
        
        console.log(`Total available versions for ${packageName}: ${availableVersions.length}`);

        for (const version of availableVersions) {
            console.log(`Checking ${packageName}@${version}...`);
            const { stdout: dependencyData } = await exec(`npm view ${packageName}@${version} dependencies --json`);
            const dependencies = JSON.parse(dependencyData || '{}');

            if (dependencies[dependencyName]) {
                const dependencyVersionRange = dependencies[dependencyName];
                const minimumVersion = semver.minVersion(dependencyVersionRange);

                if (minimumVersion && semver.gte(minimumVersion, requiredDepVersion)) {
                    console.log(`Compatible version found: ${packageName}@${version} includes ${dependencyName} version ${minimumVersion}, satisfying the requirement of ${requiredDepVersion} or higher.`);
                    return version; // Return the compatible version
                }
            }
        }

        console.log('No compatible version found.');
    } catch (error) {
        console.error('An error occurred during the search:', error);
    }
}