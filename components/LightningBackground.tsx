import React, { useRef, useEffect } from 'react';

export interface LightningProps {
  /** Hue of the lightning in degrees (0-360). Default 42 for Golden Amber */
  hue?: number;
  /** Horizontal offset of the effect */
  xOffset?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Visual intensity/brightness multiplier */
  intensity?: number;
  /** Scale/complexity of the noise pattern */
  size?: number;
  /** Optional className for the canvas container */
  className?: string;
}

export const Lightning: React.FC<LightningProps> = ({ 
  hue = 42, 
  xOffset = 0, 
  speed = 0.75, 
  intensity = 1.1, 
  size = 0.85,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      
      #define OCTAVE_COUNT 8

      vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash11(float p) {
          p = fract(p * .1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
      }

      float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));
          
          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
              value += amplitude * noise(p);
              p *= rotate2d(0.45);
              p *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }

      void main() {
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          uv = 2.0 * uv - 1.0;
          uv.x *= iResolution.x / iResolution.y;
          uv.x += uXOffset;
          
          float time = iTime * uSpeed;
          
          // Warp UV coordinates with FBM for lightning shape
          uv += 2.0 * fbm(uv * uSize + 0.8 * time) - 1.0;
          
          float dist = abs(uv.x);
          
          // Color based on golden hue (42 deg) and flickering
          vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.85, 0.95));
          
          // Flickering effect
          float flicker = mix(0.0, 0.06, hash11(time));
          
          // Core discharge effect
          vec3 col = baseColor * (flicker / max(dist, 0.002)) * uIntensity;
          
          // Glow and falloff
          col = pow(col, vec3(1.15));
          
          gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      iTime: gl.getUniformLocation(program, 'iTime'),
      uHue: gl.getUniformLocation(program, 'uHue'),
      uXOffset: gl.getUniformLocation(program, 'uXOffset'),
      uSpeed: gl.getUniformLocation(program, 'uSpeed'),
      uIntensity: gl.getUniformLocation(program, 'uIntensity'),
      uSize: gl.getUniformLocation(program, 'uSize'),
    };

    const startTime = performance.now();
    let animationFrameId: number;

    const render = () => {
      resizeCanvas();
      
      gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
      const currentTime = performance.now();
      gl.uniform1f(uniforms.iTime, (currentTime - startTime) / 1000.0);
      gl.uniform1f(uniforms.uHue, hue);
      gl.uniform1f(uniforms.uXOffset, xOffset);
      gl.uniform1f(uniforms.uSpeed, speed);
      gl.uniform1f(uniforms.uIntensity, intensity);
      gl.uniform1f(uniforms.uSize, size);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hue, xOffset, speed, intensity, size]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`w-full h-full block bg-black ${className}`} 
    />
  );
};

export default Lightning;
