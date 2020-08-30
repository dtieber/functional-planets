import { isRight, left, right } from 'fp-ts/lib/Either'
import { mocked } from 'ts-jest/utils'

import { get } from '../planet.service'
import { fetch } from '../unreliable-db.service'
import { queryPlanet } from '../unreliable-nasa.service'

jest.mock('../unreliable-db.service')
jest.mock('../unreliable-nasa.service')
const mockedDbFetch = mocked(fetch)
const mockedNasaQuery = mocked(queryPlanet)

describe('fetching a planet', () => {
  it('fails if we cannot retrieve the information from the db', () => {
    mockedDbFetch.mockReturnValueOnce(left(Error('db error noooo')))

    const result = get('Earth')

    expect(isRight(result)).toBeFalsy()
    expect(result).toEqual(left(Error('db error noooo')))
  })

  it('fails if the db returns a value but the satellite does not', () => {
    mockedDbFetch.mockReturnValueOnce(
      right({
        id: '0000-123123-123123-123123',
        name: 'Earth',
        color: 'blue',
        discoveredBy: 'dti',
      })
    )
    mockedNasaQuery.mockReturnValueOnce(left(Error('satellite error nooooo')))

    const result = get('Earth')

    expect(isRight(result)).toBeFalsy()
    expect(result).toEqual(left(Error('satellite error nooooo')))
  })

  it('returns an AugmentedPlanet when both calls succeed', () => {
    mockedDbFetch.mockReturnValueOnce(
      right({
        id: '0000-123123-123123-123123',
        name: 'Earth',
        color: 'blue',
        discoveredBy: 'dti',
      })
    )
    mockedNasaQuery.mockReturnValueOnce(
      right({
        id: '6561727468a',
        name: 'earth',
        distanceToTheSun: 123,
        orbitalPeriod: 222,
        meanRadius: 987,
      })
    )

    const result = get('Earth')

    expect(isRight(result)).toBeTruthy()
    expect(result).toEqual(
      right({
        color: 'blue',
        dbId: '0000-123123-123123-123123',
        distanceToTheSun: 123,
        name: 'Earth',
        nasaId: '6561727468a',
      })
    )
  })
})
