/**
 * Selected Projects Continuous Infinite Rotating Marquee Engine
 * - 60fps buttery-smooth continuous translation
 * - Subpixel float accumulator to eliminate high-DPI rounding stutter
 * - Smooth exponential deceleration on hover / focus
 * - Smooth acceleration back to cruise speed on mouse leave
 * - Momentum drag & touch swipe with click suppression
 * - Seamless loop wrap-around without jumping
 * - Auto-pauses when section is off-screen (IntersectionObserver)
 */

(function () {
    'use strict';

    function initProjectsCarousel() {
        const track = document.getElementById('projects-carousel-track');
        const section = document.getElementById('section-selected-projects');
        if (!track || !section) return;

        // Force disable any CSS scroll snap that interferes with subpixel auto-scrolling
        track.style.scrollSnapType = 'none';
        track.style.scrollBehavior = 'auto';

        const originalCards = Array.from(track.querySelectorAll('.project-carousel-card'));
        if (!originalCards.length) return;

        // Clone cards once for seamless wrap-around
        if (!track.dataset.cloned) {
            originalCards.forEach(card => {
                const clone = card.cloneNode(true);
                clone.classList.remove('snap-center');
                clone.setAttribute('aria-hidden', 'true');
                track.appendChild(clone);
            });
            track.dataset.cloned = 'true';
        }

        // Remove snap-center from all cards
        track.querySelectorAll('.project-carousel-card').forEach(card => {
            card.classList.remove('snap-center');
        });

        const cruiseSpeed = 0.9; // Base pixels per 60fps frame (~54px/sec)
        let currentSpeed = cruiseSpeed;
        let isHovered = false;
        let isDragging = false;
        let isSectionVisible = true;

        let scrollPos = track.scrollLeft || 0;
        let startX = 0;
        let dragScrollStart = 0;
        let hasMoved = false;
        let dragVelocity = 0;
        let lastDragX = 0;
        let lastDragTime = 0;
        let rafId = null;

        function getLoopWidth() {
            return track.scrollWidth / 2;
        }

        // Hover handlers
        function onEnter() {
            isHovered = true;
        }
        function onLeave() {
            isHovered = false;
        }

        track.addEventListener('mouseenter', onEnter);
        track.addEventListener('mouseleave', onLeave);
        track.addEventListener('pointerenter', onEnter);
        track.addEventListener('pointerleave', onLeave);

        // Touch handlers
        track.addEventListener('touchstart', () => {
            isHovered = true;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            setTimeout(() => { isHovered = false; }, 1000);
        }, { passive: true });

        // Mouse Drag Interaction with Inertia
        track.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            // Allow direct clicks on links and buttons
            if (e.target.closest('a') || e.target.closest('button')) return;

            isDragging = true;
            hasMoved = false;
            track.classList.add('cursor-grabbing');
            startX = e.pageX;
            dragScrollStart = scrollPos;
            lastDragX = e.pageX;
            lastDragTime = performance.now();
            dragVelocity = 0;
        });

        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            track.classList.remove('cursor-grabbing');
            setTimeout(() => { hasMoved = false; }, 60);
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const now = performance.now();
            const dx = e.pageX - startX;
            const dt = Math.max(1, now - lastDragTime);

            if (Math.abs(dx) > 4) {
                hasMoved = true;
            }

            // Calculate instantaneous drag velocity
            dragVelocity = (lastDragX - e.pageX) / dt * 16.66;
            lastDragX = e.pageX;
            lastDragTime = now;

            scrollPos = dragScrollStart - dx;

            const loopWidth = getLoopWidth();
            if (loopWidth > 0) {
                while (scrollPos >= loopWidth) {
                    scrollPos -= loopWidth;
                    dragScrollStart -= loopWidth;
                }
                while (scrollPos < 0) {
                    scrollPos += loopWidth;
                    dragScrollStart += loopWidth;
                }
            }

            track.scrollLeft = scrollPos;
        });

        // Suppress accidental click when dragging
        track.addEventListener('click', (e) => {
            if (hasMoved) {
                e.stopPropagation();
                e.preventDefault();
                hasMoved = false;
            }
        }, true);

        // Mouse Wheel Horizontal Scroll
        track.addEventListener('wheel', (e) => {
            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (Math.abs(delta) > 2) {
                e.preventDefault();
                scrollPos += delta * 0.9;
                const loopWidth = getLoopWidth();
                if (loopWidth > 0) {
                    while (scrollPos >= loopWidth) scrollPos -= loopWidth;
                    while (scrollPos < 0) scrollPos += loopWidth;
                }
                track.scrollLeft = scrollPos;
            }
        }, { passive: false });

        // HUD scroll navigation
        window.scrollToProjectCard = function (index) {
            const cards = track.querySelectorAll('.project-carousel-card');
            if (index < 0 || index >= originalCards.length) return;
            const targetCard = cards[index];
            if (targetCard) {
                const targetLeft = targetCard.offsetLeft - track.offsetLeft - 24;
                scrollPos = targetLeft;
                track.scrollTo({
                    left: targetLeft,
                    behavior: 'smooth'
                });
            }
            section.scrollIntoView({ behavior: 'smooth' });
        };

        // Main Animation Loop
        let lastTime = performance.now();

        function animate(now) {
            if (!isSectionVisible) {
                lastTime = now;
                rafId = requestAnimationFrame(animate);
                return;
            }

            const dt = Math.min((now - lastTime) / 16.666, 2.0);
            lastTime = now;

            if (!isDragging) {
                // If there's leftover momentum from a drag, decay it
                if (Math.abs(dragVelocity) > 0.05) {
                    scrollPos += dragVelocity * dt;
                    dragVelocity *= Math.pow(0.92, dt);
                } else {
                    dragVelocity = 0;
                }

                // Target speed: 0 when hovered, cruiseSpeed when idle
                const target = isHovered ? 0 : cruiseSpeed;
                // Smooth ease in / ease out
                const easeFactor = isHovered ? 0.08 : 0.04;
                currentSpeed += (target - currentSpeed) * easeFactor * dt;

                if (Math.abs(currentSpeed) > 0.002) {
                    scrollPos += currentSpeed * dt;
                }

                const loopWidth = getLoopWidth();
                if (loopWidth > 0) {
                    while (scrollPos >= loopWidth) {
                        scrollPos -= loopWidth;
                    }
                    while (scrollPos < 0) {
                        scrollPos += loopWidth;
                    }
                }

                track.scrollLeft = scrollPos;
            }

            rafId = requestAnimationFrame(animate);
        }

        // IntersectionObserver lifecycle (sleeps off-screen)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isSectionVisible = entry.isIntersecting || entry.intersectionRatio > 0.05;
                if (isSectionVisible) {
                    lastTime = performance.now();
                }
            });
        }, { threshold: [0, 0.05, 0.2] });

        observer.observe(section);

        lastTime = performance.now();
        rafId = requestAnimationFrame(animate);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProjectsCarousel);
    } else {
        initProjectsCarousel();
    }
})();
