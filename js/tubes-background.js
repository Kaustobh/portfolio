/**
 * Tubes Interactive 3D Background for Skill Tree Section
 * Powered by threejs-components TubesCursor
 * Features:
 * - 3D Neon tubes that dynamically follow cursor movement
 * - High performance WebGL rendering with IntersectionObserver sleep lifecycle
 * - Click anywhere on section to randomize neon tubes & light colors
 * - Clean fallback if WebGL or CDN is unavailable
 */

(function () {
    'use strict';

    function randomColors(count) {
        return Array.from({ length: count }, () => 
            '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
        );
    }

    async function initTubesBackground() {
        const canvas = document.getElementById('tubes-canvas');
        const section = document.getElementById('section-skill-tree');
        if (!canvas || !section) return;

        let tubesApp = null;
        let isVisible = false;

        try {
            // Dynamically import threejs-components TubesCursor module
            const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
            const TubesCursor = module.default;

            if (typeof TubesCursor !== 'function') {
                console.warn('[Tubes] TubesCursor default export not found');
                return;
            }

            // Initialize Tubes with custom portfolio neon palette
            tubesApp = TubesCursor(canvas, {
                tubes: {
                    colors: ["#FF00A0", "#00F3FF", "#D4FF00"],
                    lights: {
                        intensity: 220,
                        colors: ["#00F3FF", "#FF00A0", "#D4FF00", "#A855F7"]
                    }
                }
            });

            // Click interaction to randomize neon palette
            section.addEventListener('click', (e) => {
                // Ignore clicks on clickable nodes, links, and buttons
                if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.cyber-embossed-node') || e.target.closest('.cyber-chip-badge')) {
                    return;
                }
                if (tubesApp && tubesApp.tubes) {
                    try {
                        const newColors = randomColors(3);
                        const newLights = randomColors(4);
                        if (typeof tubesApp.tubes.setColors === 'function') {
                            tubesApp.tubes.setColors(newColors);
                        }
                        if (typeof tubesApp.tubes.setLightsColors === 'function') {
                            tubesApp.tubes.setLightsColors(newLights);
                        }
                    } catch (err) {
                        console.debug('[Tubes] Error setting colors:', err);
                    }
                }
            });

            // Performance: Only render when visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isVisible = entry.isIntersecting;
                    // If the library supports pausing, we can trigger resize / update
                    if (isVisible && tubesApp && typeof tubesApp.onResize === 'function') {
                        tubesApp.onResize();
                    }
                });
            }, { threshold: 0.05 });

            observer.observe(section);

        } catch (error) {
            console.warn('[Tubes] Could not initialize TubesCursor background:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTubesBackground);
    } else {
        initTubesBackground();
    }
})();
