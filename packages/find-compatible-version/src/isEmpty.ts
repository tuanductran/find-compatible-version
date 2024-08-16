/**
 * Verifies if the specified value is empty.
 * An empty value is defined as:
 * - An empty object (`{}`)
 * - An empty array (`[]`)
 * - An empty string (`""`)
 *
 * @param value - The value to assess.
 * @returns Returns `true` if the value is empty; otherwise, `false`.
 */
export function isEmpty(value: unknown): boolean {
  // Immediately return true for null or undefined
  if (value == null) {
    return true
  }

  // Handle arrays and strings
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0
  }

  // Handle plain objects
  if (typeof value === 'object') {
    // Return true for objects with no own enumerable properties
    return Object.keys(value).length === 0
  }

  // For all other types, return false as they are not empty
  return false
}
