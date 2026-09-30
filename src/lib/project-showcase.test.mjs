import assert from "node:assert/strict"
import test from "node:test"
import * as showcase from "./project-showcase.ts"
import { getProjectFocusProgress, getShowcaseFrame } from "./project-showcase.ts"

test("section entrance reveals the heading before it scrolls away and releases its mask before pinning", () => {
  assert.equal(typeof showcase.getShowcaseEntryClip, "function")
  assert.equal(showcase.getShowcaseEntryClip(0, 1200), "inset(1200px 0 0 0)")
  assert.equal(showcase.getShowcaseEntryClip(0.5, 1200), "inset(150px 0 0 0)")
  assert.equal(showcase.getShowcaseEntryClip(1, 1200), "")
  assert.equal(showcase.getShowcaseEntryClip(2, 1200), "")
  assert.equal(showcase.getShowcaseEntryClip(-1, 1200), "inset(1200px 0 0 0)")
  assert.equal(showcase.getShowcaseEntryClip(0.5, 400), "inset(50px 0 0 0)")
})

test("scroll progress reveals projects in order and reverses without losing a frame", () => {
  assert.deepEqual(getShowcaseFrame(0, 4), { activeIndex: 0, reveals: [1, 0, 0, 0] })
  const midway = getShowcaseFrame(0.25, 4)
  assert.equal(midway.activeIndex, 1)
  assert.ok(Math.abs(midway.reveals[1] - 0.5) < 0.0001)
  assert.deepEqual(getShowcaseFrame(1, 4), { activeIndex: 3, reveals: [1, 1, 1, 1] })
  assert.deepEqual(getShowcaseFrame(0, 4), { activeIndex: 0, reveals: [1, 0, 0, 0] })
})

test("keyboard destinations show the focused project completely", () => {
  for (let index = 0; index < 4; index++) {
    const progress = getProjectFocusProgress(index, 4)
    const frame = getShowcaseFrame(progress, 4)
    assert.equal(frame.activeIndex, index)
    assert.equal(frame.reveals[index], 1)
    assert.ok(frame.reveals.slice(index + 1).every((reveal) => reveal === 0))
  }
})

test("empty and single-project showcases have safe scroll frames", () => {
  assert.deepEqual(getShowcaseFrame(0.5, 0), { activeIndex: -1, reveals: [] })
  assert.deepEqual(getShowcaseFrame(-1, 1), { activeIndex: 0, reveals: [1] })
  assert.deepEqual(getShowcaseFrame(2, 1), { activeIndex: 0, reveals: [1] })
})
