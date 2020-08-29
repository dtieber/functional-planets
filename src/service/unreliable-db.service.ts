import debug from 'debug'
import { Either, left, right } from 'fp-ts/lib/Either'

export interface DbPlanet {
  id: string
  name: string
  color: string
  discoveredBy: string
}

// imagine this was a real document-based db
const db: Map<string, DbPlanet> = new Map<string, DbPlanet>()

const log = debug('UDBS')

export function fetch(name: string): Either<Error, DbPlanet> {
  const planet = db.get(name)
  if (planet) {
    log('found %o', planet)
    return right(planet)
  }
  return left(new Error(`Could not find planet with name: '${name}' in DB.`))
}

export function upsert(planet: DbPlanet): Either<Error, DbPlanet> {
  const referenceDate = Date.now()

  // let's throw an error from time to time
  if (referenceDate.valueOf() % 2 !== 0) {
    log('pretending db connection just dropped...')
    return left(new Error('Cannot connect to database.'))
  }
  db.set(planet.name, planet)
  return right(planet)
}
