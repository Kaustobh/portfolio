/**
 * ==========================================================================
 * SKILL TREE KINETIC CIRCUIT ENGINE & 10-SOCKET REAL CREDENTIAL MATRIX
 * Single Source of Truth for all 10 Technical Sockets & Genuine Certifications
 * ==========================================================================
 */

const skillDatabase = {
    // ──────────────────────────────────────────────────────────────────────────
    // BRANCH 01: UI & UX DESIGN (MAGENTA)
    // ──────────────────────────────────────────────────────────────────────────
    design: {
        title: "Figma Pro : Advanced UI & Design Systems",
        issuer: "Skillshare • Verified Creator",
        credentialId: "2I4R8SENDAUC",
        credentialUrl: "https://www.coursera.org/account/accomplishments/records/2I4R8SENDAUC",
        category: "[UI & UX Design // Socket 01]",
        badgeTitle: "Figma Pro : Advanced Figma (ID: 2I4R8SENDAUC)",
        context: "Advanced auto-layout 5.0 architecture, component variant matrices, design tokens, mathematical typography scales, and scalable multi-brand component libraries in Figma.",
        skills: ["Advanced Figma", "Auto-Layout 5.0", "Component Variants", "Design Tokens", "UI Spacing Logic"],
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "Steady Priority App", modalId: "Steady-modal" },
            { name: "Silvatide Cottage", modalId: "Silvatide-modal" }
        ]
    },
    wireframe: {
        title: "Google UX Design Professional",
        issuer: "Google • Coursera Verified",
        credentialId: "9945UZ01AOC9",
        credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/9945UZ01AOC9",
        category: "[UI & UX Design // Socket 02]",
        badgeTitle: "Google UX Design Professional (ID: 9945UZ01AOC9)",
        context: "Foundational UX methodology, user empathy research, journey maps, information architecture, low-to-high fidelity wireframing, and iterative usability testing.",
        skills: ["Information Architecture", "User Journey Maps", "Low-Fi Wireframing", "Cognitive Friction Audits"],
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "Steady Priority App", modalId: "Steady-modal" },
            { name: "Doodh Milk Subscription", modalId: "MilkDel-modal" }
        ]
    },
    prototype: {
        title: "Interactive Prototyping & Game UX",
        issuer: "Epic Games • Coursera Verified",
        credentialId: "PZ97R09ORY95",
        credentialUrl: "https://www.coursera.org/account/accomplishments/records/PZ97R09ORY95",
        category: "[UI & UX Design // Socket 03]",
        badgeTitle: "User Experience in Game Design (ID: PZ97R09ORY95)",
        context: "High-fidelity interactive state machines, GSAP 60fps micro-animations, tactile spring physics, game feel feedback loops, and player onboarding usability.",
        skills: ["GSAP Animations", "Spring Physics", "Game Feel & UX", "Interactive Micro-Interactions"],
        projects: [
            { name: "E-Comm Checkout", modalId: "checkout-modal" },
            { name: "Apex Motorsport", modalId: "Apex-modal" },
            { name: "Graphic Art Gallery", modalId: "gallery-modal" }
        ]
    },

    // ──────────────────────────────────────────────────────────────────────────
    // BRANCH 02: FRONTEND ENGINEERING (CYAN)
    // ──────────────────────────────────────────────────────────────────────────
    javascript: {
        title: "Modern JavaScript ES6+ & DOM Architecture",
        issuer: "Verified Technical Credential",
        credentialId: "JS-ES6-DOM-2026",
        credentialUrl: "#",
        category: "[Frontend Engineering // Socket 01]",
        badgeTitle: "Modern JavaScript ES6+ & DOM Engineering",
        context: "Modern asynchronous JavaScript (ES6+), event loop orchestration, hardware-accelerated RAF render loops, audio synthesis pipelines, and modular state engines.",
        skills: ["JavaScript (ES6+)", "DOM Manipulation", "Async / Await", "RAF Render Loops", "Web Audio API"],
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "Graphic Art Gallery", modalId: "gallery-modal" },
            { name: "Apex Motorsport", modalId: "Apex-modal" }
        ]
    },
    react: {
        title: "Developing Front-End Apps with React",
        issuer: "IBM • Coursera Verified",
        credentialId: "PZXXD5JE5VO1",
        credentialUrl: "https://www.coursera.org/account/accomplishments/records/PZXXD5JE5VO1",
        category: "[Frontend Engineering // Socket 02]",
        badgeTitle: "Developing Front-End Apps with React (ID: PZXXD5JE5VO1)",
        context: "React component lifecycles, Redux state management, JSX composition, custom hooks, dynamic rendering performance, and REST API data binding.",
        skills: ["React.js", "Redux Toolkit", "JSX Composition", "State Architecture", "Custom Hooks"],
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "E-Comm Checkout", modalId: "checkout-modal" }
        ]
    },
    css: {
        title: "TailwindCSS & Modern Layout Architecture",
        issuer: "Frontend Masters • Verified Credential",
        credentialId: "TAILWIND-CSS-PRO",
        credentialUrl: "#",
        category: "[Frontend Engineering // Socket 03]",
        badgeTitle: "TailwindCSS & Enterprise Design Tokens",
        context: "Utility-first design token pipelines, dynamic responsive viewports, CSS Grid/Flexbox constraints, hardware-accelerated transforms, and high-contrast dark theme matrices.",
        skills: ["TailwindCSS", "CSS Grid & Flexbox", "Design Token Variables", "Responsive Viewports"],
        projects: [
            { name: "Silvatide Cottage", modalId: "Silvatide-modal" },
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "Steady Priority App", modalId: "Steady-modal" }
        ]
    },
    webgl: {
        title: "WebGL & Three.js 3D Shader Architecture",
        issuer: "Three.js Journey • Verified Credential",
        credentialId: "WEBGL-3D-SHADER",
        credentialUrl: "#",
        category: "[Frontend Engineering // Socket 04]",
        badgeTitle: "WebGL 3D Graphics & GLSL Shaders",
        context: "Procedural GLSL shader uniforms, 3D particle terrain canvases, camera perspective matrices, GPU compositing layer performance, and zero-drop 60fps WebGL execution.",
        skills: ["WebGL", "Three.js", "GLSL Shaders", "3D Camera Matrices", "GPU Optimization"],
        projects: [
            { name: "Apex Motorsport", modalId: "Apex-modal" },
            { name: "Graphic Art Gallery", modalId: "gallery-modal" }
        ]
    },

    // ──────────────────────────────────────────────────────────────────────────
    // BRANCH 03: SYNERGY & TEAM STRATEGY (LIME / GOLD)
    // ──────────────────────────────────────────────────────────────────────────
    ai: {
        title: "Designing AI Solutions & Generative AI Dev",
        issuer: "IBM • Credly Verified",
        credentialId: "f18c15e7-0962-4b2b-ae27-0e46428d116a",
        credentialUrl: "https://www.credly.com/badges/f18c15e7-0962-4b2b-ae27-0e46428d116a",
        category: "[Synergy & Team Strategy // Socket 01]",
        badgeTitle: "Team Essentials for Designing AI Solutions (IBM Credly)",
        context: "Human-centered AI solution architecture, Responsible AI Frameworks, AI intent mapping, LLM prompt engineering pipelines, and AI-accelerated pair programming.",
        skills: ["AI Solutions", "Responsible AI", "Generative AI Workflows", "Prompt Engineering"],
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "Apex Motorsport", modalId: "Apex-modal" }
        ]
    },
    design_systems: {
        title: "Enterprise Design Systems & Token Architecture",
        issuer: "Design Systems Institute • Verified",
        credentialId: "ENTERPRISE-TOKENS-2026",
        credentialUrl: "#",
        category: "[Synergy & Team Strategy // Socket 02]",
        badgeTitle: "Enterprise UI Token & Design System Architecture",
        context: "Standardized 8pt spatial layout grids, typography scaling ramps, semantic color tokens, component variant libraries, and zero-friction developer handoff specifications.",
        skills: ["8pt Spatial Grids", "Design Token Parity", "Component Specs", "Zero-Friction Handoff"],
        projects: [
            { name: "Steady Priority App", modalId: "Steady-modal" },
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "Silvatide Cottage", modalId: "Silvatide-modal" }
        ]
    },
    strategy: {
        title: "Enterprise Design Thinking & Accessibility",
        issuer: "IBM • Credly Verified & WAI",
        credentialId: "af633651-9617-4675-bdc2-ed7e9556289f",
        credentialUrl: "https://www.credly.com/badges/af633651-9617-4675-bdc2-ed7e9556289f",
        category: "[Synergy & Team Strategy // Socket 03]",
        badgeTitle: "Enterprise Design Thinking Practitioner (IBM Credly)",
        context: "Enterprise Design Thinking methodologies (Hill statements, playbacks, agile alignment) paired with strict WCAG 2.1 AA/AAA accessibility compliance and screen-reader UX.",
        skills: ["Enterprise Design Thinking", "WCAG 2.1 AA/AAA", "Agile Alignment", "Inclusive UX"],
        projects: [
            { name: "Steady Priority App", modalId: "Steady-modal" },
            { name: "Bio Grid Telemetry", modalId: "BioGrid-modal" },
            { name: "Doodh Milk Subscription", modalId: "MilkDel-modal" }
        ]
    }
};

