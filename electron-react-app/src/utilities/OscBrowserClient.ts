/**
 * Sends OSC messages over a WebSocket.
 * Your WebSocket server must forward binary OSC packets to a real OSC/UDP endpoint.
 */
export class OscBrowserClient {
  private socket: WebSocket

  /**
   * @param url   WebSocket URL, e.g. "ws://localhost:8080"
   */
  constructor(url: string) {
    this.socket = new WebSocket(url)
    this.socket.binaryType = 'arraybuffer'
    this.socket.onopen = () => console.log('[OSC] WS open')
    this.socket.onclose = () => console.log('[OSC] WS closed')
    this.socket.onerror = (e) => console.error('[OSC] WS error', e)
  }

  /**
   * Send an OSC message with given address and float arguments.
   */
  send(address: string, args: number[]) {
    if (this.socket.readyState !== WebSocket.OPEN) {
      console.warn('[OSC] socket not open yet')
      return
    }
    const msg = this.buildMessage(address, args)
    this.socket.send(msg)
  }

  /** Build a binary OSC packet: address, type tags, then 32-bit BE floats */
  private buildMessage(address: string, args: number[]): ArrayBuffer {
    const textEncoder = new TextEncoder()
    // address + null terminator
    const addrBytes = Array.from(textEncoder.encode(address + '\0'))
    // type tag: comma + one 'f' per float, plus null
    const tagBytes = Array.from(textEncoder.encode(',' + 'f'.repeat(args.length) + '\0'))

    // pad helper: 4-byte align
    const padTo4 = (arr: number[]) => {
      const pad = (4 - (arr.length % 4)) % 4
      return arr.concat(new Array(pad).fill(0))
    }

    const header = new Uint8Array([
      ...padTo4(addrBytes),
      ...padTo4(tagBytes),
    ])

    // float arguments
    const floatBuf = new ArrayBuffer(4 * args.length)
    const dv = new DataView(floatBuf)
    args.forEach((v, i) => dv.setFloat32(i * 4, v, false))

    // concatenate header + floats
    const out = new Uint8Array(header.byteLength + floatBuf.byteLength)
    out.set(header, 0)
    out.set(new Uint8Array(floatBuf), header.byteLength)
    return out.buffer
  }
}
