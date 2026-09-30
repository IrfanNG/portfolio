export type IntroVisual = {
  slug: string
  title: string
  image: string
}

export type ProjectDepthState = {
  x: number
  y: number
  z: number
  scale: number
}

export type ProjectDepthProfile = {
  frontY?: number
  verticalStep?: number
  depthStep?: number
  scaleStep?: number
}

export type ProjectArrivalProfile = {
  direction: -1 | 1
  xFactor: number
  yFactor: number
  scale: number
}

const projectArrivalProfiles: readonly ProjectArrivalProfile[] = [
  { direction: -1, xFactor: 1, yFactor: 1.04, scale: 1 },
  { direction: 1, xFactor: 0.92, yFactor: 1, scale: 1 },
  { direction: -1, xFactor: 1.08, yFactor: 1.12, scale: 1 },
  { direction: 1, xFactor: 0.96, yFactor: 1.06, scale: 1 },
]

export function getProjectArrivalProfile(index: number): ProjectArrivalProfile {
  const profileIndex = Math.abs(Math.trunc(index)) % projectArrivalProfiles.length
  return projectArrivalProfiles[profileIndex]
}

export function getProjectArrivalState(
  index: number,
  viewportHeight: number,
  stageHeight: number,
  horizontalTravel: number,
): ProjectDepthState {
  const arrival = getProjectArrivalProfile(index)

  return {
    x: arrival.direction * horizontalTravel * arrival.xFactor,
    y: (viewportHeight / 2 + stageHeight / 2 + 24) * arrival.yFactor,
    z: 24,
    scale: arrival.scale,
  }
}

export function getProjectDepthState(
  depth: number,
  {
    frontY = 24,
    verticalStep = 52,
    depthStep = 34,
    scaleStep = 0.06,
  }: ProjectDepthProfile = {},
): ProjectDepthState {
  const level = Math.max(0, depth)

  return {
    x: 0,
    y: frontY - level * verticalStep,
    z: 24 - level * depthStep,
    scale: 1 - level * scaleStep,
  }
}

export function toIntroVisuals<T extends IntroVisual>(projects: readonly T[]): IntroVisual[] {
  return projects.map(({ slug, title, image }) => ({ slug, title, image }))
}
