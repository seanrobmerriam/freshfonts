import assert from 'node:assert/strict';
export function assertEquals(actual: unknown, expected: unknown): void { assert.deepStrictEqual(actual, expected); }
export function assertStringIncludes(actual: string, expected: string) { assert.ok(actual.includes(expected)); }
export function assertThrows(fn: () => unknown, error: typeof Error, message: string) { assert.throws(fn, (caught: unknown) => caught instanceof error && caught.message.includes(message)); }
