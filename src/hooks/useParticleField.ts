import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import type { ParticleFieldVariant } from '@/components/particle/types'

interface ParticleFieldOptions {
  canvas: Ref<HTMLCanvasElement | null>
  variant: ParticleFieldVariant
  interactive: boolean
  active: Ref<boolean>
}

interface CanvasSize {
  width: number
  height: number
  pixelRatio: number
}

interface PointerPosition {
  x: number
  y: number
  targetX: number
  targetY: number
}

interface DotSample {
  alpha: number
  blue: number
  accent: number
  white: number
  offsetX: number
  offsetY: number
}

// Derived from the approved blue-to-mint reference, kept in one place for visual tuning.
const PARTICLE_PALETTE = {
  background: '#070a10',
  deepBlue: [17, 83, 255],
  sky: [64, 185, 255],
  aqua: [66, 219, 243],
  mint: [102, 239, 203],
  white: [231, 250, 255],
} as const

const HOME_PARTICLE_PALETTE = {
  background: '#08111b',
  blue: [62, 141, 255],
  cyan: [55, 199, 232],
  mint: [85, 214, 174],
} as const

const HOME_VARIANTS = new Set<ParticleFieldVariant>([
  'collaboration',
  'delivery',
  'knowledge',
  'governance',
])

const VARIANT_PHASES: Record<ParticleFieldVariant, number> = {
  ember: 0.4,
  horizon: 2.1,
  ribbon: 3.7,
  vortex: 5.3,
  collaboration: 0.8,
  delivery: 2.4,
  knowledge: 4.1,
  governance: 5.8,
  closing: 0,
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

const gaussian = (value: number, center: number, width: number) => {
  const distance = (value - center) / width
  return Math.exp(-(distance * distance))
}

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const progress = clamp((value - edge0) / (edge1 - edge0))
  return progress * progress * (3 - 2 * progress)
}

const colorChannel = (blue: number, accent: number, white: number) => {
  const total = Math.max(0.001, blue + accent + white)
  const red = Math.round(
    (PARTICLE_PALETTE.deepBlue[0] * blue +
      PARTICLE_PALETTE.mint[0] * accent +
      PARTICLE_PALETTE.white[0] * white) /
      total,
  )
  const green = Math.round(
    (PARTICLE_PALETTE.deepBlue[1] * blue +
      PARTICLE_PALETTE.mint[1] * accent +
      PARTICLE_PALETTE.white[1] * white) /
      total,
  )
  const blueChannel = Math.round(
    (PARTICLE_PALETTE.deepBlue[2] * blue +
      PARTICLE_PALETTE.mint[2] * accent +
      PARTICLE_PALETTE.white[2] * white) /
      total,
  )
  return `${red}, ${green}, ${blueChannel}`
}

const homeColorChannel = (
  variant: ParticleFieldVariant,
  blue: number,
  accent: number,
  white: number,
) => {
  const mint = variant === 'knowledge' ? Math.min(0.05, white * 0.05) : 0
  const total = Math.max(0.001, blue + accent + mint)
  const red = Math.round(
    (HOME_PARTICLE_PALETTE.blue[0] * blue +
      HOME_PARTICLE_PALETTE.cyan[0] * accent +
      HOME_PARTICLE_PALETTE.mint[0] * mint) /
      total,
  )
  const green = Math.round(
    (HOME_PARTICLE_PALETTE.blue[1] * blue +
      HOME_PARTICLE_PALETTE.cyan[1] * accent +
      HOME_PARTICLE_PALETTE.mint[1] * mint) /
      total,
  )
  const blueChannel = Math.round(
    (HOME_PARTICLE_PALETTE.blue[2] * blue +
      HOME_PARTICLE_PALETTE.cyan[2] * accent +
      HOME_PARTICLE_PALETTE.mint[2] * mint) /
      total,
  )
  return `${red}, ${green}, ${blueChannel}`
}

const sampleEmber = (x: number, y: number, time: number): DotSample => {
  const diagonal = x * 0.2 + y * 0.98
  const beamCenter = 0.7 + Math.sin(time * 0.55) * 0.018 - y * 0.34
  const beam = gaussian(x, beamCenter, 0.105)
  const hotCore = gaussian(x, beamCenter, 0.038)
  const lowerFade = 1 - smoothstep(0.42, 0.94, y)
  const topMist = gaussian(y, 0.13, 0.25)

  return {
    alpha: (beam * 0.5 + hotCore * 0.9) * (0.22 + lowerFade * 0.78) * (0.55 + topMist * 0.45),
    blue: gaussian(x, 0.16, 0.25) * 0.16,
    accent: beam * 0.82 + hotCore * 0.55,
    white: hotCore * 0.42,
    offsetX: Math.sin(diagonal * 12 + time * 0.42) * beam * 1.1,
    offsetY: Math.cos(x * 9 - time * 0.28) * beam * 0.65,
  }
}

