/**
 * ==========================================================================
 * SKILL TREE DATABASE & INTERACTIVE PERK NETWORK ENGINE (VERIFIED CERTS)
 * ==========================================================================
 */

const skillDatabase = {
    figma: {
        title: "Figma Pro : Advanced Figma",
        issuer: "Skillshare • Issued Aug 2026",
        credentialId: "2I4R8SENDAUC",
        credentialUrl: "https://www.coursera.org/account/accomplishments/records/2I4R8SENDAUC",
        category: "[UX & UI Design]",
        context: "Deepened skills in building scalable design systems and responsive layouts. Key areas: nested auto layouts & constraints, reusable component workflows/variants, and mobile/web UI spacing best practices. 🎨✨",
        skills: ["Advanced Figma", "Figma (Software)", "Design Systems", "Auto-Layout"],
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "Silvatide", modalId: "Silvatide-modal" },
            { name: "Bio Grid", modalId: "BioGrid-modal" }
        ]
    },
    react: {
        title: "Developing Front-End Apps with React",
        issuer: "IBM • Issued Jul 2026",
        credentialId: "PZXXD5JE5VO1",
        credentialUrl: "https://www.coursera.org/account/accomplishments/records/PZXXD5JE5VO1",
        category: "[Frontend Engineering]",
        context: "Mastered React component architecture, Redux state management, JSX extensions, hooks, and dynamic data rendering for high-performance web applications.",
        skills: ["Redux.js", "JavaScript eXtension (JSX)", "React", "State Management"],
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "Checkout", modalId: "checkout-modal" }
        ]
    },
    game_ux: {
        title: "User Experience in Game Design",
        issuer: "Epic Games • Issued May 2026",
        credentialId: "PZ97R09ORY95",
        credentialUrl: "https://www.coursera.org/account/accomplishments/records/PZ97R09ORY95",
        category: "[UX & Game Design]",
        context: "Explored how UX shapes the way players interact with games. Deepened understanding of game feel, usability, accessibility, learning curves, playtesting, and game loops — all essential for engaging experiences. 🎮✨",
        skills: ["UI/UX Research", "Game Development", "Playtesting", "Game Loops"],
        projects: [
            { name: "Apex Motorsport", modalId: "Apex-modal" },
            { name: "Art Gallery", modalId: "gallery-modal" }
        ]
    },
    game_ui: {
        title: "User Interface in Game Design",
        issuer: "Epic Games • Issued May 2026",
        credentialId: "U69AWPDMIPNF",
        credentialUrl: "https://www.coursera.org/account/accomplishments/records/U69AWPDMIPNF",
        category: "[Game UI & Unreal Engine]",
        context: "Strengthened understanding of designing and implementing game UI in Unreal Engine: HUD setup, widget design, blueprint communication, health bars, ability bars, nameplates, and interactive UI systems.",
        skills: ["Unreal Engine 4", "Game Development", "HUD Setup", "Blueprint Communication"],
        projects: [
            { name: "Apex Motorsport", modalId: "Apex-modal" },
            { name: "Bio Grid", modalId: "BioGrid-modal" }
        ]
    },
    google_ux: {
        title: "Google UX Design Professional",
        issuer: "Google • Issued May 2026",
        credentialId: "9945UZ01AOC9",
        credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/9945UZ01AOC9",
        category: "[UX Research & UI]",
        context: "Foundations of UX Design, empathizing, defining, ideating, wireframing, building low/high-fidelity prototypes in Figma, conducting UX research, dynamic UI design, and designing for social good.",
        skills: ["Figma (Software)", "Mobile Application Development", "UX Research", "Prototyping"],
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "Milk Subscription", modalId: "MilkDel-modal" }
        ]
    },
    gen_ai: {
        title: "Use Generative AI for Software Development",
        issuer: "IBM • Issued Mar 2026",
        credentialId: "ALM-COURSE_4058884",
        credentialUrl: "https://www.coursera.org",
        category: "[AI & Software Development]",
        context: "Plan: Claude/ChatGPT for requirements, user stories, architecture diagrams. Code: Start in Cursor/Copilot specs, refine functions. Test: Auto unit tests. Review: AI code reviews. Deploy: Automate docs & CI/CD.",
        skills: ["Full-Stack Development", "User-centered Design", "Generative AI", "Prompt Engineering"],
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "Apex Motorsport", modalId: "Apex-modal" }
        ]
    },
    design_thinking: {
        title: "Enterprise Design Thinking Practitioner",
        issuer: "IBM • Issued Mar 2026",
        credentialId: "af633651-9617-4675-bdc2-ed7e9556289f",
        credentialUrl: "https://www.credly.com/badges/af633651-9617-4675-bdc2-ed7e9556289f",
        category: "[Systems & Strategy]",
        context: "Applied Enterprise Design Thinking methodologies to align multidisciplinary teams around user outcomes, hill statements, playback loops, and agile iteration.",
        skills: ["UX Research", "Design Thinking", "User Outcomes", "Agile Alignment"],
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" },
            { name: "Milk Subscription", modalId: "MilkDel-modal" }
        ]
    },
    ai_solutions: {
        title: "Team Essentials for Designing AI Solutions",
        issuer: "IBM • Issued Mar 2026",
        credentialId: "f18c15e7-0962-4b2b-ae27-0e46428d116a",
        credentialUrl: "https://www.credly.com/badges/f18c15e7-0962-4b2b-ae27-0e46428d116a",
        category: "[AI Solution Architecture]",
        context: "Achieved skills in AI Solution Design, Enterprise Design Thinking, Responsible AI Frameworks, AI Intent Mapping, and Human-Centered AI integration.",
        skills: ["AI Solutions", "Artificial Intelligence (AI)", "Responsible AI", "AI Intent Mapping"],
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" }
        ]
    },
    prompt_eng: {
        title: "Craft Precise Prompts for AI Models",
        issuer: "IBM • Issued Mar 2026",
        credentialId: "ALM-COURSE_4063665",
        credentialUrl: "https://www.coursera.org",
        category: "[AI & Prompt Engineering]",
        context: "Advanced prompt engineering techniques, zero-shot/few-shot prompting, systemic evaluation of model output quality, relevance, and safety controls.",
        skills: ["Prompt Engineering", "Quality & Relevance", "LLM Evaluation"],
        projects: [
            { name: "PulseHQ AI", modalId: "fintech-modal" }
        ]
    },
    motion: {
        title: "Micro-Interactions & Motion GSAP",
        issuer: "Motion Design Specialist",
        credentialId: "MOTION-60FPS",
        credentialUrl: "#",
        category: "[UX & UI Design]",
        context: "Silky 60fps micro-animations, spring-physics compression curves, custom cursor engines, and scroll-triggered storytelling reveals.",
        skills: ["GSAP", "Spring Physics", "CSS Transforms", "Motion Design"],
        projects: [
            { name: "Checkout Flow", modalId: "checkout-modal" },
            { name: "Apex Motorsport", modalId: "Apex-modal" }
        ]
    },
    threejs: {
        title: "WebGL & Three.js 3D Canvas",
        issuer: "3D Engineering Specialist",
        credentialId: "WEBGL-3D",
        credentialUrl: "#",
        category: "[Frontend Engineering]",
        context: "Procedural GLSL shader uniforms, 3D particle terrain canvases, canvas camera matrices, and GPU compositing layer performance.",
        skills: ["WebGL", "Three.js", "GLSL Shaders", "3D Canvas"],
        projects: [
            { name: "Apex Motorsport", modalId: "Apex-modal" }
        ]
    },
    a11y: {
        title: "Accessibility Standards (WCAG 2.1 AA)",
        issuer: "Accessibility Specialist",
        credentialId: "WCAG-AA-SPEC",
        credentialUrl: "#",
        category: "[Systems & Strategy]",
        context: "WCAG 2.1 AA/AAA contrast ratios, keyboard navigation loops, screen-reader focus management, and inclusive design standards.",
        skills: ["WCAG 2.1 AA", "Screen Readers", "ARIA Tokens", "Keyboard UX"],
        projects: [
            { name: "Bio Grid", modalId: "BioGrid-modal" },
            { name: "Milk Subscription", modalId: "MilkDel-modal" }
        ]
    }
};

function highlightPath(pathId, glowColor) {
    const line = document.getElementById(pathId);
    if (line) {
        line.setAttribute('stroke', glowColor);
        line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-opacity', '1');
        line.style.filter = `drop-shadow(0 0 8px ${glowColor})`;
    }
}

function resetPath(pathId) {
    const line = document.getElementById(pathId);
    if (line) {
        line.setAttribute('stroke', '#475569');
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
    if (badgeTitleEl) badgeTitleEl.innerText = skill.issuer + (skill.credentialId ? ` • ID: ${skill.credentialId}` : '');
    if (badgeIssuerEl) {
        if (skill.credentialUrl && skill.credentialUrl !== '#') {
            badgeIssuerEl.innerHTML = `<a href="${skill.credentialUrl}" target="_blank" rel="noopener noreferrer" class="text-neon-cyan hover:underline font-bold flex items-center gap-1">Verify Credential ▶</a>`;
        } else {
            badgeIssuerEl.innerText = "Verified Technical Credential";
        }
    }

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
        if (typeof playSyntheticClick === 'function') playSyntheticClick('success');
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
        if (typeof playSyntheticClick === 'function') playSyntheticClick('click');
    }
}
