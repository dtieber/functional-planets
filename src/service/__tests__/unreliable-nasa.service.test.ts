import { isLeft, isRight, left, right } from 'fp-ts/lib/Either'

import { queryPlanet } from '../unreliable-nasa.service'

describe('unreliable nasa service', () => {
  it('returns information about a planet if unix epoch is even and id is okay', () => {
    const referenceTime = new Date(2)
    Date.now = jest.fn().mockReturnValue(referenceTime)
    const existingPlanet = 'earth'

    const result = queryPlanet(existingPlanet)

    expect(isRight(result)).toBeTruthy()
    expect(result).toEqual(
      right({
        id: '6561727468a',
        name: 'earth',
        distanceToTheSun: 123,
        meanRadius: 987,
        orbitalPeriod: 222,
      })
    )
  })

  it('returns an error if unix epoch is even and id is not okay', () => {
    const referenceTime = new Date(2)
    Date.now = jest.fn().mockReturnValue(referenceTime)
    const doesNotExist = 'melmac' // this does not really exist

    const result = queryPlanet(doesNotExist)

    expect(isLeft(result)).toBeTruthy()
    expect(result).toEqual(left(Error('Could not find planet in our solar system.')))
  })

  it('returns an error if unix epoch is odd but id is okay', () => {
    const referenceTime = new Date(1)
    Date.now = jest.fn().mockReturnValue(referenceTime)
    const existingPlanet = 'earth'

    const result = queryPlanet(existingPlanet)

    expect(isLeft(result)).toBeTruthy()
    expect(result).toEqual(left(Error('Satellite unavailable. Try later.')))
  })
})
