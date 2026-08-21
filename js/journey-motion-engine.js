
    // Low-GPU Scroll Optimization: Suppress heavy RAF calculations during fast fling
    let scrollTimeout = null;
    window.__isFastScrolling = false;
    window.addEventListener('scroll', () => {
        window.__isFastScrolling = true;
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            window.__isFastScrolling = false;
        }, 100);
    }, { passive: true });

/**
 * ==========================================================================
 * JOURNEY MOTION & VIBE INTERACTION ENGINE (STABLE - ZERO TEXT SCRAMBLE / NO RAINBOW)
 * ==========================================================================
 * - Kinetic Stat Numeric Counters
 * - 3D Gyroscopic Card Tilt & Specular Sheen
 * - Magnetic Physics on Primary Buttons
 * - Velocity-Aware Aerodynamic Custom Cursor
 * - Fullscreen Image Lightbox Zoom
 * - Modal Chapter Smooth Scrolling
 * - Skill Matrix Category Filtering
 * - Global Keyboard Navigation ([Esc] Close, [←/→] Cycle Modals, [Space] Pause Carousel)
 */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ──────────────────────────────────────────────────────────────────────────
    // ──────────────────────────────────────────────────────────────────────────
    // 0. CYBERNETIC SPLIT-TEXT DECRYPTION / SCRAMBLER
    // ──────────────────────────────────────────────────────────────────────────
    const GLYPHS = '01#_<>[]*+=~!?/\\';

    class TextScrambler {
        constructor(el) {
            this.el = el;
            this.originalText = el.innerText.trim();
            this.frame = 0;
            this.queue = [];
            this.isScrambling = false;
            this.buildQueue();
        }

        buildQueue() {
            this.queue = [];
            for (let i = 0; i < this.originalText.length; i++) {
                const char = this.originalText[i];
                if (char === ' ') {
                    this.queue.push({ from: ' ', to: ' ', start: 0, end: 0 });
                } else {
                    const start = Math.floor(Math.random() * 6);
                    const end = start + Math.floor(Math.random() * 12) + 6;
                    this.queue.push({ from: '', to: char, start, end, char: '' });
                }
            }
        }

        setText() {
            if (this.isScrambling || prefersReducedMotion) return;
            this.isScrambling = true;
            this.frame = 0;
            this.buildQueue();
            this.update();
        }

        update() {
            let output = '';
            let complete = 0;

            for (let i = 0; i < this.queue.length; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                        this.queue[i].char = char;
                    }
                    output += `<span class="opacity-70 font-mono">${char}</span>`;
                } else {
                    output += from;
                }
            }

            this.el.innerHTML = output;

            if (complete === this.queue.length) {
                this.el.innerText = this.originalText;
                this.isScrambling = false;
            } else {
                this.frame++;
                requestAnimationFrame(() => this.update());
            }
        }
    }

    function initTextScramble() {
        const scramblers = new Map();
        const targets = document.querySelectorAll(
            '#section-what-i-bring h3, #section-skill-tree h3, #section-selected-projects h2, #section-why-devs-love-me h3, #recruiter-briefing h3'
        );

        targets.forEach(el => {
            if (el.innerText.trim().length > 2) {
                scramblers.set(el, new TextScrambler(el));
            }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sc = scramblers.get(entry.target);
                    if (sc && !entry.target.dataset.scrambled) {
                        entry.target.dataset.scrambled = 'true';
                        setTimeout(() => sc.setText(), 100);
                    }
                }
            });
        }, { threshold: 0.25 });

        targets.forEach(el => observer.observe(el));
    }

    // 1. KINETIC STAT NUMERIC COUNTERS
    // ──────────────────────────────────────────────────────────────────────────
    function initStatCounters() {
        const stats = [
            { id: 'metric-projects', targetVal: 10, prefix: '', suffix: '+' },
            { id: 'metric-lift',     targetVal: 32, prefix: '+', suffix: '%' },
            { id: 'metric-hires',    targetVal: 8,  prefix: '', suffix: '+' }
        ];

        const heroSection = document.getElementById('hero-section');
        if (!heroSection) return;

        let hasRun = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasRun) {
                    hasRun = true;
                    stats.forEach(({ id, targetVal, prefix, suffix }) => {
                        const el = document.getElementById(id);
                        if (!el) return;
                        animateCounter(el, targetVal, prefix, suffix);
                    });
                }
            });
        }, { threshold: 0.25 });

        observer.observe(heroSection);

        function animateCounter(el, targetVal, prefix, suffix) {
            if (prefersReducedMotion) {
                el.innerText = `${prefix}${targetVal}${suffix}`;
                return;
            }

            const duration = 1200;
            const startTime = performance.now();

            function step(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1.0);
                const ease = 1 - Math.pow(1 - progress, 3);
                const currentVal = Math.round(targetVal * ease);

                el.innerText = `${prefix}${currentVal}${suffix}`;

                if (progress < 1.0) {
                    requestAnimationFrame(step);
                } else {
                    el.innerText = `${prefix}${targetVal}${suffix}`;
                    el.classList.add('stat-pulse-glow');
                    setTimeout(() => el.classList.remove('stat-pulse-glow'), 500);
                }
            }
            requestAnimationFrame(step);
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. 3D GYROSCOPIC CARD TILT & SPECULAR SHEEN
    // ──────────────────────────────────────────────────────────────────────────
    function initCardTilt() {
        if (prefersReducedMotion) return;

        const cards = document.querySelectorAll(
            '.project-carousel-card, #section-why-devs-love-me .grid > div, #section-what-i-bring .glass-panel'
        );

        cards.forEach(card => {
            let sheen = card.querySelector('.specular-sheen-layer');
            if (!sheen) {
                sheen = document.createElement('div');
                sheen.className = 'specular-sheen-layer';
                card.appendChild(sheen);
            }

            let bounds = null;

            card.addEventListener('mouseenter', () => {
                bounds = card.getBoundingClientRect();
                card.style.transition = 'transform 0.12s ease-out, box-shadow 0.3s ease';
                sheen.style.opacity = '1';
            });

            card.addEventListener('mousemove', (e) => {
                if (!bounds) bounds = card.getBoundingClientRect();
                const x = e.clientX - bounds.left;
                const y = e.clientY - bounds.top;
                const centerX = bounds.width / 2;
                const centerY = bounds.height / 2;

                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`;

                const px = (x / bounds.width) * 100;
                const py = (y / bounds.height) * 100;
                sheen.style.background = `radial-gradient(circle at ${px.toFixed(1)}% ${py.toFixed(1)}%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 65%)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease';
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                sheen.style.opacity = '0';
                bounds = null;
            });
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. MAGNETIC BUTTON ATTRACTION PHYSICS
    // ──────────────────────────────────────────────────────────────────────────
    function initMagneticButtons() {
        if (prefersReducedMotion) return;

        const targets = document.querySelectorAll(
            '#hero-section a[href*="#work"], #download-cv-btn, #recruiter-briefing a.group, .hud-nav-item, #section-selected-projects a, #section-selected-projects button'
        );

        targets.forEach(btn => {
            btn.classList.add('magnetic-btn');
            let bounds = null;

            btn.addEventListener('mouseenter', () => {
                bounds = btn.getBoundingClientRect();
                btn.style.transition = 'transform 0.15s ease-out';
            });

            btn.addEventListener('mousemove', (e) => {
                if (!bounds) bounds = btn.getBoundingClientRect();
                const x = e.clientX - bounds.left;
                const y = e.clientY - bounds.top;
                const pullX = (x - bounds.width / 2) * 0.3;
                const pullY = (y - bounds.height / 2) * 0.3;

                btn.style.transform = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 0)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                btn.style.transform = 'translate3d(0, 0, 0)';
                bounds = null;
            });
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. VELOCITY-AWARE AERODYNAMIC CUSTOM CURSOR
    // ──────────────────────────────────────────────────────────────────────────
    function initVelocityCursor() {
        if (prefersReducedMotion) return;

        const cursorOuter = document.getElementById('custom-cursor');
        if (!cursorOuter) return;

        let lastX = 0, lastY = 0;
        let lastTime = performance.now();

        window.addEventListener('mousemove', (e) => {
            const now = performance.now();
            const dt = Math.max(1, now - lastTime);
            lastTime = now;

            const velX = (e.clientX - lastX) / dt;
            const velY = (e.clientY - lastY) / dt;
            lastX = e.clientX;
            lastY = e.clientY;

            const speed = Math.sqrt(velX * velX + velY * velY);
            if (speed > 1.0) {
                const angle = Math.atan2(velY, velX) * (180 / Math.PI);
                const stretch = Math.min(speed * 0.15, 0.38);
                const scaleX = 1 + stretch;
                const scaleY = 1 - stretch * 0.35;
                cursorOuter.style.transform += ` rotate(${angle.toFixed(1)}deg) scale(${scaleX.toFixed(2)}, ${scaleY.toFixed(2)})`;
            }
        }, { passive: true });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 5. FULLSCREEN IMAGE LIGHTBOX & ZOOM LOGIC
    // ──────────────────────────────────────────────────────────────────────────
    window.openLightbox = function (src) {
        const lb = document.getElementById('image-lightbox');
        const img = document.getElementById('lightbox-img');
        if (!lb || !img) return;
        img.src = src;
        lb.classList.remove('opacity-0', 'pointer-events-none');
        lb.classList.add('opacity-100', 'pointer-events-auto');
        img.classList.remove('scale-95');
        img.classList.add('scale-100');
    };

    window.closeLightbox = function () {
        const lb = document.getElementById('image-lightbox');
        const img = document.getElementById('lightbox-img');
        if (!lb || !img) return;
        lb.classList.remove('opacity-100', 'pointer-events-auto');
        lb.classList.add('opacity-0', 'pointer-events-none');
        img.classList.remove('scale-100');
        img.classList.add('scale-95');
    };

    function initImageLightboxTriggers() {
        const modalImages = document.querySelectorAll('.matrix-chapter img');
        modalImages.forEach(img => {
            img.classList.add('cursor-zoom-in', 'hover:opacity-90', 'transition-opacity');
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                window.openLightbox(img.getAttribute('src'));
            });
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 6. MODAL CHAPTER SCROLLER
    // ──────────────────────────────────────────────────────────────────────────
    window.scrollToChapter = function (btn, chapterIndex) {
        const modal = btn.closest('[id$="-modal"]');
        if (!modal) return;
        const body = modal.querySelector('.overflow-y-auto');
        if (!body) return;
        const chapters = body.querySelectorAll('.matrix-chapter');
        if (chapters && chapters[chapterIndex]) {
            chapters[chapterIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // ──────────────────────────────────────────────────────────────────────────
    // 7. SKILL MATRIX CATEGORY FILTERING
    // ──────────────────────────────────────────────────────────────────────────
    function initSkillFilter() {
        const filterBtns = document.querySelectorAll('.skill-filter-btn');
        const branches = document.querySelectorAll('#skill-nodes-container > div[data-category]');
        if (!filterBtns.length || !branches.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Active button styling
                filterBtns.forEach(b => {
                    b.className = 'skill-filter-btn px-4 py-1.5 rounded-full bg-white/5 text-neutral-400 border border-white/10 transition-all cursor-pointer';
                });
                btn.className = 'skill-filter-btn px-4 py-1.5 rounded-full bg-white/20 text-white border border-white/40 font-bold shadow-lg transition-all cursor-pointer';

                branches.forEach(branch => {
                    const cat = branch.getAttribute('data-category');
                    if (filter === 'all' || filter === cat) {
                        branch.style.display = 'flex';
                        branch.style.opacity = '1';
                        branch.style.transform = 'scale(1)';
                    } else {
                        branch.style.display = 'none';
                    }
                });
            });
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 8. KEYBOARD SHORTCUTS NAVIGATION
    // ──────────────────────────────────────────────────────────────────────────
    const PROJECT_MODALS = [
        'fintech-modal',
        'checkout-modal',
        'gallery-modal',
        'MilkDel-modal',
        'BioGrid-modal',
        'Apex-modal',
        'Silvatide-modal'
    ];

    function initKeyboardNavigation() {
        window.addEventListener('keydown', (e) => {
            const lb = document.getElementById('image-lightbox');
            if (lb && lb.classList.contains('opacity-100')) {
                if (e.key === 'Escape') {
                    window.closeLightbox();
                    return;
                }
            }

            let activeModalId = null;
            PROJECT_MODALS.forEach(id => {
                const el = document.getElementById(id);
                if (el && el.classList.contains('opacity-100')) {
                    activeModalId = id;
                }
            });

            if (e.key === 'Escape' && activeModalId) {
                if (typeof window.closeModal === 'function') {
                    window.closeModal(activeModalId);
                }
            } else if (e.key === 'ArrowRight' && activeModalId) {
                const idx = PROJECT_MODALS.indexOf(activeModalId);
                const nextIdx = (idx + 1) % PROJECT_MODALS.length;
                if (typeof window.closeModal === 'function') window.closeModal(activeModalId);
                setTimeout(() => {
                    if (typeof window.openModal === 'function') window.openModal(PROJECT_MODALS[nextIdx]);
                }, 150);
            } else if (e.key === 'ArrowLeft' && activeModalId) {
                const idx = PROJECT_MODALS.indexOf(activeModalId);
                const prevIdx = (idx - 1 + PROJECT_MODALS.length) % PROJECT_MODALS.length;
                if (typeof window.closeModal === 'function') window.closeModal(activeModalId);
                setTimeout(() => {
                    if (typeof window.openModal === 'function') window.openModal(PROJECT_MODALS[prevIdx]);
                }, 150);
            } else if (e.key === ' ' && !activeModalId && document.activeElement.tagName !== 'INPUT') {
                const track = document.getElementById('projects-carousel-track');
                if (track) {
                    e.preventDefault();
                    if (track.classList.contains('carousel-space-paused')) {
                        track.classList.remove('carousel-space-paused');
                        track.dispatchEvent(new Event('mouseleave'));
                    } else {
                        track.classList.add('carousel-space-paused');
                        track.dispatchEvent(new Event('mouseenter'));
                    }
                }
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    
    // ──────────────────────────────────────────────────────────────────────────
    // 9. PROJECT DOMAIN QUICK-FILTER
    // ──────────────────────────────────────────────────────────────────────────
    window.filterProjectDomain = function (domain) {
        const btns = document.querySelectorAll('.domain-filter-btn');
        const cards = document.querySelectorAll('.project-carousel-card');

        btns.forEach(btn => {
            if (btn.getAttribute('data-domain') === domain) {
                btn.className = 'domain-filter-btn px-3 py-1 rounded-full bg-white/20 text-white font-bold transition-all cursor-pointer shadow-md';
            } else {
                btn.className = 'domain-filter-btn px-3 py-1 rounded-full text-neutral-400 hover:text-white transition-all cursor-pointer';
            }
        });

        let firstMatch = null;
        cards.forEach(card => {
            const cardDomain = card.getAttribute('data-domain');
            if (domain === 'all' || cardDomain === domain) {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
                card.style.filter = 'none';
                if (!firstMatch) firstMatch = card;
            } else {
                card.style.opacity = '0.35';
                card.style.transform = 'scale(0.96)';
                card.style.filter = 'grayscale(60%)';
            }
        });

        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    };

    // INITIALIZATION
    // ──────────────────────────────────────────────────────────────────────────
    function initAll() {
        initTextScramble();
        initStatCounters();
        initCardTilt();
        initMagneticButtons();
        initVelocityCursor();
        initImageLightboxTriggers();
        initSkillFilter();
        initKeyboardNavigation();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
