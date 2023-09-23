export class DuplicateUserError extends Error {
  public readonly name = 'DuplicateUserError'
  constructor () {
    super('Alreary exist this user.')
  }
}