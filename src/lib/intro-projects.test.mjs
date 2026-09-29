import assert from "node:assert/strict"
import test from "node:test"
import { getProjectArrivalProfile, getProjectDepthState, toIntroVisuals } from "./intro-projects.ts"

test("intro visuals stay derived from the supplied portfolio projects", () => {
  const projects = [
    { slug: "first", title: "First project", image: "/first.jpg", description: "Unused" },
    { slug: "second", title: "Second project", image: "/second.png", description: "Unused" },
  ]

  assert.deepEqual(toIntroVisuals(projects), [
    { slug: "first", title: "First project", image: "/first.jpg" },
    { slug: "second", title: "Second project", image: "/second.png" },
  ])
  assert.equal(projects.length, 2)
})

test("project depth states move older cards upward, backward, and smaller", () => {
  const front = getProjectDepthState(0)
  const previous = getProjectDepthState(1)
  const midStack = getProjectDepthState(2)
  const oldest = getProjectDepthState(3)

  assert.equal(front.y, 24)
  assert.equal(front.z, 24)
  assert.equal(front.scale, 1)
  assert.equal(previous.y, -28)
  assert.ok(Math.abs(previous.scale - 0.94) < 0.001)
  assert.ok(previous.z < front.z)
  assert.equal(midStack.y, -80)
  assert.ok(Math.abs(midStack.scale - 0.88) < 0.001)
  assert.equal(oldest.y, -132)
  assert.ok(Math.abs(oldest.scale - 0.82) < 0.001)
  assert.ok(oldest.z < previous.z)
})

test("project arrival origins alternate sides with deterministic variation", () => {
  const arrivals = [0, 1, 2, 3].map(getProjectArrivalProfile)

  assert.deepEqual(arrivals.map(({ direction }) => direction), [-1, 1, -1, 1])
  assert.notEqual(arrivals[0].xFactor, arrivals[2].xFactor)
  assert.notEqual(arrivals[1].yFactor, arrivals[3].yFactor)
  assert.ok(arrivals[0].counterX > 0)
  assert.ok(arrivals[1].counterX < 0)
  assert.deepEqual(getProjectArrivalProfile(4), arrivals[0])
})