const sampleHorizon = (x: number, y: number, time: number): DotSample => {
  const wave = 0.29 + Math.sin(x * 3.5 + time * 0.45) * 0.035 + x * 0.04
  const band = gaussian(y, wave, 0.17)
  const crest = gaussian(y, wave - 0.025, 0.052)
  const leftBlue = gaussian(x, 0.31, 0.3)
  const centerWhite = gaussian(x, 0.58, 0.2)
  const rightAccent = gaussian(x, 0.83, 0.24)
  const edgeFade = smoothstep(0.02, 0.18, x) * (1 - smoothstep(0.84, 1, x))

  return {
    alpha: (band * 0.56 + crest * 0.86) * edgeFade * (1 - smoothstep(0.58, 0.92, y)),
    blue: leftBlue * (band + crest * 0.35),
    accent: rightAccent * (band + crest * 0.3),
    white: centerWhite * crest * 0.9,
    offsetX: Math.sin(y * 10 + time * 0.35) * band * 1.1,
    offsetY: Math.sin(x * 7 - time * 0.5) * band * 1.5,
  }
}

const sampleRibbon = (x: number, y: number, time: number): DotSample => {
  const curve = 0.16 + Math.pow(x - 0.53, 2) * 1.25 + Math.sin(x * 5.4 + time * 0.42) * 0.028
  const upperBand = gaussian(y, curve, 0.115)
  const crest = gaussian(y, curve + 0.018, 0.042)
  const lowerCurve = 0.76 - Math.pow(x - 0.33, 2) * 0.58
  const lowerBand = gaussian(y, lowerCurve, 0.16) * gaussian(x, 0.4, 0.42)
  const blue = gaussian(x, 0.22, 0.3)
  const accent = gaussian(x, 0.68, 0.31)

  return {
    alpha: upperBand * 0.62 + crest * 0.75 + lowerBand * 0.2,
    blue: blue * (upperBand + crest * 0.5 + lowerBand * 0.4),
    accent: accent * (upperBand + crest * 0.45 + lowerBand * 0.65),
    white: crest * gaussian(x, 0.47, 0.22) * 0.92,
    offsetX: Math.sin(y * 9 + time * 0.38) * upperBand * 1.2,
    offsetY: Math.sin(x * 8 - time * 0.5) * upperBand * 1.6,
  }
}

const sampleVortex = (x: number, y: number, time: number, aspect: number): DotSample => {
  const dx = (x - 0.51) * aspect
  const dy = y - 0.49
  const radius = Math.hypot(dx, dy)
  const angle = Math.atan2(dy, dx)
  const rotatingAngle = angle - time * 0.28
  const firstArm = 0.31 + Math.sin(rotatingAngle + radius * 4.8) * 0.105
  const secondArm = 0.31 + Math.sin(rotatingAngle + Math.PI + radius * 4.8) * 0.105
  const firstBand = gaussian(radius, firstArm, 0.075)
  const secondBand = gaussian(radius, secondArm, 0.075)
  const broadRing = Math.max(firstBand, secondBand)
  const brightRing = Math.max(
    gaussian(radius, firstArm - 0.018, 0.033),
    gaussian(radius, secondArm - 0.018, 0.033),
  )
  const outerDust = gaussian(radius, 0.48, 0.19) * 0.35
  const centerMask = smoothstep(0.025, 0.095, radius)
  const edgeMask = 1 - smoothstep(0.57, 0.74, radius)
  const colorAngle = Math.atan2(dy, dx) + 0.25
  const accent = clamp((Math.cos(colorAngle) + 1) * 0.5)
  const blue = 1 - accent
  const swirl = (0.1 / Math.max(radius, 0.08)) * broadRing

  return {
    alpha: (broadRing * 0.74 + brightRing * 0.86 + outerDust) * centerMask * edgeMask,
    blue: blue * (broadRing + brightRing * 0.62 + outerDust),
    accent: accent * (broadRing + brightRing * 0.58 + outerDust),
    white: brightRing * 0.52,
    offsetX: -dy * swirl * 22,
    offsetY: dx * swirl * 22,
  }
}

