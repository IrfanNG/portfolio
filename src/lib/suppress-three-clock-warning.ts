/**
 * Silences the `THREE.Clock: This module has been deprecated` warning emitted
 * by three.js r183+ on every `new THREE.Clock()` call.
 *
 * We never instantiate `Clock` ourselves. `@react-three/fiber` 9.x creates one
 * internally on every `<Canvas>` mount; the migration to `THREE.Timer` only
 * lands in R3F v10 (unreleased). This uses three's `setConsoleFunction` hook to
 * drop exactly this message and pass every other log through untouched.
 *
 * REMOVAL: delete this file (and its import in webgl-hero.tsx) once
 * `@react-three/fiber` no longer constructs `THREE.Clock`. Verify with:
 *   grep -n "new THREE.Clock" node_modules/@react-three/fiber/dist/*.js
 *
 * @see https://github.com/pmndrs/react-three-fiber/issues/3741
 */

import { getConsoleFunction, setConsoleFunction } from "three"

type ThreeConsoleHandler = (
  type: "log" | "warn" | "error",
  message: string,
  ...params: unknown[]
) => void

type MarkedHandler = ThreeConsoleHandler & {
  __suppressClockDeprecationWarning?: true
}

const CLOCK_DEPRECATION_WARNING =
  "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead."

function forwardToConsole(
  type: "log" | "warn" | "error",
  message: string,
  ...params: unknown[]
) {
  if (type !== "log") {
    const first = params[0] as
      | { isStackTrace?: boolean; getError?: (message: string) => Error }
      | undefined
    if (first?.isStackTrace && typeof first.getError === "function") {
      console[type](first.getError(message))
      return
    }
  }

  console[type](message, ...params)
}

const current = getConsoleFunction() as MarkedHandler | null

if (!current?.__suppressClockDeprecationWarning) {
  const forward = current ?? forwardToConsole
  const handler: MarkedHandler = (type, message, ...params) => {
    if (type === "warn" && message === CLOCK_DEPRECATION_WARNING) return
    forward(type, message, ...params)
  }
  handler.__suppressClockDeprecationWarning = true
  setConsoleFunction(handler)
}
