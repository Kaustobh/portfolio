/**
 * ==========================================================================
 * HUD NAVIGATION & SCROLL TRACKER ENGINE
 * ==========================================================================
 */

const sectionRegistry = [
    { key: 'hero',        id: 'hero-section',              color: '#00F3FF', shadow: 'rgba(0,243,255,0.7)' },
    { key: 'value-prop',  id: 'section-what-i-bring',      color: '#10B981', shadow: 'rgba(16,185,129,0.7)' },
    { key: 'skill-tree',  id: 'section-skill-tree',        color: '#A855F7', shadow: 'rgba(168,85,247,0.7)' },
    { key: 'projects',    id: 'section-selected-projects', color: '#FF00A0', shadow: 'rgba(255,0,160,0.7)' },
    { key: 'dev-love',    id: 'section-why-devs-love-me', color: '#00F3FF', shadow: 'rgba(0,243,255,0.7)' },
    { key: 'briefing',    id: 'recruiter-briefing',        color: '#A3A3A3', shadow: 'rgba(163,163,163,0.6)'},
];

let currentSection = 'hero';
const sectionVisibility = {};

function updateHUDLogoTheme(hexColor) {
    const logoAura = document.getElementById('logo-hud-aura');
    const logoImg = document.getElementById('hud-logo-img');
    const logoName = document.getElementById('hud-logo-name');
    const logoDot = document.getElementById('hud-logo-status-dot');
    const logoIconBox = document.getElementById('logo-hud-icon-box');

    if (logoAura) {
        logoAura.style.backgroundColor = hexColor;
        logoAura.style.opacity = '0.5';
    }
    if (logoImg) {
        logoImg.style.filter = `drop-shadow(0 0 10px ${hexColor})`;
    }
    if (logoName) {
        logoName.style.color = hexColor;
        logoName.style.textShadow = `0 0 12px ${hexColor}80`;
    }
    if (logoDot) {
        logoDot.style.backgroundColor = hexColor;
        logoDot.style.boxShadow = `0 0 8px ${hexColor}`;
    }
    if (logoIconBox) {
        logoIconBox.style.borderColor = `${hexColor}60`;
    }
}

