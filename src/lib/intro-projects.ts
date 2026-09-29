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
  counterX: number
}

const projectArrivalProfiles: readonly ProjectArrivalProfile[] = [
  { direction: -1, xFactor: 1, yFactor: 1.04, scale: 0.96, counterX: 8 },
  { direction: 1, xFactor: 0.92, yFactor: 0.94, scale: 0.97, counterX: -6 },
  { direction: -1, xFactor: 1.08, yFactor: 1.12, scale: 0.95, counterX: 7 },
  { direction: 1, xFactor: 0.96, yFactor: 1, scale: 0.96, counterX: -8 },
]

export function getProjectArrivalProfile(index: number): ProjectArrivalProfile {
  const profileIndex = Math.abs(Math.trunc(index)) % projectArrivalProfiles.length
  return projectArrivalProfiles[profileIndex]
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
