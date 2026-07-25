"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const vertexShader = /* glsl */ `
void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const fragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

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
    for (int i = 0; i < 3; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

float domainWarpedFbm(vec2 p) {
    float t = uTime;
    vec2 q = vec2(
        fbm(p + vec2(0.0, 0.0) + t * 0.35),
        fbm(p + vec2(5.2, 1.3) + t * 0.28)
    );
    vec2 r = vec2(
        fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.2),
        fbm(p + 4.0 * q + vec2(8.3, 2.8) + t * 0.16)
    );
    return fbm(p + 3.5 * r);
}

void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;

    float angle = uTime * 0.025;
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    p = rot * p;

    p += vec2(sin(p.y * 3.0 + uTime * 0.13), cos(p.x * 2.5 + uTime * 0.1)) * 0.2;

    vec2 mousePos = uMouse * vec2(uResolution.x / uResolution.y, 1.0) * 1.5;
    float mouseDist = length(p - mousePos);
    float ripple = sin(mouseDist * 8.0 - uTime * 10.0) * 0.02 * smoothstep(1.5, 0.0, mouseDist);
    p += normalize(p - mousePos + 0.001) * ripple;

    float h = domainWarpedFbm(p);
    vec3 normal = normalize(vec3(-dFdx(h), -dFdy(h), 1.0));

    normal.x += sin(uTime * 0.35 + p.y * 5.0) * 0.18;
    normal.y += cos(uTime * 0.28 + p.x * 5.0) * 0.18;
    normal = normalize(normal);

    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
    float lt = uTime * 0.03;
    float c = cos(lt), s = sin(lt);
    vec3 lightDir1 = normalize(vec3(c * 1.0 + s * 2.0, -s * 1.0 + c * 2.0, 2.0));
    vec3 lightDir2 = normalize(vec3(-1.5, 0.5, 1.0 + sin(uTime * 0.3) * 0.5));

    float diff = max(dot(normal, lightDir1), 0.0) * 0.05
               + max(dot(normal, lightDir2), 0.0) * 0.03;

    vec3 halfDir1 = normalize(lightDir1 + viewDir);
    vec3 halfDir2 = normalize(lightDir2 + viewDir);
    float spec1 = pow(max(dot(normal, halfDir1), 0.0), 256.0);
    float spec2 = pow(max(dot(normal, halfDir2), 0.0), 200.0);

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);
    vec3 iridescent = 0.5 + 0.5 * cos(6.28318 * (fresnel * vec3(0.2, 0.5, 0.8) + vec3(0.0, 0.05, 0.1)));

    vec3 refl = reflect(-viewDir, normal);
    float env = smoothstep(-0.2, 0.8, refl.y);
    vec3 envColor = mix(vec3(0.6, 0.62, 0.65), vec3(0.95, 0.96, 0.98), env);

    vec3 baseColor = vec3(0.78, 0.80, 0.83);

    vec3 color = vec3(0.0);
    color += baseColor * diff;
    color += spec1 * vec3(1.0) * 1.2;
    color += spec2 * vec3(0.95, 0.97, 1.0) * 0.6;
    color += fresnel * envColor * 0.5;
    color += fresnel * iridescent * 0.08;
    color += baseColor * 0.08;

    color *= 0.6 + h * 0.8;

    vec2 uv = gl_FragCoord.xy / uResolution;
    float vignette = 1.0 - 0.3 * length(uv - 0.5);
    color *= vignette;

    color = clamp(color, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
}
`

function LiquidChrome() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  )

  const mouseRef = useRef(new THREE.Vector2(0, 0))

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const vertices = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0])
    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
    return geo
  }, [])

  useFrame(({ pointer, size, clock }) => {
    const mat = materialRef.current
    if (!mat) return

    mat.uniforms.uTime.value = clock.elapsedTime
    mouseRef.current.lerp(new THREE.Vector2(pointer.x, pointer.y), 0.05)
    mat.uniforms.uMouse.value.copy(mouseRef.current)
    mat.uniforms.uResolution.value.set(size.width, size.height)
  })

  return (
    <mesh geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

export function DeveloperDeskScene() {
  return <LiquidChrome />
}