const sampleCollaboration = (x: number, y: number, time: number): DotSample => {
  const cycle = time * ((Math.PI * 2) / 10)
  const centerX = 0.38 + Math.sin(cycle) * 0.008
  const centerY = 0.35 + Math.cos(cycle * 0.82) * 0.006
  const core = gaussian(x, centerX, 0.11) * gaussian(y, centerY, 0.14)
  const upperLeft = gaussian(x, 0.2, 0.14) * gaussian(y, 0.2, 0.13)
  const upperRight = gaussian(x, 0.59, 0.16) * gaussian(y, 0.22, 0.12)
  const sideLeft = gaussian(x, 0.18, 0.16) * gaussian(y, 0.48, 0.16)
  const sideRight = gaussian(x, 0.61, 0.18) * gaussian(y, 0.49, 0.17)
  const spread = upperLeft + upperRight + sideLeft + sideRight
  const pulse = 0.9 + Math.sin(cycle) * 0.1

  return {
    alpha: core * 0.74 * pulse + spread * 0.24,
    blue: core * 0.82 + (upperLeft + sideLeft) * 0.48,
    accent: core * 0.42 + (upperRight + sideRight) * 0.7,
    white: core * 0.08,
    offsetX: (x - centerX) * Math.sin(cycle) * core * 3.2,
    offsetY: (y - centerY) * Math.sin(cycle) * core * 3.2,
  }
}

const sampleDelivery = (x: number, y: number, time: number): DotSample => {
  const cycle = time * ((Math.PI * 2) / 11)
  const curve = 0.38 + Math.sin(x * 3.2 - 0.5) * 0.045
  const band = gaussian(y, curve, 0.105)
  const core = gaussian(y, curve, 0.038)
  const directionalFade = smoothstep(0.04, 0.28, x) * (1 - smoothstep(0.9, 1, x))
  const rightEmphasis = 0.3 + smoothstep(0.18, 0.88, x) * 0.7
  const flowPulse = 0.88 + Math.sin(cycle + x * 2.4) * 0.12

  return {
    alpha: (band * 0.4 + core * 0.58) * directionalFade * rightEmphasis * flowPulse,
    blue: band * (1 - x * 0.62),
    accent: (band + core * 0.42) * (0.3 + x * 0.7),
    white: core * gaussian(x, 0.58, 0.25) * 0.08,
    offsetX: band * (0.7 + Math.sin(cycle + y * 4) * 0.55),
    offsetY: Math.sin(cycle * 0.72 + x * 5) * band * 0.75,
  }
}

const sampleKnowledge = (x: number, y: number, time: number): DotSample => {
  const cycle = time * ((Math.PI * 2) / 11)
  const centerX = 0.62
  const centerY = 0.42
  const core = gaussian(x, centerX, 0.13) * gaussian(y, centerY, 0.16)
  const leftDust = gaussian(x, 0.13, 0.24)
  const rightDust = gaussian(x, 0.9, 0.2)
  const verticalField = gaussian(y, 0.43, 0.34)
  const grain = 0.34 + Math.pow(Math.sin(x * 31 + y * 47), 2) * 0.66
  const scattered = (leftDust + rightDust) * verticalField * grain
  const convergence = 0.5 + 0.5 * Math.sin(cycle)
  const towardCenterX = (centerX - x) * scattered * convergence * 2.1
  const towardCenterY = (centerY - y) * scattered * convergence * 1.35

  return {
    alpha: core * 0.7 + scattered * 0.2,
    blue: core * 0.72 + leftDust * 0.45,
    accent: core * 0.48 + rightDust * 0.38,
    white: scattered * 0.12,
    offsetX: towardCenterX,
    offsetY: towardCenterY,
  }
}

const sampleGovernance = (x: number, y: number, time: number, aspect: number): DotSample => {
  const cycle = time * ((Math.PI * 2) / 11)
  const dx = (x - 0.54) * aspect * 0.72
  const dy = y - 0.36
  const scale = 0.995 + Math.sin(cycle) * 0.025
  const radius = Math.hypot(dx, dy)
  const ring = gaussian(radius, 0.27 * scale, 0.045)
  const softField = gaussian(radius, 0.3, 0.14) * 0.18
  const edgeFade = 1 - smoothstep(0.48, 0.7, radius)
  const angle = Math.atan2(dy, dx)
  const accentMix = (Math.cos(angle - 0.5) + 1) * 0.5

  return {
    alpha: (ring * 0.58 + softField) * edgeFade,
    blue: (1 - accentMix * 0.5) * (ring + softField),
    accent: accentMix * (ring + softField * 0.6),
    white: ring * 0.06,
    offsetX: dx * Math.sin(cycle) * ring * 1.8,
    offsetY: dy * Math.sin(cycle) * ring * 1.8,
  }
}

const addGlow = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  alpha: number,
) => {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius)
  gradient.addColorStop(0, `rgba(${color}, ${alpha})`)
  gradient.addColorStop(0.32, `rgba(${color}, ${alpha * 0.42})`)
  gradient.addColorStop(1, `rgba(${color}, 0)`)
  context.fillStyle = gradient
  context.fillRect(x - radius, y - radius, radius * 2, radius * 2)
}

