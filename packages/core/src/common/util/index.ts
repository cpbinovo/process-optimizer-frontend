export * from './converters'
export * from './forms'
export * from './save-to-local-file'

export const errorMessage = (e: unknown) => {
  if (typeof e === 'string') {
    return e
  } else if (e instanceof Error) {
    return e.message
  } else {
    return `Unknown error: ${JSON.stringify(e)}`
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function assertUnreachable(_x: never): never {
  throw new Error("Didn't expect to get here")
}
