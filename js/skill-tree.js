/**
 * ==========================================================================
 * SKILL TREE DATABASE & INTERACTIVE PERK NETWORK ENGINE
 * ==========================================================================
 */

const skillDatabase = {
    react: {
        title: "React & Next.js",
        category: "[Frontend & Engineering]",
        context: "Engineered responsive UI architectures, modular component systems, and client/server-side data rendering for complex web applications.",
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "E-Comm Checkout", modalId: "checkout-modal" }
        ],
        badge: {
            title: "Meta Frontend Developer Professional Certificate",
            issuer: "Meta • Coursera Verified"
        }
    },
    figma: {
        title: "Figma & Auto-Layout",
        category: "[UX & UI Design]",
        context: "Built pixel-perfect, responsive component libraries utilizing Figma Auto-Layout 5.0, variables, component properties, and interactive variant states.",
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "Silvatide Cottage", modalId: "Silvatide-modal" },
            { name: "Bio Grid Telemetry", modalId: "BioGrid-modal" }
        ],
        badge: {
            title: "Google UX Design Professional Certificate",
            issuer: "Google • Coursera Verified"
        }
    },
    tokens: {
        title: "Design Systems & Tokens",
        category: "[Systems & Strategy]",
        context: "Established scalable token architectures (colors, typography, spacing, shadows) enforcing 1-to-1 parity between Figma UI kits and CSS production tokens.",
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "E-Comm Checkout", modalId: "checkout-modal" }
        ],
        badge: {
            title: "Design Systems Architecture Specialist",
            issuer: "UX Design Institute Verified"
        }
    },
    tailwind: {
        title: "TailwindCSS & Modern CSS3",
        category: "[Frontend & Engineering]",
        context: "Crafted utility-first responsive layouts, custom design system extensions, CSS grid systems, and hardware-accelerated micro-interactions.",
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "Silvatide Cottage", modalId: "Silvatide-modal" },
            { name: "Graphic Art Gallery", modalId: "gallery-modal" }
        ],
        badge: {
            title: "Advanced Responsive Web Architecture",
            issuer: "freeCodeCamp Certified"
        }
    },
    motion: {
        title: "Micro-Interactions & GSAP",
        category: "[UX & UI Design]",
        context: "Designed silky 60fps micro-animations, spring-physics transitions, custom cursor engines, and scroll-triggered storytelling reveals.",
        projects: [
            { name: "Checkout Flow", modalId: "checkout-modal" },
            { name: "Apex Motorsport", modalId: "Apex-modal" },
            { name: "Art Gallery", modalId: "gallery-modal" }
        ],
        badge: {
            title: "Web Animation & Motion Design Masterclass",
            issuer: "Awwwards Academy Certified"
        }
    },
    threejs: {
        title: "WebGL & Three.js 3D",
        category: "[Frontend & Engineering]",
        context: "Created 3D interactive particle canvases, procedural GLSL shaders, canvas camera animations, and immersive spatial web experiences.",
        projects: [
            { name: "Apex Motorsport", modalId: "Apex-modal" },
            { name: "Hero Spatial Canvas", modalId: "cv-modal" }
        ],
        badge: {
            title: "Three.js & WebGL 3D Developer Certificate",
            issuer: "Three.js Journey Verified"
        }
    },
    research: {
        title: "User Research & Personas",
        category: "[UX & UI Design]",
        context: "Conducted usability studies, heuristic evaluation audits, user journey mapping, and qualitative interviews to eliminate friction in conversion funnels.",
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "Milk Subscription", modalId: "MilkDel-modal" }
        ],
        badge: {
            title: "User Research & Interaction Design Certificate",
            issuer: "Interaction Design Foundation (IxDF)"
        }
    },
    a11y: {
        title: "Accessibility (WCAG AA)",
        category: "[Systems & Strategy]",
        context: "Enforced WCAG 2.1 AA compliance across digital products, contrast ratios, aria-labels, screen-reader focus management, and keyboard navigation.",
        projects: [
            { name: "Bio Grid Telemetry", modalId: "BioGrid-modal" },
            { name: "Milk Subscription", modalId: "MilkDel-modal" }
        ],
        badge: {
            title: "IAAP Web Accessibility Specialist (WAS)",
            issuer: "International Association of Accessibility Professionals"
        }
    },
    grid_ui: {
        title: "8pt Grid & Architecture",
        category: "[Systems & Strategy]",
        context: "Implemented standardized 8pt/4pt spatial layout grids, baseline typography ramps, and predictable layout spacing math across complex web apps.",
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "E-Comm Checkout", modalId: "checkout-modal" }
        ],
        badge: {
            title: "UI Architecture & Layout Systems",
            issuer: "Google UX Engineering Specialist"
        }
    }
};

