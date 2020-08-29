import debug from 'debug'
import { Either, left, right } from 'fp-ts/lib/Either'

import { Planet } from '../model/planet.model'

export interface NasaPlanet {
  id: string
  name: string
  distanceToTheSun: number
  orbitalPeriod: number
  meanRadius: number
}

type NasaSatelliteInformation = {
  data: NasaPlanet[]
}
const XMMNewton: NasaSatelliteInformation = {
  data: [
    {
      id: '6561727468a',
      name: 'earth',
      distanceToTheSun: 123,
      orbitalPeriod: 222,
      meanRadius: 987,
    },
    {
      id: '6d617273',
      name: 'mars',
      distanceToTheSun: 555,
      orbitalPeriod: 6345,
      meanRadius: 3453,
    },
    {
      id: '6d657263757279',
      name: 'mercury',
      distanceToTheSun: 234,
      orbitalPeriod: 333,
      meanRadius: 6345,
    },
    {
      id: '73617475726e',
      name: 'saturn',
      distanceToTheSun: 345,
      orbitalPeriod: 234,
      meanRadius: 734,
    },
  ],
}

const log = debug('UNS')

function fetchPlanet(name: string): Either<Error, Planet> {
  const planet = XMMNewton.data.find((planet) => planet.name === name)
  if (planet) {
    log('received %o', planet)
    // remapping this so that it's not dependent on the source's data format
    return right({
      id: planet.id,
      name: planet.name,
      distanceToTheSun: planet.distanceToTheSun,
    })
  }
  return left(new Error('Could not find planet in our solar system.'))
}

export function queryPlanet(name: string): Either<Error, Planet> {
  const referenceDate = Date.now()

  // unfortunately, XMM Newton is not very reliable ;)
  if (referenceDate.valueOf() % 2 !== 0) {
    log('pretending satellite is down...')
    return left(new Error('Satellite unavailable. Try later.'))
  }

  return fetchPlanet(name)
}
