/**
 * ==========================================================================
 * WEBGL ATMOSPHERIC LIGHTNING BACKGROUND SHADER (Golden Amber Electric Discharge)
 * ==========================================================================
 */

(function () {
    'use strict';

    const canvas = document.getElementById('lightning-canvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: true, alpha: true, powerPreference: 'low-power' });
    if (!gl) {
        console.warn('WebGL not supported for LightningBackground');
        return;
    }

    const isLowPower = (navigator.hardwareConcurrency || 4) <= 4 || window.innerWidth < 768;
    const dpr = Math.min(Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2.0) || 1, isLowPower ? 1.0 : 1.5);

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
            
            // Warm golden-amber electric discharge color
            vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.85, 0.95));
            
            // Subtle ambient flickering
            float flicker = mix(0.0, 0.06, hash11(time));
            
            // Core discharge effect
            vec3 col = baseColor * (flicker / max(dist, 0.002)) * uIntensity;
            
            // Glow and falloff
            col = pow(col, vec3(1.15));
            
            gl_FragColor = vec4(col, 1.0);
        }
    `;

    function compileShader(source, type) {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Lightning Shader error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Lightning program link error:', gl.getProgramInfoLog(program));
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

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const displayWidth = Math.floor(rect.width * dpr);
        const displayHeight = Math.floor(rect.height * dpr);
        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const startTime = performance.now();
    let isVisible = true;
    let animId = null;

    // Golden amber configuration: Hue 42 (Gold / Warm Amber), Speed 0.75, Intensity 1.1, Size 0.85
    const hue = 42.0;
    const xOffset = 0.0;
    const speed = 0.75;
    const intensity = 1.1;
    const size = 0.85;

    function render() {
        if (!isVisible) return;
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
        animId = requestAnimationFrame(render);
    }

    // Low-GPU Optimization: Pause rendering when offscreen
    const section = document.getElementById('section-experiences');
    if (section && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isVisible = true;
                    if (!animId) animId = requestAnimationFrame(render);
                } else {
                    isVisible = false;
                    if (animId) {
                        cancelAnimationFrame(animId);
                        animId = null;
                    }
                }
            });
        }, { threshold: 0.05 });
        observer.observe(section);
    } else {
        animId = requestAnimationFrame(render);
    }

})();
