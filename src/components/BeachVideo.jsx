import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

// Packed clips: left half = picture (grayscale), right half = alpha matte. beach-out is beach-in reversed.
const CLIPS = { in: '/assets/beach-in.mp4', out: '/assets/beach-out.mp4' }
// Where the clip sits in the 896x1200 photo space shared with the portrait photos (measured from frame 0)
const PHOTO_W = 896
const PHOTO_H = 1200
const CLIP_W = 720
const CLIP_H = 1280
const PLACE = { scale: 0.9407, x: 111.6, y: 1.3 }

const VERT = `attribute vec2 a_pos; attribute vec2 a_uv; varying vec2 v_uv;
void main() { v_uv = a_uv; gl_Position = vec4(a_pos, 0.0, 1.0); }`
const FRAG = `precision mediump float; varying vec2 v_uv; uniform sampler2D u_tex; uniform float u_texel;
void main() {
  float u = clamp(v_uv.x, 0.0, 1.0) * 0.5;
  float color = texture2D(u_tex, vec2(min(u, 0.5 - u_texel), v_uv.y)).r;
  float alpha = texture2D(u_tex, vec2(max(u + 0.5, 0.5 + u_texel), v_uv.y)).r;
  gl_FragColor = vec4(vec3(color) * alpha, alpha);
}`

function setupGL(canvas) {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false })
  if (!gl) return null
  const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s }
  const prog = gl.createProgram()
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  gl.useProgram(prog)
  // Clip quad in photo space -> clip space
  const x0 = PLACE.x, y0 = PLACE.y, x1 = PLACE.x + CLIP_W * PLACE.scale, y1 = PLACE.y + CLIP_H * PLACE.scale
  const nx = (x) => (x / PHOTO_W) * 2 - 1
  const ny = (y) => 1 - (y / PHOTO_H) * 2
  const data = new Float32Array([nx(x0), ny(y0), 0, 0, nx(x1), ny(y0), 1, 0, nx(x0), ny(y1), 0, 1, nx(x1), ny(y1), 1, 1])
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  const pos = gl.getAttribLocation(prog, 'a_pos')
  const uv = gl.getAttribLocation(prog, 'a_uv')
  gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 16, 0)
  gl.enableVertexAttribArray(uv); gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 16, 8)
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return { gl, texel: gl.getUniformLocation(prog, 'u_texel') }
}

// Draws the beach clip with transparency. Controlled by the parent through the ref:
// show('in-start' | 'in-end'), play('in' | 'out', fromSeconds) -> Promise resolved when the clip ends.
const BeachVideo = forwardRef(function BeachVideo(props, ref) {
  const canvasRef = useRef(null)
  const videos = useRef({})
  const state = useRef({ gl: null, active: 'in', raf: 0, playing: false })

  const draw = () => {
    const s = state.current
    const video = videos.current[s.active]
    if (!s.gl || !video || video.readyState < 2) return
    const { gl, texel } = s.gl
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, video)
    gl.uniform1f(texel, 1 / video.videoWidth)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  const loop = () => {
    draw()
    if (state.current.playing) state.current.raf = window.requestAnimationFrame(loop)
  }

  const seek = (name, time) => new Promise((resolve) => {
    const video = videos.current[name]
    state.current.active = name
    const done = () => { draw(); resolve() }
    const go = () => {
      if (video.readyState >= 2 && Math.abs(video.currentTime - time) < 0.01) return done()
      video.addEventListener('seeked', done, { once: true })
      video.currentTime = time
    }
    // Wait until the clip has loaded enough to seek
    if (video.readyState >= 1) go()
    else video.addEventListener('loadedmetadata', go, { once: true })
  })

  useImperativeHandle(ref, () => ({
    duration: () => videos.current.in?.duration || 6,
    position: () => {
      const v = videos.current[state.current.active]
      return { clip: state.current.active, time: v ? v.currentTime : 0 }
    },
    stop: () => {
      state.current.playing = false
      window.cancelAnimationFrame(state.current.raf)
      Object.values(videos.current).forEach((v) => v.pause())
    },
    show: async (frame) => {
      const v = videos.current.in
      await seek('in', frame === 'in-end' ? Math.max(0, (v.duration || 6) - 0.02) : 0)
    },
    play: async (name, from = 0) => {
      const video = videos.current[name]
      Object.values(videos.current).forEach((v) => v !== video && v.pause())
      await seek(name, from)
      state.current.playing = true
      window.cancelAnimationFrame(state.current.raf)
      state.current.raf = window.requestAnimationFrame(loop)
      await new Promise((resolve) => {
        video.onended = () => resolve()
        video.play().catch(() => resolve())
      })
      state.current.playing = false
      draw()
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = PHOTO_W
    canvas.height = PHOTO_H
    state.current.gl = setupGL(canvas)
    const make = (src) => {
      const v = document.createElement('video')
      v.src = src
      v.muted = true
      v.playsInline = true
      v.preload = 'auto'
      v.loop = false
      v.addEventListener('loadeddata', () => { if (state.current.active === v.dataset.clip) draw() })
      return v
    }
    videos.current = { in: make(CLIPS.in), out: make(CLIPS.out) }
    videos.current.in.dataset.clip = 'in'
    videos.current.out.dataset.clip = 'out'
    return () => {
      window.cancelAnimationFrame(state.current.raf)
      Object.values(videos.current).forEach((v) => { v.pause(); v.removeAttribute('src'); v.load() })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <canvas ref={canvasRef} className="portrait-photo portrait-video" aria-hidden="true" {...props} />
})

export default BeachVideo
