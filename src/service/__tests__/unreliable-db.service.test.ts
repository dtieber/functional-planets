import { isRight, right } from 'fp-ts/lib/Either'

import { DbPlanet, fetch, upsert } from '../unreliable-db.service'

describe('unreliable db service insert', () => {
  it('successfully inserts new planet', () => {
    const referenceTime = new Date(2)
    Date.now = jest.fn().mockReturnValue(referenceTime)
    const validPlanet: DbPlanet = {
      id: '0000-123123-123123-123123',
      name: 'Earth',
      color: 'blue',
      discoveredBy: 'dti',
    }

    const result = upsert(validPlanet)

    expect(isRight(result)).toBeTruthy()
  })

  it('successfully updates a planet', () => {
    const referenceTime = new Date(2)
    Date.now = jest.fn().mockReturnValue(referenceTime)
    const originalPlanet: DbPlanet = {
      id: '0000-123123-123123-123123',
      name: 'Earth',
      color: 'blue',
      discoveredBy: 'dti',
    }
    const updatedPlanet: DbPlanet = {
      ...originalPlanet,
      discoveredBy: 'qweqwe',
    }

    upsert(originalPlanet)
    const result = upsert(updatedPlanet)

    expect(isRight(result)).toBeTruthy()
    expect(result).toEqual(
      right({
        id: '0000-123123-123123-123123',
        name: 'Earth',
        color: 'blue',
        discoveredBy: 'qweqwe', // that's the updated value
      })
    )
  })

  it('returns an error if the connection drops while upserting a planet', () => {
    const referenceTime = new Date(1)
    Date.now = jest.fn().mockReturnValue(referenceTime)
    const planet: DbPlanet = {
      id: '0000-123123-123123-123123',
      name: 'Earth',
      color: 'blue',
      discoveredBy: 'dti',
    }

    const result = upsert(planet)

    expect(isRight(result)).toBeFalsy()
  })

  it('returns a planet if name can be found', () => {
    const referenceTime = new Date(2)
    Date.now = jest.fn().mockReturnValue(referenceTime)
    const planet: DbPlanet = {
      id: '0000-123123-123123-123123',
      name: 'Earth',
      color: 'blue',
      discoveredBy: 'dti',
    }
    upsert(planet)

    const result = fetch('Earth')

    expect(isRight(result)).toBeTruthy()
  })

  it('returns a planet if name cannot be found', () => {
    const referenceTime = new Date(2)
    Date.now = jest.fn().mockReturnValue(referenceTime)

    const result = fetch('Uranus')

    expect(isRight(result)).toBeFalsy()
  })
})