const paintHomeGlows = (
  context: CanvasRenderingContext2D,
  variant: ParticleFieldVariant,
  width: number,
  height: number,
  time: number,
  activity: number,
) => {
  const phase = VARIANT_PHASES[variant]
  const breath = 0.82 + (Math.sin(time * 0.58 + phase) + 1) * 0.5 * 0.18
  const positions: Record<string, { x: number; y: number; radius: number }> = {
    collaboration: { x: 0.38, y: 0.35, radius: 0.34 },
    delivery: { x: 0.58, y: 0.38, radius: 0.32 },
    knowledge: { x: 0.62, y: 0.42, radius: 0.34 },
    governance: { x: 0.54, y: 0.36, radius: 0.36 },
  }
  const position = positions[variant]
  if (!position) return

  const radius = Math.min(width, height) * (1 + activity * 0.03)
  addGlow(
    context,
    width * position.x,
    height * position.y,
    radius * position.radius,
    HOME_PARTICLE_PALETTE.blue.join(', '),
    0.12 * breath * (1 + activity * 0.1),
  )
  addGlow(
    context,
    width * (position.x + 0.08),
    height * (position.y + 0.03),
    radius * position.radius * 0.7,
    HOME_PARTICLE_PALETTE.cyan.join(', '),
    0.075 * breath * (1 + activity * 0.1),
  )

  if (variant === 'knowledge') {
    addGlow(
      context,
      width * 0.7,
      height * 0.36,
      radius * 0.2,
      HOME_PARTICLE_PALETTE.mint.join(', '),
      0.02 * breath,
    )
  }
}

const paintGlows = (
  context: CanvasRenderingContext2D,
  variant: ParticleFieldVariant,
  width: number,
  height: number,
  time: number,
  activity = 0,
) => {
  context.globalCompositeOperation = 'screen'
  if (HOME_VARIANTS.has(variant)) {
    paintHomeGlows(context, variant, width, height, time, activity)
    context.globalCompositeOperation = 'source-over'
    return
  }
  const phase = VARIANT_PHASES[variant]
  const breath = 0.62 + 0.38 * ((Math.sin(time * 0.72 + phase) + 1) * 0.5)
  const driftX = Math.sin(time * 0.25 + phase) * width * 0.034
  const driftY = Math.cos(time * 0.22 + phase) * height * 0.022

  if (variant === 'ember') {
    addGlow(
      context,
      width * 0.57 + driftX,
      height * 0.18 + driftY,
      width * 0.39,
      PARTICLE_PALETTE.sky.join(', '),
      0.4 * breath,
    )
    addGlow(
      context,
      width * 0.64 + driftX,
      height * 0.05 + driftY,
      width * 0.2,
      PARTICLE_PALETTE.white.join(', '),
      0.25 * breath,
    )
    addGlow(
      context,
      width * 0.18 - driftX * 0.34,
      height * 0.28 - driftY * 0.5,
      width * 0.24,
      PARTICLE_PALETTE.deepBlue.join(', '),
      0.16 * breath,
    )
  } else if (variant === 'horizon') {
    addGlow(
      context,
      width * 0.34 + driftX,
      height * 0.24 + driftY,
      width * 0.35,
      PARTICLE_PALETTE.deepBlue.join(', '),
      0.4 * breath,
    )
    addGlow(
      context,
      width * 0.59 + driftX * 0.58,
      height * 0.22 - driftY * 0.4,
      width * 0.25,
      PARTICLE_PALETTE.white.join(', '),
      0.2 * breath,
    )
    addGlow(
      context,
      width * 0.78 - driftX * 0.4,
      height * 0.31 + driftY * 0.35,
      width * 0.28,
      PARTICLE_PALETTE.mint.join(', '),
      0.22 * breath,
    )
  } else if (variant === 'ribbon') {
    addGlow(
      context,
      width * 0.25 + driftX,
      height * 0.28 + driftY,
      width * 0.32,
      PARTICLE_PALETTE.deepBlue.join(', '),
      0.42 * breath,
    )
    addGlow(
      context,
      width * 0.52 + driftX * 0.45,
      height * 0.2 - driftY * 0.4,
      width * 0.24,
      PARTICLE_PALETTE.aqua.join(', '),
      0.26 * breath,
    )
    addGlow(
      context,
      width * 0.66 - driftX * 0.48,
      height * 0.42 + driftY * 0.3,
      width * 0.31,
      PARTICLE_PALETTE.mint.join(', '),
      0.24 * breath,
    )
  } else {
    const centerX = width * 0.51
    const centerY = height * 0.49
    const radius = Math.min(width, height)
    addGlow(
      context,
      centerX - radius * 0.2 + driftX * 0.35,
      centerY - radius * 0.12 + driftY * 0.35,
      radius * 0.52,
      PARTICLE_PALETTE.deepBlue.join(', '),
      0.48 * breath,
    )
    addGlow(
      context,
      centerX + radius * 0.22 - driftX * 0.32,
      centerY + radius * 0.1 - driftY * 0.25,
      radius * 0.5,
      PARTICLE_PALETTE.mint.join(', '),
      0.42 * breath,
    )
    addGlow(
      context,
      centerX + driftX * 0.12,
      centerY + driftY * 0.12,
      radius * 0.22,
      PARTICLE_PALETTE.aqua.join(', '),
      0.3 * breath,
    )
  }

  context.globalCompositeOperation = 'source-over'
}

