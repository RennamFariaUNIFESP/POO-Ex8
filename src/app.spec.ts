import sinon from "sinon"
import { App } from "./app"
import { Bike } from "./bike"
import { User } from "./user"
import { Location } from "./location"
import { BikeNotFoundError } from "./errors/bike-not-found-error";
import { BikeNotExistError } from "./errors/bike-not-exist-error";
import { UnavailableBikeError } from "./errors/unavailable-bike-error";
import { RentNotFoundError } from "./errors/rent-not-found-error";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { UserNotExistError } from "./errors/user-not-exist-error";
import { DuplicateUserError } from "./errors/duplicate-user-error";
import { Rent } from "./rent"

describe('App', () => {
    it('should correctly calculate the rent amount', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        const clock = sinon.useFakeTimers();
        app.rentBike(bike.id, user.email)
        const hour = 1000 * 60 * 60
        clock.tick(2 * hour)
        const rentAmount = app.returnBike(bike.id, user.email)
        expect(rentAmount).toEqual(200.0)
    })

    it('should be able to move a bike to a specific location', () => {
        const app = new App()
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        const newYork = new Location(40.753056, -73.983056)
        app.moveBikeTo(bike.id, newYork)
        expect(bike.location.latitude).toEqual(newYork.latitude)
        expect(bike.location.longitude).toEqual(newYork.longitude)
    })

    it('should throw BikeNotFoundError when trying to move an unregistered bike', () => {
        const app = new App()
        const newYork = new Location(40.753056, -73.983056)
        expect(() => {
            app.moveBikeTo('fake-id', newYork)
        }).toThrow(BikeNotFoundError)
    })

    it('should correctly handle bike rent', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike', 1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        app.rentBike(bike.id, user.email)
        expect(app.rents.length).toEqual(1)
        expect(app.rents[0].bike.id).toEqual(bike.id)
        expect(app.rents[0].user.id).toEqual(user.id)
    })

    it('should throw UnavailableBikeError when trying to rent unavailable bike', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        bike.available = false
        expect(() => {
            app.rentBike(bike.id, user.email)
        }).toThrow(UnavailableBikeError)
    })

    it('should correctly find user', async () => {
      const app = new App()
      const user = new User('Jose', 'jose@mail.com', '1234')
      await app.registerUser(user)
      const verify = app.findUser('jose@mail.com')
      expect(verify).toEqual(user)
    })

    it('should throw UserNotFoundError when trying to search an unregistered user',  () => {
      const app = new App()
      const emailUser = 'jose@mail.com'
      expect( () => {
 app.findUser('jose@mail.com')
      }).toThrow(UserNotFoundError)
    })

    it('should correctly register user', async () => {
      const app = new App()
      const user = new User('Jose', 'jose@mail.com', '1234')
      const id = await app.registerUser(user)
      expect(id).toEqual(expect.any(String))
    })
  
    it('should correctly authenticate', async () => {
      const app = new App()
      const email = 'jose@mail.com'
      const password = '1234'
      const user = new User('Jose', email, password)
      await app.registerUser(user)
      const value = await app.authenticate(email, password)
      expect(value).toEqual(true)
    })
    //
  
    it('should correctly register bike', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike', 1234, 1234, 100.0, 'My bike', 5, [])
        const newID = await app.registerBike(bike)
        expect(newID).toEqual(bike.id)
    })
  
    it('should throw BikeNotExist when trying to register a bike not created', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = undefined
        expect( () => {
            app.registerBike(bike)
        }).toThrow(BikeNotExistError)
    })
  
    it('should correctly remove user', async () => {
        const app = new App()
      const user = new User('Jose', 'jose@mail.com', '1234')
      await app.registerUser(user)
      expect( app.removeUser(user.email)
      ).toBeNull()
    })
  
    it('should throw UserNotExistError when trying to remove a user that not exist',  () => {
        const app = new App()
      const email = 'fake@email.com'
      expect( () => {
        app.removeUser(email)
      }).toThrow(UserNotExistError)
    })//UserNotExistError

    it('should throw RentNotFoundError when trying to return a bike', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike', 1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        expect( () => {
            app.returnBike(bike.id, user.email)
        }).toThrow(RentNotFoundError)
    })
  
    it('should correctly find bike', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike', 1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        const verify = app.findBike(bike.id)
        expect(
            app.findBike(bike.id)
    ).toEqual(bike)
    })
  
    it('should throw BikeNotFoundError when trying to find bike in app', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const id = "4721804102"
        expect( () => {
            app.findBike(id)
        }).toThrow(BikeNotFoundError)
    })
  
})