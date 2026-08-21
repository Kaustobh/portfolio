/**
 * Liquid Metal WebGL Shader Background
 * - Steep value ramp with narrow specular
 * - Warped field through steep smoothstep
 * - Narrow eighth-power highlight band
 * - Cubed dark term, zero chroma (pure monochrome metal)
 * - Pointer-reactive distortion
 * - Prefers-reduced-motion support (single static frame)
 * - IntersectionObserver lifecycle (sleeps off-screen)
 * - Clean WebGL fallback
 */

(function () {
    'use strict';

    function initLiquidMetal() {
        const canvas = document.getElementById('liquid-metal-canvas');
        const section = document.getElementById('recruiter-briefing');
        if (!canvas || !section) return;

        // Try WebGL Context
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
            console.warn('[Liquid Metal] WebGL not supported, falling back gracefully.');
            return;
        }

        // Vertex Shader
        const vsSource = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        // Fragment Shader: Liquid Metal with steep ramp, narrow 8th-power specular, cubed dark term, zero chroma
        const fsSource = `
            precision highp float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_mouse;

            void main() {
                vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
                vec2 m = (u_mouse * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

                // Pointer reaction: fluid repulsion
                float d = length(st - m);
                float mouseDistort = smoothstep(1.4, 0.0, d) * 0.45;
                st += (st - m) * mouseDistort;

                // Domain warping iterations
                vec2 p = st * 1.8;
                float t = u_time * 0.35;

                for (int i = 1; i <= 4; i++) {
                    float fi = float(i);
                    p += vec2(
                        sin(p.y * 1.4 + t * 0.65 + fi * 1.3) + cos(p.x * 0.9 - t * 0.45),
                        cos(p.x * 1.4 - t * 0.55 + fi * 0.85) + sin(p.y * 0.9 + t * 0.65)
                    ) / fi;
                }

                // Surface normal estimation for specular
                float v = sin(p.x * 2.2 + p.y * 2.2 + t);
                
                // Steep value ramp with steep smoothstep
                float field = smoothstep(-0.45, 0.65, v);

                // Cubed dark term for deep metallic crevices
                float darkTerm = pow(field, 3.0);

                // Narrow eighth-power highlight band for specular reflection
                float highlight = pow(clamp(sin(p.x * 3.2 + p.y * 1.6 + t * 1.1) * 0.5 + 0.5, 0.0, 1.0), 8.0);

                // Edge glint for liquid mercury curvature
                float rim = pow(1.0 - abs(v), 5.0) * 0.35;

                // Pure monochrome luminance synthesis (No chroma anywhere at all)
                float luminance = darkTerm * 0.5 + highlight * 0.85 + field * 0.18 + rim;
                luminance = clamp(luminance, 0.0, 1.0);

                gl_FragColor = vec4(vec3(luminance), 1.0);
            }
        `;

        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        // Quad geometry
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
            -1.0,  1.0,
             1.0, -1.0,
             1.0,  1.0
        ]), gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        const uResolution = gl.getUniformLocation(program, 'u_resolution');
        const uTime = gl.getUniformLocation(program, 'u_time');
        const uMouse = gl.getUniformLocation(program, 'u_mouse');

        let width = 0;
        let height = 0;
        let dpr = Math.min(Math.min(window.devicePixelRatio || 1, 1.5), 2);

        function resize() {
            const rect = section.getBoundingClientRect();
            width = Math.floor(rect.width * dpr);
            height = Math.floor(rect.height * dpr);
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                gl.viewport(0, 0, width, height);
            }
        }

        window.addEventListener('resize', resize, { passive: true });
        resize();

        // Pointer reaction
        let targetMouseX = width * 0.5;
        let targetMouseY = height * 0.5;
        let currentMouseX = width * 0.5;
        let currentMouseY = height * 0.5;

        function onPointerMove(e) {
            const rect = section.getBoundingClientRect();
            targetMouseX = (e.clientX - rect.left) * dpr;
            targetMouseY = (rect.height - (e.clientY - rect.top)) * dpr;
        }

        section.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointermove', onPointerMove, { passive: true });

        // Prefers-reduced-motion check
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        let isReducedMotion = motionQuery.matches;

        motionQuery.addEventListener('change', (e) => {
            isReducedMotion = e.matches;
            if (isReducedMotion) {
                renderSingleFrame();
            } else if (isVisible) {
                startLoop();
            }
        });

        let isVisible = false;
        let animationFrameId = null;
        let startTime = performance.now();

        function renderFrame(timeNow) {
            const elapsed = (timeNow - startTime) * 0.001;

            // Smooth pointer easing
            currentMouseX += (targetMouseX - currentMouseX) * 0.08;
            currentMouseY += (targetMouseY - currentMouseY) * 0.08;

            gl.useProgram(program);
            gl.uniform2f(uResolution, canvas.width, canvas.height);
            gl.uniform1f(uTime, elapsed);
            gl.uniform2f(uMouse, currentMouseX, currentMouseY);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        function renderSingleFrame() {
            renderFrame(startTime + 1500.0);
        }

        function loop(timestamp) {
            if (!isVisible || isReducedMotion) return;
            renderFrame(timestamp);
            animationFrameId = requestAnimationFrame(loop);
        }

        function startLoop() {
            if (!animationFrameId && !isReducedMotion) {
                animationFrameId = requestAnimationFrame(loop);
            }
        }

        function stopLoop() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }

        // IntersectionObserver: sleep WebGL rendering when off-screen
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    resize();
                    if (isReducedMotion) {
                        renderSingleFrame();
                    } else {
                        startLoop();
                    }
                } else {
                    stopLoop();
                }
            });
        }, { threshold: 0.05 });

        observer.observe(section);

        // Initial paint
        renderSingleFrame();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLiquidMetal);
    } else {
        initLiquidMetal();
    }
})();
