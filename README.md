# Find Compatible Version

A TypeScript package that helps you find compatible versions of npm packages based on their dependencies.

## Installation

To install the package, run:

```bash
npm install find-compatible-version
```

## Usage

You can use the `findCompatibleVersion` function to check for a package's compatible version:

```tsx
import { findCompatibleVersion } from 'find-compatible-version'

async function checkCompatibility() {
  const upperPackage = 'your-package-name'
  const startingVersion = '1.0.0'
  const subDependency = 'your-dependency-name'
  const targetSubDepVersion = '2.0.0'

  const compatibleVersion = await findCompatibleVersion(upperPackage, startingVersion, subDependency, targetSubDepVersion)
  console.log(`Compatible version: ${compatibleVersion}`)
}

checkCompatibility()
```

## Parameters

- @param upperPackage - The name of the package to check.
- @param startingVersion - The version to start searching from.
- @param subDependency - The sub-dependency to find in the package.
- @param targetSubDepVersion - The minimum required version of the sub-dependency.

## License

This project is licensed under the ISC License.
