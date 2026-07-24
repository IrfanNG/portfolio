"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { ScreenQuad } from "@react-three/drei"
import * as THREE from "three"

const BALL_COUNT = 4

function noise(x: number, y: number, z: number): number {
  const a = Math.sin(x * 1.27 + y * 3.71 + z * 0.93) * 0.5
  const b = Math.sin(x * 2.53 + y * 1.43 + z * 2.81) * 0.3
  const c = Math.sin(x * 0.87 + y * 2.19 + z * 1.57) * 0.2
  return a + b + c
}

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec3 uBallPos[4];
uniform float uBallRadius[4];

varying vec2 vUv;

float field(vec3 p) {
    float sum = 0.0;
    for (int i = 0; i < 4; i++) {
        vec3 d = p - uBallPos[i];
        float r2 = uBallRadius[i] * uBallRadius[i];
        sum += r2 / dot(d, d);
    }
    vec2 mouseWorld = uMouse * 3.0;
    float mouseDist = length(p.xy - vec3(mouseWorld, 0.0).xy);
    float ripple = sin(mouseDist * 10.0 - uTime * 6.0) * 0.05 * smoothstep(4.0, 0.0, mouseDist);
    sum += ripple;
    return sum;
}

vec3 calcNormal(vec3 p) {
    float e = 0.01;
    return normalize(vec3(
        field(p + vec3(e, 0.0, 0.0)) - field(p - vec3(e, 0.0, 0.0)),
        field(p + vec3(0.0, e, 0.0)) - field(p - vec3(0.0, e, 0.0)),
        field(p + vec3(0.0, 0.0, e)) - field(p - vec3(0.0, 0.0, e))
    ));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;

    vec3 ro = vec3(0.0, 0.0, 4.0);
    vec3 rd = normalize(vec3(uv, -1.5));

    float t = 0.0;
    float threshold = 1.0;
    bool hit = false;

    for (int i = 0; i < 64; i++) {
        vec3 p = ro + rd * t;
        float d = field(p);
        if (d > threshold) {
            hit = true;
            break;
        }
        t += 0.1;
        if (t > 20.0) break;
    }

    if (!hit) {
        float bg = 0.035 + 0.01 * (1.0 - uv.y);
        gl_FragColor = vec4(vec3(bg), 1.0);
        return;
    }

    vec3 p = ro + rd * t;
    vec3 normal = calcNormal(p);
    vec3 viewDir = normalize(ro - p);

    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));

    float diff = max(dot(normal, lightDir), 0.0) * 0.1;

    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 128.0);

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

    vec3 iridescent = 0.5 + 0.5 * cos(6.28318 * (fresnel * vec3(0.3, 0.6, 0.9) + vec3(0.0, 0.1, 0.2)));

    vec3 baseColor = vec3(0.85, 0.88, 0.92);

    vec3 color = baseColor * (0.1 + diff);
    color += spec * vec3(1.0);
    color += fresnel * iridescent * 0.4;

    vec3 refl = reflect(-viewDir, normal);
    float env = max(refl.y, 0.0) * 0.15;
    color += env * vec3(0.6, 0.7, 0.8);

    gl_FragColor = vec4(color, 1.0);
}
`

function LiquidBlob() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uBallPos: {
        value: Array.from({ length: BALL_COUNT }, () => new THREE.Vector3(0, 0, 0)),
      },
      uBallRadius: { value: new Float32Array(BALL_COUNT).fill(0.5) },
    }),
    [],
  )

  const mouseRef = useRef(new THREE.Vector2(0, 0))
  const timeRef = useRef(0)

  useFrame(({ pointer, size }, delta) => {
    timeRef.current += delta
    const t = timeRef.current

    mouseRef.current.lerp(new THREE.Vector2(pointer.x, pointer.y), 0.05)

    uniforms.uResolution.value.set(size.width, size.height)

    const positions = uniforms.uBallPos.value as THREE.Vector3[]
    const radii = uniforms.uBallRadius.value as Float32Array

    for (let i = 0; i < 3; i++) {
      const speed = 0.3 + i * 0.15
      const radius = 1.2 + i * 0.4
      const offset = i * 2.094

      const nx = noise(t * 0.2 + i, i, 0)
      const ny = noise(0, t * 0.2 + i, i)

      positions[i].set(
        Math.cos(t * speed + offset) * radius + nx * 0.3,
        Math.sin(t * speed * 0.7 + offset) * radius * 0.6 + ny * 0.3,
        Math.sin(t * speed * 0.5 + offset) * 0.5,
      )
      radii[i] = 0.6 + Math.sin(t * 0.5 + i) * 0.1
    }

    const mx = mouseRef.current.x * 3
    const my = mouseRef.current.y * 2
    positions[3].set(mx, my, 0)
    radii[3] = 0.5 + Math.sin(t * 2) * 0.05

    uniforms.uTime.value = t
    uniforms.uMouse.value.copy(mouseRef.current)
  })

  return (
    <ScreenQuad>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </ScreenQuad>
  )
}

export function DeveloperDeskScene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <LiquidBlob />
    </>
  )
}
