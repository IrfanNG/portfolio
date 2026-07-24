"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { ScreenQuad } from "@react-three/drei"
import * as THREE from "three"

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;

// --- Noise functions ---

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
            dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
        u.y
    );
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

// --- Domain-warped fBm ---

float domainWarpedFbm(vec2 p) {
    float t = uTime * 0.15;

    vec2 q = vec2(
        fbm(p + vec2(0.0, 0.0) + t * 0.3),
        fbm(p + vec2(5.2, 1.3) + t * 0.2)
    );

    vec2 r = vec2(
        fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.15),
        fbm(p + 4.0 * q + vec2(8.3, 2.8) + t * 0.12)
    );

    return fbm(p + 3.5 * r);
}

// --- Surface normal from noise ---

vec3 calcNormal(vec2 p) {
    float e = 0.005;
    float h0 = domainWarpedFbm(p);
    float hx = domainWarpedFbm(p + vec2(e, 0.0));
    float hy = domainWarpedFbm(p + vec2(0.0, e));
    return normalize(vec3((hx - h0) / e, (hy - h0) / e, 1.0));
}

// --- Main ---

void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;

    // Mouse ripple: displace p based on mouse distance
    vec2 mousePos = uMouse * vec2(uResolution.x / uResolution.y, 1.0) * 1.5;
    float mouseDist = length(p - mousePos);
    float ripple = sin(mouseDist * 12.0 - uTime * 8.0) * 0.03 * smoothstep(2.5, 0.0, mouseDist);
    p += normalize(p - mousePos + 0.001) * ripple;

    // Flowing chrome surface
    float h = domainWarpedFbm(p);

    // Surface normal from noise
    vec3 normal = calcNormal(p);

    // View and light directions
    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
    vec3 lightDir1 = normalize(vec3(1.0, 1.0, 2.0));
    vec3 lightDir2 = normalize(vec3(-1.5, 0.5, 1.0));

    // --- Chrome shading ---

    // Diffuse (very low — chrome is mostly reflective)
    float diff = max(dot(normal, lightDir1), 0.0) * 0.05
               + max(dot(normal, lightDir2), 0.0) * 0.03;

    // Specular (ultra-sharp highlights)
    vec3 halfDir1 = normalize(lightDir1 + viewDir);
    vec3 halfDir2 = normalize(lightDir2 + viewDir);
    float spec1 = pow(max(dot(normal, halfDir1), 0.0), 256.0);
    float spec2 = pow(max(dot(normal, halfDir2), 0.0), 200.0);

    // Fresnel (strong edge reflection)
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);

    // Iridescent tint (very subtle)
    vec3 iridescent = 0.5 + 0.5 * cos(6.28318 * (fresnel * vec3(0.2, 0.5, 0.8) + vec3(0.0, 0.05, 0.1)));

    // Environment reflection (fake — silver/white, NOT blue)
    vec3 refl = reflect(-viewDir, normal);
    float env = smoothstep(-0.2, 0.8, refl.y);
    vec3 envColor = mix(vec3(0.6, 0.62, 0.65), vec3(0.95, 0.96, 0.98), env);

    // Base chrome color (warm silver)
    vec3 baseColor = vec3(0.78, 0.80, 0.83);

    // Combine
    vec3 color = vec3(0.0);
    color += baseColor * diff;
    color += spec1 * vec3(1.0) * 1.2;
    color += spec2 * vec3(0.95, 0.97, 1.0) * 0.6;
    color += fresnel * envColor * 0.5;
    color += fresnel * iridescent * 0.08;
    color += baseColor * 0.08;

    // Darken valleys, brighten peaks based on noise height
    color *= 0.6 + h * 0.8;

    // Vignette
    vec2 uv = gl_FragCoord.xy / uResolution;
    float vignette = 1.0 - 0.3 * length(uv - 0.5);
    color *= vignette;

    // Clamp
    color = clamp(color, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
}
`

function LiquidChrome() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  )

  const mouseRef = useRef(new THREE.Vector2(0, 0))

  useFrame(({ pointer, size }, delta) => {
    uniforms.uTime.value += delta
    mouseRef.current.lerp(new THREE.Vector2(pointer.x, pointer.y), 0.05)
    uniforms.uMouse.value.copy(mouseRef.current)
    uniforms.uResolution.value.set(size.width, size.height)
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
  return <LiquidChrome />
}
