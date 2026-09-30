import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import ts from "typescript"
import { toIntroVisuals } from "./intro-projects.ts"
import { getProjectFocusProgress, getShowcaseFrame } from "./project-showcase.ts"

const source = await readFile(new URL("../data/projects.ts", import.meta.url), "utf8")
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } })
const { projects } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`)

test("DOH leads the shared showcase and intro data before the existing projects", () => {
  assert.deepEqual(projects.map(project => project.slug), ["doh-barbershop", "utp-medtech", "noise-agency", "svg-redesign", "evex-utp"])
  assert.equal(projects[0].liveUrl, "https://doh-barbershop.irfanariff.com/")
  assert.equal(projects[0].image, "/projects/doh-barbershop-showcase.png")
  assert.equal(toIntroVisuals(projects)[0].slug, "doh-barbershop")
})

test("every project in the expanded showcase has a fully revealed keyboard destination", () => {
  for (let index = 0; index < projects.length; index++) {
    const frame = getShowcaseFrame(getProjectFocusProgress(index, projects.length), projects.length)
    assert.equal(frame.activeIndex, index)
    assert.equal(frame.reveals[index], 1)
    assert.ok(frame.reveals.slice(index + 1).every(reveal => reveal === 0))
  }
})