function updateActiveHUDDot(activeKey, force = false) {
    if (!force && activeKey === currentSection) return;
    currentSection = activeKey;

    const registry = sectionRegistry.find(s => s.key === activeKey);
    const activeColor  = registry ? registry.color  : '#00F3FF';
    const activeShadow = registry ? registry.shadow : 'rgba(0,243,255,0.7)';

    document.documentElement.style.setProperty('--accent-color', activeColor);
    document.documentElement.style.setProperty('--glow-color', activeShadow);

    updateHUDLogoTheme(activeColor);

    // Highlight category label badges & section dots
    document.querySelectorAll('.hud-nav-item').forEach(item => {
        const cat = item.getAttribute('data-category');
        const label = item.querySelector('.hud-nav-label');
        const isCatActive = (cat === activeKey);
        
        if (label) {
            if (isCatActive) {
                label.style.opacity = '1';
                label.style.transform = 'translateX(0)';
                label.style.pointerEvents = 'auto';
            } else {
                label.style.opacity = '';
                label.style.transform = '';
                label.style.pointerEvents = '';
            }
        }
    });

    document.querySelectorAll('.hud-dot').forEach(dot => {
        const sec = dot.getAttribute('data-section');
        const dotTarget = dot.querySelector('span') || dot;
        if (sec === activeKey) {
            dotTarget.style.height = '26px';
            dotTarget.style.width = '10px';
            dotTarget.style.borderRadius = '9999px';
            dotTarget.style.backgroundColor = activeColor;
            dotTarget.style.boxShadow = `0 0 16px ${activeShadow}, 0 0 30px ${activeColor}`;
            dotTarget.style.borderColor = activeColor;
            dotTarget.style.transform  = 'scale(1.1)';
        } else {
            dotTarget.style.height = '';
            dotTarget.style.width = '';
            dotTarget.style.borderRadius = '';
            dotTarget.style.backgroundColor = '';
            dotTarget.style.boxShadow = '';
            dotTarget.style.borderColor = '';
            dotTarget.style.transform  = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Smooth click handler for all HUD nav items
    document.querySelectorAll('.hud-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetEl = document.querySelector(href);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    const cat = item.getAttribute('data-category');
                    if (cat) updateActiveHUDDot(cat, true);
                }
            }
        });
    });

    // IntersectionObserver for Section Stagger Reveals & HUD Active Dot Mapping
    const hudObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting || entry.intersectionRatio > 0.15) {
                entry.target.classList.add('is-revealed');
            }
            const reg = sectionRegistry.find(s => document.getElementById(s.id) === entry.target);
            if (reg) {
                sectionVisibility[reg.key] = entry.intersectionRatio;
            }
        });

        let bestKey = currentSection;
        let bestRatio = 0;
        Object.entries(sectionVisibility).forEach(([k, ratio]) => {
            if (ratio > bestRatio) {
                bestRatio = ratio;
                bestKey = k;
            }
        });

        if (bestRatio > 0.1) {
            updateActiveHUDDot(bestKey, true);
        }
    }, {
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1.0]
    });

    sectionRegistry.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) hudObserver.observe(el);
    });

    // Throttled Scroll Listener on #work Container for real-time Sync
    const workContainer = document.getElementById('work') || window;
    let ticking = false;

    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const viewportHeight = window.innerHeight;
                sectionRegistry.forEach(({ key, id }) => {
                    const el = document.getElementById(id);
                    if (!el) return;
                    const rect = el.getBoundingClientRect();
                    const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
                    sectionVisibility[key] = visibleHeight / viewportHeight;
                });

                let bestKey = currentSection;
                let bestRatio = 0;
                Object.entries(sectionVisibility).forEach(([k, ratio]) => {
                    if (ratio > bestRatio) {
                        bestRatio = ratio;
                        bestKey = k;
                    }
                });

                if (bestRatio > 0.2) {
                    updateActiveHUDDot(bestKey, true);
                }
                ticking = false;
            });
            ticking = true;
        }
    };

    if (document.getElementById('work')) {
        document.getElementById('work').addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Force Initial Theme Sync on Load
    setTimeout(() => updateActiveHUDDot('hero', true), 100);

    // Auto-pause offscreen videos
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('video').forEach(video => {
        videoObserver.observe(video);
    });

    // Custom Cursor Engine
    const cursorOuter = document.getElementById('custom-cursor');
    const cursorInner = document.getElementById('custom-cursor-dot');
    
    if (cursorOuter && cursorInner) {
        let outerX = 0, outerY = 0;
        let targetX = 0, targetY = 0;

        window.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            cursorInner.style.transform = `translate3d(${targetX - 3}px, ${targetY - 3}px, 0)`;
        }, { passive: true });

        function updateCursor() {
            outerX += (targetX - outerX) * 0.25;
            outerY += (targetY - outerY) * 0.25;
            cursorOuter.style.transform = `translate3d(${outerX - 12}px, ${outerY - 12}px, 0)`;
            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('button, a, input, select, textarea, [onclick]');
            if (target) {
                cursorOuter.style.width = '38px';
                cursorOuter.style.height = '38px';
                cursorOuter.style.borderColor = '#FF00A0';
            } else {
                cursorOuter.style.width = '24px';
                cursorOuter.style.height = '24px';
                cursorOuter.style.borderColor = '#00F3FF';
            }
        }, { passive: true });
    }

    // Dark / Light Theme Matrix Switcher
    const themeToggle = document.getElementById('theme-matrix-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.contains('light');
            if (isLight) {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
                document.body.classList.remove('light');
                localStorage.setItem('theme_matrix', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
                document.body.classList.add('light');
                localStorage.setItem('theme_matrix', 'light');
            }
            document.dispatchEvent(new CustomEvent('themechange', { detail: { isLight: !isLight } }));
            if (typeof playSyntheticClick === 'function') playSyntheticClick('success');
        });
    }
});
