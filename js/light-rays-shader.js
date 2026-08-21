/**
 * LightRays WebGL Atmospheric Background Effect
 * - WebGL Accelerated atmospheric lighting
 * - Interactive pointer tracking & directional tilting
 * - Configurable rays origin, color, spread, noise & wave distortion
 * - IntersectionObserver lifecycle (sleeps off-screen)
 * - Clean WebGL fallback
 */

(function () {
    'use strict';

    function hexToRgb(hex) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [0, 0.95, 1];
    }

    function initLightRays() {
        const canvas = document.getElementById('light-rays-canvas');
        const section = document.getElementById('section-what-i-bring');
        if (!canvas || !section) return;

        const gl = canvas.getContext('webgl', { 
            alpha: true, 
            depth: false, 
            stencil: false, 
            antialias: false,
            powerPreference: 'high-performance' 
        }) || canvas.getContext('experimental-webgl');

        if (!gl) {
            console.warn('[LightRays] WebGL not supported, skipping.');
            return;
        }

        // Enable alpha blending
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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
            uniform float iTime;
            uniform vec2  iResolution;
            uniform vec2  rayPos;
            uniform vec2  rayDir;
            uniform vec3  raysColor;
            uniform float raysSpeed;
            uniform float lightSpread;
            uniform float rayLength;
            uniform float pulsating;
            uniform float fadeDistance;
            uniform float saturation;
            uniform vec2  mousePos;
            uniform float mouseInfluence;
            uniform float noiseAmount;
            uniform float distortion;
            varying vec2 vUv;

            float noise(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
            }

            float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                              float seedA, float seedB, float speed) {
                vec2 sourceToCoord = coord - raySource;
                vec2 dirNorm = normalize(sourceToCoord);
                float cosAngle = dot(dirNorm, rayRefDirection);
                
                float d = distortion * sin(iTime * 1.5 + length(sourceToCoord) * 0.005);
                float distortedAngle = cosAngle + d;
                
                float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
                float distance = length(sourceToCoord);
                float maxDistance = max(iResolution.x, iResolution.y) * rayLength;
                float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
                
                float fadeFactor = fadeDistance * max(iResolution.x, iResolution.y);
                float fadeFalloff = clamp((fadeFactor - distance) / fadeFactor, 0.0, 1.0);
                
                float pulse = pulsating > 0.5 ? (0.85 + 0.15 * sin(iTime * speed * 4.0)) : 1.0;
                
                float baseStrength = clamp(
                    (0.5 + 0.2 * sin(distortedAngle * seedA + iTime * speed)) +
                    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed * 0.8)),
                    0.0, 1.0
                );
                
                return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
            }

            void main() {
                vec2 coord = gl_FragCoord.xy;
                
                vec2 finalRayDir = normalize(rayDir);
                if (mouseInfluence > 0.0) {
                    vec2 mouseScreenPos = mousePos * iResolution.xy;
                    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
                    finalRayDir = normalize(mix(finalRayDir, mouseDirection, mouseInfluence));
                }

                float r1 = rayStrength(rayPos, finalRayDir, coord, 45.2, 31.4, 0.8 * raysSpeed);
                float r2 = rayStrength(rayPos, finalRayDir, coord, 28.5, 19.8, 1.2 * raysSpeed);
                float r3 = rayStrength(rayPos, finalRayDir, coord, 12.1, 56.2, 0.5 * raysSpeed);
                
                float combined = (r1 * 0.4 + r2 * 0.4 + r3 * 0.2);
                combined = pow(combined, 0.7);
                combined *= 1.5;
                vec3 finalColor = raysColor * combined;
                
                if (noiseAmount > 0.0) {
                    float n = noise(coord * 0.01 + iTime * 0.05);
                    finalColor *= (1.0 - noiseAmount + noiseAmount * n);
                }

                if (saturation != 1.0) {
                    float gray = dot(finalColor, vec3(0.299, 0.587, 0.114));
                    finalColor = mix(vec3(gray), finalColor, saturation);
                }

                gl_FragColor = vec4(finalColor, clamp(combined * 0.85, 0.0, 1.0));
            }
        `;

        function createShader(gl, type, source) {
            const s = gl.createShader(type);
            gl.shaderSource(s, source);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(s));
                gl.deleteShader(s);
                return null;
            }
            return s;
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

        // Uniform locations
        const u = {
            iTime: gl.getUniformLocation(program, 'iTime'),
            iResolution: gl.getUniformLocation(program, 'iResolution'),
            rayPos: gl.getUniformLocation(program, 'rayPos'),
            rayDir: gl.getUniformLocation(program, 'rayDir'),
            raysColor: gl.getUniformLocation(program, 'raysColor'),
            raysSpeed: gl.getUniformLocation(program, 'raysSpeed'),
            lightSpread: gl.getUniformLocation(program, 'lightSpread'),
            rayLength: gl.getUniformLocation(program, 'rayLength'),
            pulsating: gl.getUniformLocation(program, 'pulsating'),
            fadeDistance: gl.getUniformLocation(program, 'fadeDistance'),
            saturation: gl.getUniformLocation(program, 'saturation'),
            mousePos: gl.getUniformLocation(program, 'mousePos'),
            mouseInfluence: gl.getUniformLocation(program, 'mouseInfluence'),
            noiseAmount: gl.getUniformLocation(program, 'noiseAmount'),
            distortion: gl.getUniformLocation(program, 'distortion')
        };

        // Parameters matching props
        const raysColorRgb = hexToRgb('#00ffff');
        const raysSpeed = 1.5;
        const lightSpread = 1.2;
        const rayLength = 1.8;
        const pulsating = 0.0;
        const fadeDistance = 1.2;
        const saturation = 1.0;
        const mouseInfluence = 0.3;
        const noiseAmount = 0.03;
        const distortion = 0.08;

        let width = 0;
        let height = 0;
        const dpr = Math.min(Math.min(window.devicePixelRatio || 1, 1.5), 2);

        function updatePlacement() {
            const rect = section.getBoundingClientRect();
            width = Math.floor(rect.width * dpr);
            height = Math.floor(rect.height * dpr);
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                gl.viewport(0, 0, width, height);
            }
        }

        window.addEventListener('resize', updatePlacement, { passive: true });
        updatePlacement();

        // Mouse tracking
        let mouseX = 0.5;
        let mouseY = 0.5;
        let smoothMouseX = 0.5;
        let smoothMouseY = 0.5;

        function onMouseMove(e) {
            const rect = section.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width;
            mouseY = (e.clientY - rect.top) / rect.height;
        }

        section.addEventListener('pointermove', onMouseMove, { passive: true });
        window.addEventListener('pointermove', onMouseMove, { passive: true });

        // Reduced motion check
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        let isReducedMotion = motionQuery.matches;

        motionQuery.addEventListener('change', (e) => {
            isReducedMotion = e.matches;
            if (isReducedMotion) {
                renderSingle();
            } else if (isVisible) {
                startLoop();
            }
        });

        let isVisible = false;
        let animationId = null;
        let startTime = performance.now();

        function render(timeNow) {
            const elapsed = (timeNow - startTime) * 0.001;

            smoothMouseX = smoothMouseX * 0.92 + mouseX * 0.08;
            smoothMouseY = smoothMouseY * 0.92 + mouseY * 0.08;

            gl.useProgram(program);
            gl.uniform1f(u.iTime, elapsed);
            gl.uniform2f(u.iResolution, canvas.width, canvas.height);
            
            // Top-center ray origin in WebGL coordinates (above top edge, pointing down)
            const outside = 0.2;
            const anchorX = 0.5 * canvas.width;
            const anchorY = (1.0 + outside) * canvas.height;
            const dirX = 0.0;
            const dirY = -1.0;

            gl.uniform2f(u.rayPos, anchorX, anchorY);
            gl.uniform2f(u.rayDir, dirX, dirY);
            gl.uniform3fv(u.raysColor, raysColorRgb);
            gl.uniform1f(u.raysSpeed, raysSpeed);
            gl.uniform1f(u.lightSpread, lightSpread);
            gl.uniform1f(u.rayLength, rayLength);
            gl.uniform1f(u.pulsating, pulsating);
            gl.uniform1f(u.fadeDistance, fadeDistance);
            gl.uniform1f(u.saturation, saturation);
            gl.uniform2f(u.mousePos, smoothMouseX, 1.0 - smoothMouseY);
            gl.uniform1f(u.mouseInfluence, mouseInfluence);
            gl.uniform1f(u.noiseAmount, noiseAmount);
            gl.uniform1f(u.distortion, distortion);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        function renderSingle() {
            render(startTime + 1500);
        }

        function loop(timestamp) {
            if (!isVisible || isReducedMotion) return;
            render(timestamp);
            animationId = requestAnimationFrame(loop);
        }

        function startLoop() {
            if (!animationId && !isReducedMotion) {
                animationId = requestAnimationFrame(loop);
            }
        }

        function stopLoop() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    updatePlacement();
                    if (isReducedMotion) {
                        renderSingle();
                    } else {
                        startLoop();
                    }
                } else {
                    stopLoop();
                }
            });
        }, { threshold: 0.05 });

        observer.observe(section);
        renderSingle();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLightRays);
    } else {
        initLightRays();
    }
})();