export const useParticleField = ({
  canvas,
  variant,
  interactive,
  active,
}: ParticleFieldOptions) => {
  let context: CanvasRenderingContext2D | null = null
  let frame = 0
  let closingScrollFrame = 0
  let lastFrameTime = 0
  let lastClosingDrawTime = 0
  let elapsedTime = 0
  let resizeObserver: ResizeObserver | null = null
  let visibilityObserver: IntersectionObserver | null = null
  let isVisible = true
  let isPageVisible = true
  let isMobile = false
  let reducedMotion = false
  let activityAmount = 0
  let size: CanvasSize = { width: 0, height: 0, pixelRatio: 1 }
  const pointer: PointerPosition = { x: 0, y: 0, targetX: 0, targetY: 0 }
  const isHomeVariant = HOME_VARIANTS.has(variant)

  // The closing preset is scroll-bound: it converges below the CTA, then fades before the footer content.
  interface ClosingParticle {
    sx: number
    sy: number
    tx: number
    ty: number
    size: number
    alpha: number
    phase: number
    driftSpeed: number
    driftX: number
    driftY: number
    breatheSpeed: number
    color: string
  }

  let closingParticles: ClosingParticle[] = []
  let closingProgress = 0
  let closingFade = 0
  let closingFocus = { x: 0, y: 0 }

  const pickClosingColor = () => {
    const roll = Math.random()
    if (roll < 0.55) return '130, 185, 235'
    if (roll < 0.85) return '55, 199, 232'
    if (roll < 0.95) return '85, 214, 174'
    return '225, 240, 255'
  }

  const buildClosingParticles = () => {
    const section = canvas.value?.closest('section')
    const sectionRect = section?.getBoundingClientRect()
    const copyRect = section?.querySelector('.cta-inner')?.getBoundingClientRect()
    closingFocus = {
      x:
        copyRect && sectionRect
          ? copyRect.left - sectionRect.left + copyRect.width / 2
          : size.width / 2,
      y:
        copyRect && sectionRect
          ? copyRect.top - sectionRect.top + copyRect.height / 2
          : size.height / 2,
    }
    const targetRadiusX = Math.min(size.width * 0.24, 340)
    const targetRadiusY = Math.min(size.height * 0.24, 112)
    const edgeOffset = Math.max(24, Math.min(size.width, size.height) * 0.08)
    const count = size.width < 768 ? 56 : size.width < 1100 ? 90 : 120
    closingParticles = Array.from({ length: count }, (_, index) => {
      const side = index % 4
      const targetAngle = Math.random() * Math.PI * 2
      const targetDistance = Math.sqrt(Math.random())
      const targetX = closingFocus.x + Math.cos(targetAngle) * targetRadiusX * targetDistance
      const targetY = closingFocus.y + Math.sin(targetAngle) * targetRadiusY * targetDistance
      let startX = Math.random() * size.width
      let startY = -edgeOffset * (0.35 + Math.random() * 0.65)

      if (side === 1) {
        startX = size.width + edgeOffset * (0.35 + Math.random() * 0.65)
        startY = Math.random() * size.height
      } else if (side === 2) {
        startX = Math.random() * size.width
        startY = size.height + edgeOffset * (0.35 + Math.random() * 0.65)
      } else if (side === 3) {
        startX = -edgeOffset * (0.35 + Math.random() * 0.65)
        startY = Math.random() * size.height
      }

      return {
        sx: startX,
        sy: startY,
        tx: targetX,
        ty: targetY,
        size: 0.95 + Math.random() * 0.85,
        alpha: 0.38 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        driftSpeed: 0.12 + Math.random() * 0.18,
        driftX: 0.8 + Math.random() * 1.2,
        driftY: 0.8 + Math.random() * 1.2,
        breatheSpeed: 0.35 + Math.random() * 0.55,
        color: pickClosingColor(),
      }
    })
    if (canvas.value) canvas.value.dataset.particleCount = `${count}`
  }

  const updateClosingLayoutState = () => {
    const section = canvas.value?.closest('section')
    if (section) {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const startTop = viewportHeight * 0.95
      const focusTop = (viewportHeight - rect.height) / 2
      const travel = startTop - focusTop
      closingProgress = clamp((startTop - rect.top) / Math.max(travel, 1))

      const footerInner = document.querySelector<HTMLElement>('.footer-inner')
      const footerContentTop = footerInner?.getBoundingClientRect().top ?? viewportHeight
      closingFade = 1 - smoothstep(viewportHeight * 0.7, viewportHeight * 0.85, footerContentTop)
    }
    if (canvas.value) canvas.value.dataset.scrollProgress = closingProgress.toFixed(3)
  }

  const drawClosing = (time: number) => {
    if (!context || size.width === 0 || size.height === 0) return

    context.setTransform(size.pixelRatio, 0, 0, size.pixelRatio, 0, 0)
    context.clearRect(0, 0, size.width, size.height)

    const convergence = smoothstep(0, 1, closingProgress)
    const entryVisibility = smoothstep(0.02, 0.2, closingProgress)
    const fieldAlpha = entryVisibility * (1 - closingFade)

    if (fieldAlpha > 0.01) {
      const glowRadius = Math.min(size.width * 0.28, 380)
      const glow = context.createRadialGradient(
        closingFocus.x,
        closingFocus.y,
        0,
        closingFocus.x,
        closingFocus.y,
        glowRadius,
      )
      glow.addColorStop(0, `rgba(62, 141, 255, ${0.13 * fieldAlpha})`)
      glow.addColorStop(0.42, `rgba(55, 199, 232, ${0.065 * fieldAlpha})`)
      glow.addColorStop(1, 'rgba(55, 199, 232, 0)')
      context.fillStyle = glow
      context.fillRect(
        closingFocus.x - glowRadius,
        closingFocus.y - glowRadius,
        glowRadius * 2,
        glowRadius * 2,
      )
    }

    for (const particle of closingParticles) {
      const driftScale = reducedMotion ? 0 : 1
      const driftX =
        Math.sin(time * particle.driftSpeed + particle.phase) * particle.driftX * driftScale
      const driftY =
        Math.cos(time * particle.driftSpeed * 0.83 + particle.phase * 1.37) *
        particle.driftY *
        driftScale
      const breath = reducedMotion
        ? 0.82
        : 0.86 + Math.sin(time * particle.breatheSpeed + particle.phase) * 0.14
      const x = particle.sx + (particle.tx - particle.sx) * convergence + driftX
      const y = particle.sy + (particle.ty - particle.sy) * convergence + driftY
      const radius = particle.size * (0.84 + convergence * 0.16) * (0.92 + breath * 0.08)
      const alpha = particle.alpha * fieldAlpha * breath * (reducedMotion ? 0.55 : 1)
      if (alpha < 0.008) continue

      if (!reducedMotion) {
        const directionX = particle.tx - particle.sx
        const directionY = particle.ty - particle.sy
        const distance = Math.max(Math.hypot(directionX, directionY), 1)
        const trailLength = 2 + (1 - convergence) * 6
        context.strokeStyle = `rgba(${particle.color}, ${alpha * 0.34})`
        context.lineWidth = Math.max(0.5, radius * 0.65)
        context.beginPath()
        context.moveTo(x, y)
        context.lineTo(
          x - (directionX / distance) * trailLength,
          y - (directionY / distance) * trailLength,
        )
        context.stroke()
      }

      context.fillStyle = `rgba(${particle.color}, ${alpha})`
      context.beginPath()
      context.arc(x, y, radius, 0, Math.PI * 2)
      context.fill()
    }
  }

  const resize = () => {
    const element = canvas.value
    if (!element) return

    const bounds = element.getBoundingClientRect()
    const cssWidth = element.clientWidth || bounds.width
    const cssHeight = element.clientHeight || bounds.height
    const pixelRatio =
      variant === 'closing'
        ? Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.25)
        : Math.min(window.devicePixelRatio || 1, 2)
    size = { width: cssWidth, height: cssHeight, pixelRatio }
    element.width = Math.max(1, Math.round(cssWidth * pixelRatio))
    element.height = Math.max(1, Math.round(cssHeight * pixelRatio))
    element.dataset.cssWidth = `${Math.round(cssWidth)}`
    element.dataset.cssHeight = `${Math.round(cssHeight)}`
    element.dataset.pixelRatio = `${pixelRatio}`
    element.dataset.renderWidth = `${element.width}`
    element.dataset.renderHeight = `${element.height}`
    context = element.getContext('2d', { alpha: true })
    context?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    if (variant === 'closing') {
      buildClosingParticles()
      updateClosingLayoutState()
      drawClosing(elapsedTime)
    }
  }

  const getSample = (x: number, y: number, time: number): DotSample => {
    if (variant === 'collaboration') return sampleCollaboration(x, y, time)
    if (variant === 'delivery') return sampleDelivery(x, y, time)
    if (variant === 'knowledge') return sampleKnowledge(x, y, time)
    if (variant === 'governance') {
      return sampleGovernance(x, y, time, size.width / Math.max(size.height, 1))
    }
    if (variant === 'ember') return sampleEmber(x, y, time)
    if (variant === 'horizon') return sampleHorizon(x, y, time)
    if (variant === 'ribbon') return sampleRibbon(x, y, time)
    return sampleVortex(x, y, time, size.width / Math.max(size.height, 1))
  }

  const draw = (time: number) => {
    if (!context || size.width === 0 || size.height === 0) return

    if (variant === 'closing') {
      drawClosing(time)
      return
    }

    pointer.x += (pointer.targetX - pointer.x) * 0.045
    pointer.y += (pointer.targetY - pointer.y) * 0.045

    context.setTransform(size.pixelRatio, 0, 0, size.pixelRatio, 0, 0)
    context.fillStyle = isHomeVariant
      ? HOME_PARTICLE_PALETTE.background
      : PARTICLE_PALETTE.background
    context.fillRect(0, 0, size.width, size.height)
    paintGlows(context, variant, size.width, size.height, time, activityAmount)

    const baseSpacing = size.width < 420 ? 5.8 : 6.8
    const density = isHomeVariant ? 0.72 * (isMobile ? 0.52 : 1) : 1
    const spacing = baseSpacing / Math.sqrt(density)
    const columns = Math.ceil(size.width / spacing) + 2
    const rows = Math.ceil(size.height / spacing) + 2
    const parallaxX = interactive ? pointer.x * 5 : 0
    const parallaxY = interactive ? pointer.y * 4 : 0
    const phase = VARIANT_PHASES[variant]

    context.globalCompositeOperation = 'screen'
    for (let row = -1; row < rows; row += 1) {
      const y = row * spacing
      const normalizedY = y / size.height
      for (let column = -1; column < columns; column += 1) {
        const x = column * spacing
        const normalizedX = x / size.width
        const sample = getSample(normalizedX, normalizedY, time)
        if (sample.alpha < 0.02) continue

        const shimmer = 0.8 + Math.sin(column * 0.42 + row * 0.3 + time * 0.68 + phase) * 0.15
        const bloomCenterX = 0.5 + Math.sin(time * 0.29 + phase + normalizedY * 1.8) * 0.27
        const bloomCenterY = 0.46 + Math.cos(time * 0.23 + phase + normalizedX * 1.4) * 0.2
        const localBloom =
          gaussian(normalizedX, bloomCenterX, 0.19) * gaussian(normalizedY, bloomCenterY, 0.22)
        const edgeDistance = Math.min(normalizedX, 1 - normalizedX, normalizedY, 1 - normalizedY)
        const edgeFade = 0.34 + 0.66 * smoothstep(0.015, 0.19, edgeDistance)
        const particleBreath =
          0.72 +
          Math.sin(time * 0.62 + normalizedX * 3 + normalizedY * 2 + phase) * 0.14 +
          localBloom * 0.32
        const alpha = clamp(
          sample.alpha *
            shimmer *
            edgeFade *
            particleBreath *
            (isHomeVariant ? 0.58 : 0.76) *
            (1 + activityAmount * 0.1),
          0,
          isHomeVariant ? 0.72 : 0.78,
        )
        const dotSize = isHomeVariant
          ? Math.min(3, 0.7 + alpha * 1.9 + sample.white * 0.35)
          : 0.3 + alpha * 0.62
        const particleColor = isHomeVariant
          ? homeColorChannel(variant, sample.blue, sample.accent, sample.white)
          : colorChannel(sample.blue, sample.accent, sample.white)
        context.fillStyle = `rgba(${particleColor}, ${alpha})`
        context.fillRect(
          x + sample.offsetX + parallaxX * sample.alpha,
          y + sample.offsetY + parallaxY * sample.alpha,
          dotSize,
          dotSize,
        )
      }
    }

    context.globalCompositeOperation = 'source-over'

    const vignettePulse = 0.72 + 0.28 * ((Math.sin(time * 0.48 + phase) + 1) * 0.5)

    const vignetteCenter =
      variant === 'collaboration'
        ? [0.38, 0.35]
        : variant === 'delivery'
          ? [0.58, 0.38]
          : variant === 'knowledge'
            ? [0.62, 0.42]
            : variant === 'governance'
              ? [0.54, 0.36]
              : [0.5, 0.45]
    const vignette = context.createRadialGradient(
      size.width * vignetteCenter[0],
      size.height * vignetteCenter[1],
      Math.min(size.width, size.height) * 0.12,
      size.width * vignetteCenter[0],
      size.height * vignetteCenter[1],
      Math.max(size.width, size.height) * 0.72,
    )
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
    vignette.addColorStop(0.63, `rgba(0, 0, 0, ${(isHomeVariant ? 0.05 : 0.08) * vignettePulse})`)
    vignette.addColorStop(1, `rgba(0, 0, 0, ${(isHomeVariant ? 0.68 : 0.75) * vignettePulse})`)
    context.fillStyle = vignette
    context.fillRect(0, 0, size.width, size.height)
  }

  const animate = (timestamp: number) => {
    const delta = lastFrameTime === 0 ? 0 : Math.min(timestamp - lastFrameTime, 50)
    lastFrameTime = timestamp

    if (variant === 'closing') {
      if (isVisible && isPageVisible) {
        elapsedTime += delta / 1000
        const shouldDraw = lastClosingDrawTime === 0 || timestamp - lastClosingDrawTime >= 1000 / 45
        if (shouldDraw) {
          lastClosingDrawTime = timestamp
          drawClosing(elapsedTime)
        }
      }
      canvas.value?.setAttribute(
        'data-animation-state',
        reducedMotion ? 'reduced-motion' : 'running',
      )
      if (!reducedMotion && isVisible && isPageVisible) {
        frame = window.requestAnimationFrame(animate)
      } else frame = 0
      return
    }

    if (isVisible && isPageVisible) {
      const activityTarget = active.value ? 1 : 0
      activityAmount += (activityTarget - activityAmount) * Math.min(1, delta / 700)
      elapsedTime += (delta / 1000) * (1 + activityAmount * 0.1)
      draw(elapsedTime)
    }
    if (!reducedMotion && isVisible && isPageVisible) {
      frame = window.requestAnimationFrame(animate)
    } else {
      frame = 0
    }
  }

  const startAnimation = () => {
    const element = canvas.value
    if (reducedMotion || frame || !isVisible || !isPageVisible) return
    lastFrameTime = 0
    element?.setAttribute('data-animation-state', 'running')
    frame = window.requestAnimationFrame(animate)
  }

  const handleClosingScroll = () => {
    if (variant !== 'closing' || !isVisible || !isPageVisible) return
    if (closingScrollFrame) return
    closingScrollFrame = window.requestAnimationFrame(() => {
      closingScrollFrame = 0
      updateClosingLayoutState()
      if (reducedMotion) drawClosing(elapsedTime)
      else startAnimation()
    })
  }

  const stopAnimation = () => {
    const element = canvas.value
    if (frame) window.cancelAnimationFrame(frame)
    frame = 0
    lastClosingDrawTime = 0
    element?.setAttribute('data-animation-state', reducedMotion ? 'reduced-motion' : 'paused')
  }

  const handlePointerMove = (event: PointerEvent) => {
    const element = canvas.value
    if (!element) return
    const bounds = element.getBoundingClientRect()
    pointer.targetX = (event.clientX - bounds.left) / bounds.width - 0.5
    pointer.targetY = (event.clientY - bounds.top) / bounds.height - 0.5
  }

  const handlePointerLeave = () => {
    pointer.targetX = 0
    pointer.targetY = 0
  }

  const handleDocumentVisibility = () => {
    isPageVisible = !document.hidden
    if (isPageVisible) {
      if (variant === 'closing') handleClosingScroll()
      else startAnimation()
    } else stopAnimation()
  }

  onMounted(() => {
    const element = canvas.value
    if (!element) return

    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    isMobile = window.matchMedia('(max-width: 767px)').matches
    isPageVisible = !document.hidden
    resize()
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(element)
    visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true
      if (isVisible) {
        if (variant === 'closing') updateClosingLayoutState()
        draw(elapsedTime)
        startAnimation()
      } else {
        stopAnimation()
      }
    })
    visibilityObserver.observe(element)
    if (interactive && !isMobile) {
      element.addEventListener('pointermove', handlePointerMove)
      element.addEventListener('pointerleave', handlePointerLeave)
    }
    if (variant === 'closing')
      window.addEventListener('scroll', handleClosingScroll, { passive: true })
    document.addEventListener('visibilitychange', handleDocumentVisibility)

    draw(0)
    if (reducedMotion) element.dataset.animationState = 'reduced-motion'
    else startAnimation()
  })

  onBeforeUnmount(() => {
    const element = canvas.value
    stopAnimation()
    if (closingScrollFrame) window.cancelAnimationFrame(closingScrollFrame)
    resizeObserver?.disconnect()
    visibilityObserver?.disconnect()
    element?.removeEventListener('pointermove', handlePointerMove)
    element?.removeEventListener('pointerleave', handlePointerLeave)
    window.removeEventListener('scroll', handleClosingScroll)
    document.removeEventListener('visibilitychange', handleDocumentVisibility)
  })
}