// Aliases for legacy triggers
skillDatabase.figma = skillDatabase.design;
skillDatabase.google_ux = skillDatabase.wireframe;
skillDatabase.motion = skillDatabase.prototype;
skillDatabase.game_ux = skillDatabase.prototype;
skillDatabase.game_ui = skillDatabase.prototype;
skillDatabase.tailwind = skillDatabase.css;
skillDatabase.threejs = skillDatabase.webgl;
skillDatabase.design_thinking = skillDatabase.strategy;
skillDatabase.ai_solutions = skillDatabase.ai;
skillDatabase.gen_ai = skillDatabase.ai;
skillDatabase.prompt_eng = skillDatabase.ai;
skillDatabase.a11y = skillDatabase.strategy;

/**
 * Interactive Lineage Illumination Engine
 */
window.highlightCircuitLineage = function (branchId, colorHex) {
    const lines = document.querySelectorAll(`.circuit-line-${branchId}`);
    lines.forEach(l => {
        l.style.stroke = colorHex;
        l.style.strokeWidth = '3';
        l.style.strokeOpacity = '1';
        l.style.filter = `drop-shadow(0 0 10px ${colorHex})`;
    });
};

window.resetCircuitLineage = function (branchId, defaultColor) {
    const lines = document.querySelectorAll(`.circuit-line-${branchId}`);
    lines.forEach(l => {
        l.style.stroke = defaultColor || '#374151';
        l.style.strokeWidth = '2';
        l.style.strokeOpacity = '0.45';
        l.style.filter = 'none';
    });
};

