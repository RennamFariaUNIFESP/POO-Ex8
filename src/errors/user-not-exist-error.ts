export class UserNotExistError extends Error {
    public readonly name = 'UserNotExistError'
    constructor () {
      super('User does not exist.')
    }
}