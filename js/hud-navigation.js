/**
 * ==========================================================================
 * HUD NAVIGATION & SCROLL TRACKER ENGINE
 * ==========================================================================
 */

const sectionRegistry = [
    { key: 'hero',        el: document.getElementById('hero-section'),          color: '#00F3FF', shadow: 'rgba(0,243,255,0.7)' },
    { key: 'value-prop',  el: document.getElementById('section-what-i-bring'),  color: '#10B981', shadow: 'rgba(16,185,129,0.7)' },
    { key: 'skill-tree',  el: document.getElementById('section-skill-tree'),    color: '#A855F7', shadow: 'rgba(168,85,247,0.7)' },
    { key: 'fintech',     el: document.getElementById('project-fintech'),       color: '#00F3FF', shadow: 'rgba(0,243,255,0.7)' },
    { key: 'checkout',    el: document.getElementById('project-checkout'),      color: '#FF00A0', shadow: 'rgba(255,0,160,0.7)' },
    { key: 'gallery',     el: document.getElementById('project-gallery'),       color: '#D4FF00', shadow: 'rgba(212,255,0,0.7)'  },
    { key: 'MilkDel',     el: document.getElementById('project-MilkDel'),       color: '#A8CFA1', shadow: 'rgba(168,207,161,0.7)'},
    { key: 'BioGrid',     el: document.getElementById('project-BioGrid'),       color: '#4ade80', shadow: 'rgba(74,222,128,0.7)' },
    { key: 'Apex',        el: document.getElementById('project-Apex'),          color: '#e0000a', shadow: 'rgba(224,0,10,0.7)'   },
    { key: 'Silvatide',   el: document.getElementById('project-Silvatide'),     color: '#10B981', shadow: 'rgba(16,185,129,0.7)' },
    { key: 'dev-love',    el: document.getElementById('section-why-devs-love-me'), color: '#FF00A0', shadow: 'rgba(255,0,160,0.7)' },
    { key: 'briefing',    el: document.getElementById('recruiter-briefing'),    color: '#A3A3A3', shadow: 'rgba(163,163,163,0.6)'},
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

    const isProjectSection = ['fintech', 'checkout', 'gallery', 'MilkDel', 'BioGrid', 'Apex', 'Silvatide'].includes(activeKey);
    
    // Update parent projects group indicator glow
    const projectsIndicator = document.getElementById('hud-projects-indicator');
    if (projectsIndicator) {
        if (isProjectSection) {
            projectsIndicator.style.backgroundColor = activeColor;
            projectsIndicator.style.boxShadow = `0 0 14px ${activeShadow}`;
            projectsIndicator.style.borderColor = activeColor;
        } else {
            projectsIndicator.style.backgroundColor = '';
            projectsIndicator.style.boxShadow = '';
            projectsIndicator.style.borderColor = '';
        }
    }

    // Highlight category label badges & section dots
    document.querySelectorAll('.hud-nav-item').forEach(item => {
        const cat = item.getAttribute('data-category');
        const label = item.querySelector('.hud-nav-label');
        const isCatActive = cat === activeKey || (cat === 'projects' && isProjectSection);
        
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
            // Restore active dot pill expansion back to 26px height
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
    // IntersectionObserver for Section Stagger Reveals & HUD Active Dot Mapping
    const hudObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting || entry.intersectionRatio > 0.15) {
                entry.target.classList.add('is-revealed');
            }
            const reg = sectionRegistry.find(s => s.el === entry.target);
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

        if (bestRatio > 0) {
            updateActiveHUDDot(bestKey, true);
        }
    }, {
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1.0]
    });

    sectionRegistry.forEach(({ el }) => {
        if (el) hudObserver.observe(el);
    });

    // Throttled Scroll Listener on #work Container for 100% Real-time Snap Sync
    const workContainer = document.getElementById('work');
    if (workContainer) {
        let ticking = false;
        workContainer.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const viewportHeight = workContainer.clientHeight || window.innerHeight;
                    sectionRegistry.forEach(({ key, el }) => {
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

                    if (bestRatio > 0) {
                        updateActiveHUDDot(bestKey, true);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Force Initial Theme Sync on Load
    setTimeout(() => updateActiveHUDDot('hero', true), 100);

    // 60 FPS Performance Engine: Auto-pause offscreen videos to free GPU/CPU decoders
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


    // Hardware-Accelerated Custom Cursor Engine with requestAnimationFrame
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
        const savedTheme = localStorage.getItem('theme_matrix');
        if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark');
            document.body.classList.add('light');
        } else {
            document.documentElement.classList.add('dark');
            document.body.classList.remove('light');
        }

        themeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.contains('light');
            if (isLight) {
                document.documentElement.classList.add('dark');
                document.body.classList.remove('light');
                localStorage.setItem('theme_matrix', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                document.body.classList.add('light');
                localStorage.setItem('theme_matrix', 'light');
            }
            playSyntheticClick('success');
        });
    }
});