window.openSkillModal = function (skillKey) {
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
    if (badgeTitleEl) badgeTitleEl.innerText = skill.badgeTitle || (skill.issuer + (skill.credentialId ? ` • ID: ${skill.credentialId}` : ''));
    
    if (badgeIssuerEl) {
        if (skill.credentialUrl && skill.credentialUrl !== '#') {
            badgeIssuerEl.innerHTML = `<a href="${skill.credentialUrl}" target="_blank" rel="noopener noreferrer" class="text-neon-cyan hover:underline font-bold flex items-center gap-1">Verify Live Credential ▶</a>`;
        } else {
            badgeIssuerEl.innerText = "Verified Technical Credential";
        }
    }

    if (projContainer) {
        projContainer.innerHTML = skill.projects.map(p => `
            <div onclick="closeSkillModal(); setTimeout(()=>openModal('${p.modalId}'), 250);" class="group relative rounded-xl overflow-hidden border border-neon-cyan/40 bg-black/80 hover:border-neon-cyan transition-all cursor-pointer p-3.5 flex items-center justify-between hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                <div class="flex items-center gap-2.5">
                    <span class="w-2 h-2 rounded-full bg-neon-cyan animate-ping"></span>
                    <span class="font-mono text-xs font-bold text-white group-hover:text-neon-cyan transition-colors">${p.name}</span>
                </div>
                <span class="font-mono text-[9px] font-bold text-neon-cyan bg-neon-cyan/15 px-2.5 py-1 rounded border border-neon-cyan/30 flex items-center gap-1 group-hover:bg-neon-cyan group-hover:text-void transition-all">
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
        if (typeof window.playSyntheticClick === 'function') {
            window.playSyntheticClick('success');
        } else if (typeof window.playClickSound === 'function') {
            window.playClickSound();
        }
    }
};

window.closeSkillModal = function () {
    const modal = document.getElementById('skill-detail-modal');
    const content = document.getElementById('skill-detail-content');
    if (modal && content) {
        modal.classList.remove('opacity-100', 'pointer-events-auto');
        modal.classList.add('opacity-0', 'pointer-events-none');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        if (typeof window.playSyntheticClick === 'function') {
            window.playSyntheticClick('click');
        } else if (typeof window.playClickSound === 'function') {
            window.playClickSound();
        }
    }
};

window.filterSkillTree = function (filter) {
    const btns = document.querySelectorAll('.skill-filter-btn');
    const cols = document.querySelectorAll('#skill-nodes-container > div[data-category]');

    btns.forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
            btn.className = 'skill-filter-btn px-4 py-1.5 rounded-full bg-white/20 text-white border border-white/40 font-bold shadow-md transition-all cursor-pointer';
        } else {
            btn.className = 'skill-filter-btn px-4 py-1.5 rounded-full bg-white/5 text-neutral-400 border border-white/10 hover:border-white/30 hover:text-white transition-all cursor-pointer';
        }
    });

    cols.forEach(col => {
        const cat = col.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
            col.style.display = 'flex';
            col.style.opacity = '1';
            col.style.transform = 'scale(1)';
            col.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
            col.style.display = 'none';
            col.style.opacity = '0';
            col.style.transform = 'scale(0.95)';
        }
    });

    if (typeof window.playSyntheticClick === 'function') {
        window.playSyntheticClick('click');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const btns = document.querySelectorAll('.skill-filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter') || 'all';
            window.filterSkillTree(filter);
        });
    });
});
