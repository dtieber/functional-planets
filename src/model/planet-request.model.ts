export interface PlanetRequest {
  name: string
}

export const toPlanetRequest = (name: string): PlanetRequest => ({ name })
