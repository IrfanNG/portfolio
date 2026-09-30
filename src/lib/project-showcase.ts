export function getShowcaseEntryClip(progress: number, height: number) {
  const reveal = Math.max(0, Math.min(1, progress))
  // Ease the mask ahead of the section's travel so the heading is visible before leaving the viewport.
  return reveal === 1 ? "" : `inset(${(1 - reveal) ** 3 * height}px 0 0 0)`
}

export function getShowcaseFrame(progress: number, count: number) {
  const time = Math.max(0, Math.min(1, progress)) * count
  return {
    activeIndex: count ? Math.min(count - 1, Math.floor(time)) : -1,
    reveals: Array.from({ length: count }, (_, index) => index === 0
      ? 1
      : Math.max(0, Math.min(1, (time - (index - 0.3)) / 0.6))),
  }
}

export function getProjectFocusProgress(index: number, count: number) {
  return count > 0 ? (index === 0 ? 0 : index + 0.31) / count : 0
}
