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
  const packageName = 'your-package-name'
  const versionFrom = '1.0.0'
  const dependencyName = 'your-dependency-name'
  const requiredDepVersion = '2.0.0'

  const compatibleVersion = await findCompatibleVersion(packageName, versionFrom, dependencyName, requiredDepVersion)
  console.log(`Compatible version: ${compatibleVersion}`)
}

checkCompatibility()
```

## Parameters

- packageName: The name of the npm package you want to check.
- versionFrom: The version you want to compare against.
- dependencyName: The name of the dependency you are interested in.
- requiredDepVersion: The minimum required version of the dependency.

## License

This project is licensed under the ISC License.