function highlightPath(pathId, glowColor) {
    const line = document.getElementById(pathId);
    if (line) {
        line.setAttribute('stroke', glowColor);
        line.setAttribute('stroke-width', '3.5');
        line.setAttribute('stroke-opacity', '1');
        line.style.filter = `drop-shadow(0 0 10px ${glowColor})`;
    }
}

function resetPath(pathId) {
    const line = document.getElementById(pathId);
    if (line) {
        line.setAttribute('stroke', '#94A3B8');
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('stroke-opacity', '0.4');
        line.style.filter = 'none';
    }
}

function openSkillModal(skillKey) {
    const skill = skillDatabase[skillKey];
    if (!skill) return;

    const categoryEl = document.getElementById('skill-modal-category');
    const titleEl = document.getElementById('skill-modal-title');
    const contextEl = document.getElementById('skill-modal-context');
    const badgeTitleEl = document.getElementById('skill-badge-title');
    const badgeIssuerEl = document.getElementById('skill-badge-issuer');
    const projContainer = document.getElementById('skill-modal-projects');

    if (categoryEl) categoryEl.innerText = skill.category;
    if (titleEl) titleEl.innerText = skill.title;
    if (contextEl) contextEl.innerText = skill.context;
    if (badgeTitleEl) badgeTitleEl.innerText = skill.badge.title;
    if (badgeIssuerEl) badgeIssuerEl.innerText = skill.badge.issuer;

    if (projContainer) {
        projContainer.innerHTML = skill.projects.map(p => `
            <div onclick="closeSkillModal(); setTimeout(()=>openModal('${p.modalId}'), 300);" class="group relative rounded-xl overflow-hidden border border-neon-cyan/40 bg-black/80 hover:border-neon-cyan transition-all cursor-pointer p-3 flex items-center justify-between hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                <div class="flex items-center gap-2.5">
                    <span class="w-2 h-2 rounded-full bg-neon-cyan animate-ping"></span>
                    <span class="font-mono text-xs font-bold text-white group-hover:text-neon-cyan transition-colors">${p.name}</span>
                </div>
                <span class="font-mono text-[9px] font-bold text-neon-cyan bg-neon-cyan/15 px-2 py-1 rounded border border-neon-cyan/30 flex items-center gap-1 group-hover:bg-neon-cyan group-hover:text-void transition-all">
                    Launch Case Study ▶
                </span>
            </div>
        `).join('');
    }

    const modal = document.getElementById('skill-detail-modal');
    const content = document.getElementById('skill-detail-content');
    if (modal && content) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
        playSyntheticClick('success');
    }
}

function closeSkillModal() {
    const modal = document.getElementById('skill-detail-modal');
    const content = document.getElementById('skill-detail-content');
    if (modal && content) {
        modal.classList.remove('opacity-100', 'pointer-events-auto');
        modal.classList.add('opacity-0', 'pointer-events-none');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        playSyntheticClick('click');
    }
}

function filterSkillNodes(category) {
    playSyntheticClick('click');

    const tabBtns = document.querySelectorAll('.skill-tab-btn');
    tabBtns.forEach(btn => {
        const cat = btn.getAttribute('data-category');
        if (cat === category) {
            if (cat === 'all') {
                btn.className = 'skill-tab-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all bg-neon-cyan text-void shadow-neon cursor-pointer';
            } else if (cat === 'ux-ui') {
                btn.className = 'skill-tab-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all bg-neon-magenta text-void shadow-[0_0_15px_rgba(255,0,160,0.6)] cursor-pointer';
            } else if (cat === 'frontend') {
                btn.className = 'skill-tab-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all bg-neon-cyan text-void shadow-neon cursor-pointer';
            } else if (cat === 'systems') {
                btn.className = 'skill-tab-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all bg-acid-lime text-void shadow-[0_0_15px_rgba(212,255,0,0.6)] cursor-pointer';
            }
        } else {
            btn.className = 'skill-tab-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all text-neutral-400 hover:text-white cursor-pointer';
        }
    });

    const columns = document.querySelectorAll('#skill-nodes-container > div[data-category]');
    columns.forEach(col => {
        const colCat = col.getAttribute('data-category');
        if (category === 'all' || colCat === category) {
            col.style.display = 'block';
            col.style.opacity = '1';
            col.style.transform = 'scale(1)';
            col.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
            col.style.display = 'none';
            col.style.opacity = '0';
            col.style.transform = 'scale(0.95)';
        }
    });

    const svgLayer = document.querySelector('#skill-nodes-container svg');
    if (svgLayer) {
        svgLayer.style.opacity = category === 'all' ? '1' : '0.2';
    }
}
