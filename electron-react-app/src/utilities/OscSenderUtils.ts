import { NormalizationUtils } from './NormalizationUtils'
import { OscBrowserClient } from './OscBrowserClient'

// Point at your OSC-to-WebSocket proxy
const osc = new OscBrowserClient('ws://localhost:4042')

export class OscSenderUtils {
  private static clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v))
  }
  private static scaleAndClamp(v: number, mul: number) {
    return OscSenderUtils.clamp(v * mul, -1, 1)
  }
  private static scaleOffsetAndClamp(v: number, offset: number, mul: number) {
    return OscSenderUtils.clamp((v - offset) * mul, -1, 1)
  }
  private static calculateOffsetFraction(pitchOffset: number) {
    if (!pitchOffset) return 0
    return (
      (2 * pitchOffset) /
      (NormalizationUtils.maxPosTheta1 + Math.abs(NormalizationUtils.maxNegTheta1))
    )
  }

  /* ===== Native Tracking ===== */

  static sendNativeCombinedPitchYaw(
    data: { theta1: number; theta2: number },
    pitchOffset: number,
    verticalExaggeration: number,
    horizontalExaggeration: number
  ) {
    const y = (data.theta1 - pitchOffset) * verticalExaggeration
    const x = data.theta2 * horizontalExaggeration
    osc.send('/avatar/eye/native/combined', [y, x])
  }

  static sendNativeIndependentPitchYaw(
    data: {
      leftTheta1: number
      leftTheta2: number
      rightTheta1: number
      rightTheta2: number
    },
    pitchOffset: number,
    verticalExaggeration: number,
    horizontalExaggeration: number
  ) {
    const ly = (data.leftTheta1 - pitchOffset) * verticalExaggeration
    const lx = data.leftTheta2 * horizontalExaggeration
    const ry = (data.rightTheta1 - pitchOffset) * verticalExaggeration
    const rx = data.rightTheta2 * horizontalExaggeration
    osc.send('/avatar/eye/native/independent', [ly, lx, ry, rx])
  }

  static sendNativeEyeOpenness(openness: number, neutralValue: number) {
    const inv = 1 - openness
    let closed = inv <= 0.25
      ? neutralValue * (inv / 0.25)
      : neutralValue + (1 - neutralValue) * ((inv - 0.25) / 0.75)
    closed = OscSenderUtils.clamp(closed, 0, 1)
    osc.send('/avatar/eye/native/openness', [closed])
  }

  /* ===== VRCFaceTracking V1 ===== */

  static sendVrcftV1CombinedPitchYaw(
    data: { theta1: number; theta2: number },
    pitchOffset: number,
    verticalExaggeration: number,
    horizontalExaggeration: number
  ) {
    const n1 = NormalizationUtils.normalizeTheta1(data.theta1)
    const n2 = NormalizationUtils.normalizeTheta2(data.theta2)
    const off = OscSenderUtils.calculateOffsetFraction(pitchOffset)
    const y = OscSenderUtils.scaleOffsetAndClamp(n1, off, verticalExaggeration)
    const x = OscSenderUtils.scaleAndClamp(n2, horizontalExaggeration)

    osc.send('/avatar/parameters/LeftEyeX', [x])
    osc.send('/avatar/parameters/RightEyeX', [x])
    osc.send('/avatar/parameters/EyesY', [-y])
  }

  static sendVrcftV1IndependentPitchYaw(
    data: {
      leftTheta1: number
      leftTheta2: number
      rightTheta1: number
      rightTheta2: number
    },
    pitchOffset: number,
    verticalExaggeration: number,
    horizontalExaggeration: number
  ) {
    const nl1 = NormalizationUtils.normalizeTheta1(data.leftTheta1)
    const nl2 = NormalizationUtils.normalizeTheta2(data.leftTheta2)
    const nr2 = NormalizationUtils.normalizeTheta2(data.rightTheta2)
    const off = OscSenderUtils.calculateOffsetFraction(pitchOffset)

    const y = OscSenderUtils.scaleOffsetAndClamp(nl1, off, verticalExaggeration)
    const lx = OscSenderUtils.scaleAndClamp(nl2, horizontalExaggeration)
    const rx = OscSenderUtils.scaleAndClamp(nr2, horizontalExaggeration)

    osc.send('/avatar/parameters/LeftEyeX', [lx])
    osc.send('/avatar/parameters/RightEyeX', [rx])
    osc.send('/avatar/parameters/EyesY', [-y])
  }

  static sendVrcftV1CombinedOpenness(openness: number) {
    osc.send('/avatar/parameters/CombinedEyeLid', [openness])
  }

  static sendVrcftV1IndependentOpenness(data: {
    leftOpenness: number
    rightOpenness: number
  }) {
    osc.send('/avatar/parameters/LeftEyeLid', [data.leftOpenness])
    osc.send('/avatar/parameters/RightEyeLid', [data.rightOpenness])
  }

  /* ===== VRCFaceTracking V2 ===== */

  private static getV2Prefix(prefix: string) {
    const clean = prefix.replace(/^\/+|\/+$/g, '')
    return clean
      ? `/avatar/parameters/${clean}/v2/`
      : `/avatar/parameters/v2/`
  }

  static sendVrcftV2CombinedPitchYaw(
    data: { theta1: number; theta2: number },
    pitchOffset: number,
    verticalExaggeration: number,
    horizontalExaggeration: number,
    oscPrefix: string,
    splitY: boolean
  ) {
    const n1 = NormalizationUtils.normalizeTheta1(data.theta1)
    const n2 = NormalizationUtils.normalizeTheta2(data.theta2)
    const off = OscSenderUtils.calculateOffsetFraction(pitchOffset)
    const y = OscSenderUtils.scaleOffsetAndClamp(n1, off, verticalExaggeration)
    const x = OscSenderUtils.scaleAndClamp(n2, horizontalExaggeration)
    const p = OscSenderUtils.getV2Prefix(oscPrefix)

    if (splitY) {
      osc.send(p + 'EyeLeftX', [x])
      osc.send(p + 'EyeLeftY', [-y])
      osc.send(p + 'EyeRightX', [x])
      osc.send(p + 'EyeRightY', [-y])
    } else {
      osc.send(p + 'EyeLeftX', [x])
      osc.send(p + 'EyeRightX', [x])
      osc.send(p + 'EyeY', [-y])
    }
  }

  static sendVrcftV2IndependentPitchYaw(
    data: {
      leftTheta1: number
      leftTheta2: number
      rightTheta1: number
      rightTheta2: number
    },
    pitchOffset: number,
    verticalExaggeration: number,
    horizontalExaggeration: number,
    oscPrefix: string,
    splitY: boolean
  ) {
    const nl1 = NormalizationUtils.normalizeTheta1(data.leftTheta1)
    const nr1 = NormalizationUtils.normalizeTheta1(data.rightTheta1)
    const nl2 = NormalizationUtils.normalizeTheta2(data.leftTheta2)
    const nr2 = NormalizationUtils.normalizeTheta2(data.rightTheta2)
    const off = OscSenderUtils.calculateOffsetFraction(pitchOffset)

    const ly = OscSenderUtils.scaleOffsetAndClamp(nl1, off, verticalExaggeration)
    const ry = OscSenderUtils.scaleOffsetAndClamp(nr1, off, verticalExaggeration)
    const lx = OscSenderUtils.scaleAndClamp(nl2, horizontalExaggeration)
    const rx = OscSenderUtils.scaleAndClamp(nr2, horizontalExaggeration)
    const p = OscSenderUtils.getV2Prefix(oscPrefix)

    if (splitY) {
      osc.send(p + 'EyeLeftX', [lx])
      osc.send(p + 'EyeRightX', [rx])
      osc.send(p + 'EyeLeftY', [-ly])
      osc.send(p + 'EyeRightY', [-ry])
    } else {
      osc.send(p + 'EyeLeftX', [lx])
      osc.send(p + 'EyeRightX', [rx])
      osc.send(p + 'EyeY', [-ly])
    }
  }

  static sendVrcftV2CombinedOpenness(openness: number, oscPrefix: string) {
    const p = OscSenderUtils.getV2Prefix(oscPrefix)
    osc.send(p + 'EyeLidLeft', [openness])
    osc.send(p + 'EyeLidRight', [openness])
  }

  static sendVrcftV2IndependentOpenness(
    data: { leftOpenness: number; rightOpenness: number },
    oscPrefix: string
  ) {
    const p = OscSenderUtils.getV2Prefix(oscPrefix)
    osc.send(p + 'EyeLidLeft', [data.leftOpenness])
    osc.send(p + 'EyeLidRight', [data.rightOpenness])
  }
}
