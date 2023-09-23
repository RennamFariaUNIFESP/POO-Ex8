export class BikeNotExistError extends Error {
    public readonly name = 'BikeNotExistError'
    constructor () {
      super('Bike not exist.')
    }
}