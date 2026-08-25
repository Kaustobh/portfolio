/**
 * FaultyTerminal WebGL Background Effect
 * 
 * High-performance CRT/Terminal background effect with:
 * - CRT scanlines & flicker
 * - Barrel curvature distortion
 * - Horizontal glitch displacement & chromatic aberration
 * - Dynamic pattern & digit grid
 * - Interactive pointer tracking & ripple dynamics
 * - IntersectionObserver lifecycle (sleeps off-screen)
 */

(function () {
    'use strict';

    function hexToRgb(hex) {
        let h = hex.replace('#', '').trim();
        if (h.length === 3) h = h.split('').map(c => c + c).join('');
        const num = parseInt(h, 16);
        return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
    }

    function initFaultyTerminal() {
        const canvas = document.getElementById('faulty-terminal-canvas');
        const section = document.getElementById('section-why-devs-love-me');
        if (!canvas || !section) return;

        const gl = canvas.getContext('webgl', {
            alpha: true,
            depth: false,
            stencil: false,
            antialias: false,
            powerPreference: 'high-performance'
        }) || canvas.getContext('experimental-webgl');
        canvas.addEventListener('webglcontextlost', function(e) {
            e.preventDefault();
            console.warn('[WebGL] Context lost on ' + canvas.id + ', pausing render loop.');
        }, false);
        canvas.addEventListener('webglcontextrestored', function() {
            console.log('[WebGL] Context restored on ' + canvas.id + ', re-initializing.');
        }, false);


        if (!gl) {
            console.warn('[FaultyTerminal] WebGL not supported, skipping.');
            return;
        }

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const vsSource = `
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
                vUv = position * 0.5 + 0.5;
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const fsSource = `
            precision highp float;
            varying vec2 vUv;
            uniform float iTime;
            uniform vec3  iResolution;
            uniform float uScale;
            uniform vec2  uGridMul;
            uniform float uDigitSize;
            uniform float uScanlineIntensity;
            uniform float uGlitchAmount;
            uniform float uFlickerAmount;
            uniform float uNoiseAmp;
            uniform float uChromaticAberration;
            uniform float uDither;
            uniform float uCurvature;
            uniform vec3  uTint;
            uniform vec2  uMouse;
            uniform float uMouseStrength;
            uniform float uUseMouse;
            uniform float uPageLoadProgress;
            uniform float uUsePageLoadAnimation;
            uniform float uBrightness;

            float time;

            float hash21(vec2 p){
                p = fract(p * 234.56);
                p += dot(p, p + 34.56);
                return fract(p.x * p.y);
            }

            float noise(vec2 p) {
                return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2; 
            }

            mat2 rotate(float angle) {
                float c = cos(angle);
                float s = sin(angle);
                return mat2(c, -s, s, c);
            }

            float fbm(vec2 p) {
                p *= 1.1;
                float f = 0.0;
                float amp = 0.5 * uNoiseAmp;
                
                mat2 modify0 = rotate(time * 0.02);
                f += amp * noise(p);
                p = modify0 * p * 2.0;
                amp *= 0.454545;
                
                mat2 modify1 = rotate(time * 0.02);
                f += amp * noise(p);
                p = modify1 * p * 2.0;
                amp *= 0.454545;
                
                mat2 modify2 = rotate(time * 0.08);
                f += amp * noise(p);
                
                return f;
            }

            float pattern(vec2 p, out vec2 q, out vec2 r) {
                vec2 offset1 = vec2(1.0);
                vec2 offset0 = vec2(0.0);
                mat2 rot01 = rotate(0.1 * time);
                mat2 rot1 = rotate(0.1);
                
                q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
                r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));
                return fbm(p + r);
            }

            float digit(vec2 p) {
                vec2 grid = uGridMul * 15.0;
                vec2 s = floor(p * grid) / grid;
                p = p * grid;
                vec2 q, r;
                float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;
                
                if (uUseMouse > 0.5) {
                    vec2 mouseWorld = uMouse * uScale;
                    float distToMouse = distance(s, mouseWorld);
                    float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;
                    intensity += mouseInfluence;
                    
                    float ripple = sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
                    intensity += ripple;
                }
                
                if (uUsePageLoadAnimation > 0.5) {
                    float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);
                    float cellDelay = cellRandom * 0.8;
                    float cellProgress = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);
                    
                    float fadeAlpha = smoothstep(0.0, 1.0, cellProgress);
                    intensity *= fadeAlpha;
                }
                
                p = fract(p);
                p *= uDigitSize;
                
                float px5 = p.x * 5.0;
                float py5 = (1.0 - p.y) * 5.0;
                float x = fract(px5);
                float y = fract(py5);
                
                float i = floor(py5) - 2.0;
                float j = floor(px5) - 2.0;
                float n = i * i + j * j;
                float f = n * 0.0625;
                
                float isOn = step(0.1, intensity - f);
                float brightness = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);
                
                return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * brightness;
            }

            float onOff(float a, float b, float c) {
                return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
            }

            float displace(vec2 look) {
                float y = look.y - mod(iTime * 0.25, 1.0);
                float window = 1.0 / (1.0 + 50.0 * y * y);
                return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;
            }

            vec3 getColor(vec2 p) {
                float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
                bar *= uScanlineIntensity;
                
                float displacement = displace(p);
                p.x += displacement;
                if (uGlitchAmount != 1.0) {
                    float extra = displacement * (uGlitchAmount - 1.0);
                    p.x += extra;
                }
                float middle = digit(p);
                
                const float off = 0.002;
                float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off)) +
                            digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0)) +
                            digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));
                
                vec3 baseColor = vec3(0.9) * middle + sum * 0.1 * vec3(1.0) * bar;
                return baseColor;
            }

            vec2 barrel(vec2 uv) {
                vec2 c = uv * 2.0 - 1.0;
                float r2 = dot(c, c);
                c = (1.0 + uCurvature * r2) * c;
                return c * 0.5 + 0.5;
            }

            void main() {
                time = iTime * 0.333333;
                vec2 uv = vUv;
                if (uCurvature != 0.0) {
                    uv = barrel(uv);
                }
                
                vec2 p = uv * uScale;
                vec3 col = getColor(p);
                if (uChromaticAberration != 0.0) {
                    vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
                    col.r = getColor(p + ca).r;
                    col.b = getColor(p - ca).b;
                }
                col *= uTint;
                col *= uBrightness;
                if (uDither > 0.0) {
                    float rnd = hash21(gl_FragCoord.xy);
                    col += (rnd - 0.5) * (uDither * 0.003922);
                }
                
                // Alpha calculation based on luminance
                float lum = max(col.r, max(col.g, col.b));
                gl_FragColor = vec4(col, clamp(lum * 1.5, 0.0, 1.0));
            }
        `;

        function createShader(type, src) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('[FaultyTerminal] Shader error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vs = createShader(gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('[FaultyTerminal] Program link error:', gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
            -1,  1,
             1, -1,
             1,  1
        ]), gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        // Uniforms
        const uTime = gl.getUniformLocation(program, 'iTime');
        const uResolution = gl.getUniformLocation(program, 'iResolution');
        const uScaleLoc = gl.getUniformLocation(program, 'uScale');
        const uGridMulLoc = gl.getUniformLocation(program, 'uGridMul');
        const uDigitSizeLoc = gl.getUniformLocation(program, 'uDigitSize');
        const uScanlineIntensityLoc = gl.getUniformLocation(program, 'uScanlineIntensity');
        const uGlitchAmountLoc = gl.getUniformLocation(program, 'uGlitchAmount');
        const uFlickerAmountLoc = gl.getUniformLocation(program, 'uFlickerAmount');
        const uNoiseAmpLoc = gl.getUniformLocation(program, 'uNoiseAmp');
        const uChromaticAberrationLoc = gl.getUniformLocation(program, 'uChromaticAberration');
        const uDitherLoc = gl.getUniformLocation(program, 'uDither');
        const uCurvatureLoc = gl.getUniformLocation(program, 'uCurvature');
        const uTintLoc = gl.getUniformLocation(program, 'uTint');
        const uMouseLoc = gl.getUniformLocation(program, 'uMouse');
        const uMouseStrengthLoc = gl.getUniformLocation(program, 'uMouseStrength');
        const uUseMouseLoc = gl.getUniformLocation(program, 'uUseMouse');
        const uPageLoadProgressLoc = gl.getUniformLocation(program, 'uPageLoadProgress');
        const uUsePageLoadAnimationLoc = gl.getUniformLocation(program, 'uUsePageLoadAnimation');
        const uBrightnessLoc = gl.getUniformLocation(program, 'uBrightness');

        // Initial uniform configuration
        const tintRgb = hexToRgb('#00F3FF'); // Cyan terminal glow
        gl.uniform1f(uScaleLoc, 1.5);
        gl.uniform2f(uGridMulLoc, 2.0, 1.0);
        gl.uniform1f(uDigitSizeLoc, 1.2);
        gl.uniform1f(uScanlineIntensityLoc, 0.7);
        gl.uniform1f(uGlitchAmountLoc, 1.2);
        gl.uniform1f(uFlickerAmountLoc, 0.6);
        gl.uniform1f(uNoiseAmpLoc, 1.0);
        gl.uniform1f(uChromaticAberrationLoc, 2.0);
        gl.uniform1f(uDitherLoc, 0.1);
        gl.uniform1f(uCurvatureLoc, 0.12);
        gl.uniform3f(uTintLoc, tintRgb[0], tintRgb[1], tintRgb[2]);
        gl.uniform1f(uMouseStrengthLoc, 0.5);
        gl.uniform1f(uUseMouseLoc, 1.0);
        gl.uniform1f(uUsePageLoadAnimationLoc, 1.0);
        gl.uniform1f(uBrightnessLoc, 0.85);

        const mouse = { x: 0.5, y: 0.5 };
        const smoothMouse = { x: 0.5, y: 0.5 };
        let isSectionVisible = true;
        let rafId = null;
        const startTime = performance.now();

        function resize() {
            const isLowGPU = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
        const dpr = isLowGPU ? 1.0 : Math.min(Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2.0) || 1, 1.5);
            const w = Math.floor(section.clientWidth * dpr);
            const h = Math.floor(section.clientHeight * dpr);

            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
                gl.viewport(0, 0, w, h);
                gl.uniform3f(uResolution, w, h, w / h);
            }
        }

        window.addEventListener('resize', resize, { passive: true });
        resize();

        function onMouseMove(e) {
            const rect = section.getBoundingClientRect();
            const x = (e.clientX - rect.left) / Math.max(1, rect.width);
            const y = 1.0 - (e.clientY - rect.top) / Math.max(1, rect.height);
            mouse.x = Math.max(0, Math.min(1, x));
            mouse.y = Math.max(0, Math.min(1, y));
        }

        section.addEventListener('mousemove', onMouseMove, { passive: true });

        function render(now) {
            if (!isSectionVisible) {
                rafId = requestAnimationFrame(render);
                return;
            }

            const elapsed = (now - startTime) / 1000;
            gl.uniform1f(uTime, elapsed);

            // Page load progress (over 2 seconds)
            const progress = Math.min(elapsed / 2.0, 1.0);
            gl.uniform1f(uPageLoadProgressLoc, progress);

            // Smooth mouse
            smoothMouse.x += (mouse.x - smoothMouse.x) * 0.08;
            smoothMouse.y += (mouse.y - smoothMouse.y) * 0.08;
            gl.uniform2f(uMouseLoc, smoothMouse.x, smoothMouse.y);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            rafId = requestAnimationFrame(render);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isSectionVisible = entry.isIntersecting || entry.intersectionRatio > 0.05;
            });
        }, { threshold: [0, 0.05, 0.2] });

        observer.observe(section);

        rafId = requestAnimationFrame(render);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFaultyTerminal);
    } else {
        initFaultyTerminal();
    }
})();
