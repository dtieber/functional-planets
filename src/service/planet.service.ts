import { sequenceT } from 'fp-ts/lib/Apply'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'

import { AugmentedPlanet } from '../model/augmented-planet.model'
import { PlanetRequest, toPlanetRequest } from '../model/planet-request.model'
import { DbPlanet, fetch } from './unreliable-db.service'
import { NasaPlanet, queryPlanet } from './unreliable-nasa.service'

// this is the right way to process a chain of tasks, in case you're only interested in the last value
// e.g. for topping up money: fetch customer -> fetch bank account -> top up money
/*
const consecutivePipe = (request: PlanetRequest) =>
  pipe(
    fetch(request.name),
    E.chain((p) => queryPlanet(p.name)) // let's assume the name here was different
  )
*/

// this is the right way to combine resultes from multiple tasks
// e.g. in case you need to fetch information from different sources and combine them
const toAugmentedPlanet = ([dbPlanet, nasaPlanet]: [DbPlanet, NasaPlanet]): AugmentedPlanet => ({
  dbId: dbPlanet.id,
  nasaId: nasaPlanet.id,
  name: dbPlanet.name,
  distanceToTheSun: nasaPlanet.distanceToTheSun,
  color: dbPlanet.color,
})
const seq = (req: PlanetRequest): E.Either<Error, [DbPlanet, NasaPlanet]> =>
  sequenceT(E.either)(fetch(req.name), queryPlanet(req.name))
const combinedPipe = (req: PlanetRequest): E.Either<Error, AugmentedPlanet> => pipe(seq(req), E.map(toAugmentedPlanet))
// or more concise:
// const combinedPipe = (req: PlanetRequest): E.Either<Error, AugmentedPlanet> =>
//  pipe(sequenceT(E.either)(fetch(req.name), queryPlanet(req.name)), E.map(toAugmentedPlanet))

export function get(name: string): E.Either<Error, AugmentedPlanet> {
  const request = toPlanetRequest(name)
  const response = combinedPipe(request)
  return response
}

export function distance(name1: string, name2: string): E.Either<Error, number> {
  console.log(name1, name2)
  return E.left(Error('Not implemented yet.'))
}
