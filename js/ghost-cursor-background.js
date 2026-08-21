/**
 * GhostCursor WebGL Fluid Trail Background Effect
 * - Smoky organic fluid cursor trail using Fractal Brownian Motion (FBM) GLSL shaders
 * - 25-point circular history trail with quadratic falloff
 * - Motion inertia, idle fade delay & smooth decay
 * - Integrated film grain and high-performance WebGL rendering
 * - IntersectionObserver sleeping when section is off-screen
 */

(function () {
    'use strict';

    function hexToRgb(hex) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [0.694, 0.62, 0.937]; // #B19EEF
    }

    function initGhostCursor() {
        const canvas = document.getElementById('ghost-cursor-canvas');
        const section = document.getElementById('section-selected-projects');
        if (!canvas || !section) return;

        const gl = canvas.getContext('webgl', {
            alpha: true,
            depth: false,
            stencil: false,
            antialias: false,
            powerPreference: 'high-performance',
            premultipliedAlpha: false
        }) || canvas.getContext('experimental-webgl');
        canvas.addEventListener('webglcontextlost', function(e) {
            e.preventDefault();
            console.warn('[WebGL] Context lost on ' + canvas.id + ', pausing render loop.');
        }, false);
        canvas.addEventListener('webglcontextrestored', function() {
            console.log('[WebGL] Context restored on ' + canvas.id + ', re-initializing.');
        }, false);


        if (!gl) {
            console.warn('[GhostCursor] WebGL not supported, skipping.');
            return;
        }

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        const MAX_TRAIL = 25;
        const trailBuf = [];
        for (let i = 0; i < MAX_TRAIL; i++) {
            trailBuf.push({ x: 0.5, y: 0.5 });
        }
        let head = 0;

        const baseColor = hexToRgb('#B19EEF');
        const brightness = 1.2;
        const inertia = 0.4;
        const grainIntensity = 0.05;
        const edgeIntensity = 0.0;
        const fadeDelay = 200;
        const fadeDuration = 1000;

        const currentMouse = { x: 0.5, y: 0.5 };
        const simMouse = { x: 0.5, y: 0.5 };
        const velocity = { x: 0, y: 0 };
        let fadeOpacity = 1.0;
        let lastMoveTime = performance.now();
        let pointerActive = false;
        let isSectionVisible = true;
        let rafId = null;

        const vsSource = `
            attribute vec2 a_position;
            varying vec2 vUv;
            void main() {
                vUv = a_position * 0.5 + 0.5;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        const fsSource = `
            precision highp float;
            #define MAX_TRAIL 25

            uniform float iTime;
            uniform vec3  iResolution;
            uniform vec2  iMouse;
            uniform vec2  iPrevMouse[MAX_TRAIL];
            uniform float iOpacity;
            uniform float iScale;
            uniform vec3  iBaseColor;
            uniform float iBrightness;
            uniform float iEdgeIntensity;
            uniform float iGrain;

            varying vec2  vUv;

            float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

            float noise(vec2 p){
                vec2 i = floor(p), f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
                           mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
            }

            float fbm(vec2 p){
                float v = 0.0;
                float a = 0.5;
                mat2 m = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
                for(int i = 0; i < 5; i++){
                    v += a * noise(p);
                    p = m * p * 2.0;
                    a *= 0.5;
                }
                return v;
            }

            vec3 tint1(vec3 base){ return mix(base, vec3(1.0), 0.15); }
            vec3 tint2(vec3 base){ return mix(base, vec3(0.8, 0.9, 1.0), 0.25); }

            vec4 blob(vec2 p, vec2 mousePos, float intensity, float activity) {
                vec2 q = vec2(fbm(p * iScale + iTime * 0.1), fbm(p * iScale + vec2(5.2, 1.3) + iTime * 0.1));
                vec2 r = vec2(fbm(p * iScale + q * 1.5 + iTime * 0.15), fbm(p * iScale + q * 1.5 + vec2(8.3, 2.8) + iTime * 0.15));
                float smoke = fbm(p * iScale + r * 0.8);
                
                float radius = 0.5 + 0.3 * (1.0 / iScale);
                float distFactor = 1.0 - smoothstep(0.0, radius * activity, length(p - mousePos));
                float alpha = pow(smoke, 2.5) * distFactor;

                vec3 c1 = tint1(iBaseColor);
                vec3 c2 = tint2(iBaseColor);
                vec3 color = mix(c1, c2, sin(iTime * 0.5) * 0.5 + 0.5);

                return vec4(color * alpha * intensity, alpha * intensity);
            }

            void main() {
                vec2 uv = (gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
                vec2 mouse = (iMouse * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
                
                vec3 colorAcc = vec3(0.0);
                float alphaAcc = 0.0;
                
                vec4 b = blob(uv, mouse, 1.0, iOpacity);
                colorAcc += b.rgb;
                alphaAcc += b.a;

                for (int i = 0; i < MAX_TRAIL; i++) {
                    vec2 pm = (iPrevMouse[i] * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
                    float t = 1.0 - float(i) / float(MAX_TRAIL);
                    t = pow(t, 2.0);
                    
                    if (t > 0.01) {
                        vec4 bt = blob(uv, pm, t * 0.8, iOpacity);
                        colorAcc += bt.rgb;
                        alphaAcc += bt.a;
                    }
                }

                colorAcc *= iBrightness;
                
                vec2 uv01 = gl_FragCoord.xy / iResolution.xy;
                float edgeDist = min(min(uv01.x, 1.0 - uv01.x), min(uv01.y, 1.0 - uv01.y));
                float distFromEdge = clamp(edgeDist * 2.0, 0.0, 1.0);
                float k = clamp(iEdgeIntensity, 0.0, 1.0);
                float edgeMask = mix(1.0 - k, 1.0, distFromEdge);
                
                float outAlpha = clamp(alphaAcc * iOpacity * edgeMask, 0.0, 1.0);

                // Subtle film grain
                float grainNoise = (hash(gl_FragCoord.xy * 0.1 + iTime) * 2.0 - 1.0) * iGrain;
                colorAcc += grainNoise * colorAcc;

                gl_FragColor = vec4(colorAcc, outAlpha);
            }
        `;

        function compileShader(type, src) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('[GhostCursor] Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vs = compileShader(gl.VERTEX_SHADER, vsSource);
        const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('[GhostCursor] Program link error:', gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        // Quad buffer
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

        const aPosition = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        // Uniform locations
        const uTime = gl.getUniformLocation(program, 'iTime');
        const uResolution = gl.getUniformLocation(program, 'iResolution');
        const uMouse = gl.getUniformLocation(program, 'iMouse');
        const uOpacity = gl.getUniformLocation(program, 'iOpacity');
        const uScale = gl.getUniformLocation(program, 'iScale');
        const uBaseColor = gl.getUniformLocation(program, 'iBaseColor');
        const uBrightness = gl.getUniformLocation(program, 'iBrightness');
        const uEdgeIntensity = gl.getUniformLocation(program, 'iEdgeIntensity');
        const uGrain = gl.getUniformLocation(program, 'iGrain');

        const uPrevMouse = [];
        for (let i = 0; i < MAX_TRAIL; i++) {
            uPrevMouse.push(gl.getUniformLocation(program, `iPrevMouse[${i}]`));
        }

        gl.uniform3f(uBaseColor, baseColor[0], baseColor[1], baseColor[2]);
        gl.uniform1f(uBrightness, brightness);
        gl.uniform1f(uEdgeIntensity, edgeIntensity);
        gl.uniform1f(uGrain, grainIntensity);

        function calculateScale() {
            const r = section.getBoundingClientRect();
            const base = 600;
            const current = Math.min(Math.max(1, r.width), Math.max(1, r.height));
            return Math.max(0.5, Math.min(2.0, current / base));
        }

        function resize() {
            const isLowGPU = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
        const dpr = isLowGPU ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
            const w = Math.floor(section.clientWidth * dpr);
            const h = Math.floor(section.clientHeight * dpr);

            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
                gl.viewport(0, 0, w, h);
                gl.uniform3f(uResolution, w, h, 1.0);
                gl.uniform1f(uScale, calculateScale());
            }
        }

        window.addEventListener('resize', resize, { passive: true });
        resize();

        function updatePointer(e) {
            const rect = section.getBoundingClientRect();
            const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : rect.width / 2);
            const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : rect.height / 2);

            const x = Math.max(0, Math.min(1, (clientX - rect.left) / Math.max(1, rect.width)));
            const y = Math.max(0, Math.min(1, 1.0 - (clientY - rect.top) / Math.max(1, rect.height)));

            currentMouse.x = x;
            currentMouse.y = y;
            pointerActive = true;
            lastMoveTime = performance.now();
        }

        section.addEventListener('pointermove', updatePointer, { passive: true });
        section.addEventListener('pointerenter', () => { pointerActive = true; }, { passive: true });
        section.addEventListener('pointerleave', () => { pointerActive = false; }, { passive: true });
        section.addEventListener('touchmove', updatePointer, { passive: true });

        const startTime = performance.now();

        function render() {
            if (!isSectionVisible) {
                rafId = requestAnimationFrame(render);
                return;
            }

            const now = performance.now();
            const t = (now - startTime) / 1000;

            if (pointerActive) {
                velocity.x = currentMouse.x - simMouse.x;
                velocity.y = currentMouse.y - simMouse.y;
                simMouse.x = currentMouse.x;
                simMouse.y = currentMouse.y;
                fadeOpacity = 1.0;
            } else {
                velocity.x *= inertia;
                velocity.y *= inertia;
                if (velocity.x * velocity.x + velocity.y * velocity.y > 1e-6) {
                    simMouse.x += velocity.x;
                    simMouse.y += velocity.y;
                }

                const dt = now - lastMoveTime;
                if (dt > fadeDelay) {
                    const k = Math.min(1, (dt - fadeDelay) / fadeDuration);
                    fadeOpacity = Math.max(0, 1 - k);
                }
            }

            head = (head + 1) % MAX_TRAIL;
            trailBuf[head].x = simMouse.x;
            trailBuf[head].y = simMouse.y;

            gl.uniform1f(uTime, t);
            gl.uniform2f(uMouse, simMouse.x, simMouse.y);
            gl.uniform1f(uOpacity, fadeOpacity);

            for (let i = 0; i < MAX_TRAIL; i++) {
                const srcIdx = (head - i + MAX_TRAIL) % MAX_TRAIL;
                gl.uniform2f(uPrevMouse[i], trailBuf[srcIdx].x, trailBuf[srcIdx].y);
            }

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            rafId = requestAnimationFrame(render);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isSectionVisible = entry.isIntersecting;
            });
        }, { threshold: 0.05 });

        observer.observe(section);

        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGhostCursor);
    } else {
        initGhostCursor();
    }
})();
