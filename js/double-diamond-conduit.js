/**
 * ==========================================================================
 * DOUBLE DIAMOND 3D SPATIAL GYROSCOPE, RADIAL SPOTLIGHT & LIQUID GLIDE ENGINE
 * ==========================================================================
 */

(function () {
    'use strict';

    let animFrameId = null;
    let progress = 0.0; // 0.0 to 1.0
    let targetProgress = null; // for smooth interactive lerp
    let isManualOverride = false;
    let overrideTimer = null;
    let isVisible = false;

    // Full cycle duration in seconds (12.0s = calm, continuous liquid flow)
    const cycleDurationSeconds = 12.0;
    const progressSpeed = 1.0 / (cycleDurationSeconds * 60.0);

    const stages = [
        { index: 0, pos: 0.125, triggered: false },
        { index: 1, pos: 0.375, triggered: false },
        { index: 2, pos: 0.625, triggered: false },
        { index: 3, pos: 0.875, triggered: false }
    ];

    function triggerStageSpring(idx) {
        const tag = document.getElementById(`diamond-stage-tag-${idx}`);
        const dot = document.getElementById(`diamond-stage-dot-${idx}`);

        if (tag) {
            tag.classList.remove('passed-stage', 'inactive-stage');
            tag.classList.add('spring-active', 'shimmer-active');

            // Center spotlight on auto-trigger
            tag.style.setProperty('--mouse-x', '50%');
            tag.style.setProperty('--mouse-y', '50%');

            setTimeout(() => {
                tag.classList.remove('shimmer-active');
            }, 1200);
        }

        if (dot) {
            dot.classList.add('bg-emerald-300', 'border-emerald-100', 'shadow-[0_0_20px_#34d399]', 'scale-125');
            dot.classList.remove('bg-neutral-800', 'border-white/10');
            setTimeout(() => {
                dot.classList.remove('scale-125');
            }, 600);
        }

        // Previous stages transition to persistent passed-stage
        for (let i = 0; i < idx; i++) {
            const prevTag = document.getElementById(`diamond-stage-tag-${i}`);
            if (prevTag) {
                prevTag.classList.remove('spring-active');
                prevTag.classList.add('passed-stage');
            }
        }
    }

    function resetAllStages() {
        stages.forEach(s => {
            s.triggered = false;
            const tag = document.getElementById(`diamond-stage-tag-${s.index}`);
            const dot = document.getElementById(`diamond-stage-dot-${s.index}`);
            if (tag) {
                tag.classList.remove('spring-active', 'passed-stage', 'shimmer-active');
                tag.classList.add('inactive-stage');
                tag.style.transform = '';
            }
            if (dot) {
                dot.classList.remove('bg-emerald-300', 'border-emerald-100', 'shadow-[0_0_20px_#34d399]', 'scale-125');
                dot.classList.add('bg-neutral-800', 'border-white/10');
            }
        });
    }

    function loop() {
        if (!isVisible) return;

        const fill = document.getElementById('emerald-liquid-fill');
        const bead = document.getElementById('emerald-conduit-bead');

        if (isManualOverride && targetProgress !== null) {
            progress += (targetProgress - progress) * 0.08;
            if (Math.abs(targetProgress - progress) < 0.002) {
                progress = targetProgress;
            }
        } else {
            progress += progressSpeed;
            if (progress >= 1.0) {
                progress = 0.0;
                resetAllStages();
            }
        }

        const percent = Math.min(Math.max(progress * 100, 0), 100);

        if (fill) {
            fill.style.width = `${percent}%`;
        }
        if (bead) {
            bead.style.left = `${percent}%`;
        }

        stages.forEach(s => {
            if (progress >= s.pos && !s.triggered) {
                s.triggered = true;
                triggerStageSpring(s.index);
            }
        });

        animFrameId = requestAnimationFrame(loop);
    }

    window.selectDiamondStage = function (idx) {
        if (idx >= 0 && idx < stages.length) {
            isManualOverride = true;
            targetProgress = stages[idx].pos;

            stages.forEach(s => {
                s.triggered = (s.index <= idx);
            });
            triggerStageSpring(idx);

            if (typeof window.playSyntheticClick === 'function') {
                window.playSyntheticClick('click');
            } else if (typeof window.playClickSound === 'function') {
                window.playClickSound();
            }

            clearTimeout(overrideTimer);
            overrideTimer = setTimeout(() => {
                isManualOverride = false;
                targetProgress = null;
            }, 7000);
        }
    };

    function init3DTiltListeners() {
        const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        if (isTouch) return;

        stages.forEach(s => {
            const tag = document.getElementById(`diamond-stage-tag-${s.index}`);
            if (!tag) return;

            tag.addEventListener('pointermove', (e) => {
                const rect = tag.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                tag.style.setProperty('--mouse-x', `${(x * 100).toFixed(1)}%`);
                tag.style.setProperty('--mouse-y', `${(y * 100).toFixed(1)}%`);

                const rotateX = ((0.5 - y) * 12).toFixed(2);
                const rotateY = ((x - 0.5) * 12).toFixed(2);

                tag.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.025)`;
            }, { passive: true });

            tag.addEventListener('pointerleave', () => {
                tag.style.setProperty('--mouse-x', '50%');
                tag.style.setProperty('--mouse-y', '50%');
                if (tag.classList.contains('spring-active')) {
                    tag.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(-8px) scale(1.03)';
                } else if (tag.classList.contains('passed-stage')) {
                    tag.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(-2px) scale(1.0)';
                } else {
                    tag.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1.0)';
                }
            }, { passive: true });
        });
    }

    function initLifecycle() {
        const section = document.getElementById('section-what-i-bring');
        resetAllStages();
        init3DTiltListeners();

        if (section && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        isVisible = true;
                        if (!animFrameId) animFrameId = requestAnimationFrame(loop);
                    } else {
                        isVisible = false;
                        if (animFrameId) {
                            cancelAnimationFrame(animFrameId);
                            animFrameId = null;
                        }
                    }
                });
            }, { threshold: 0.15 });
            observer.observe(section);
        } else {
            isVisible = true;
            animFrameId = requestAnimationFrame(loop);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLifecycle);
    } else {
        initLifecycle();
    }
})();
