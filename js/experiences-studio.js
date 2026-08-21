/**
 * ==========================================================================
 * THE LUMINOUS PHOTON SPINE & OPTICAL LENS CONTROLLER
 * ==========================================================================
 */

(function () {
    'use strict';

    let openBranchIndex = null;
    let photonAnimFrame = null;
    let photonProgress = 0; // 0.0 to 1.0

    const lensData = [
        {
            reality: "Maintained 100% network uptime during COVID transition. Managing server hardware during emergency lockdown proved that reliability is the invisible foundation of user trust.",
            ux: "Network & Systems Thinking: Designing fault-tolerant UI states with optimistic offline sync, sub-second latency targets, and graceful connection recovery."
        },
        {
            reality: "Managed high-volume rushes with 90-second ticket cycles. Learning to read customer micro-expressions and eliminate workspace motion was user research without spreadsheets.",
            ux: "Anticipatory Cognitive Ergonomics: Slashing interaction friction through proactive defaults, zero-latency keyboard hotkeys, and muscle-memory workflows."
        },
        {
            reality: "Handled peak-volume custom orders under sensory overload. De-escalating edge cases and maintaining zero-error precision in an environment built on distraction.",
            ux: "Chaos-Resilient Architecture: Building forgiving, non-destructive interfaces that gracefully self-heal unexpected user inputs and edge-case exceptions."
        },
        {
            reality: "Orchestrated European B2B luxury fulfillment workflows and CRM data pipelines with 99.8% precision, coordinating logistics across international borders.",
            ux: "Operational Systems Scalability: Designing end-to-end atomic state machines that bridge frontend user promises with complex backend operational logic."
        },
        {
            reality: "Translated brand identities into responsive markup and WebGL shaders, ensuring 100% Core Web Vitals and frictionless performance on low-end hardware.",
            ux: "Design-to-Code Craft: Eliminating designer-developer translation loss by writing semantic production tokens and performant WebGL shaders."
        },
        {
            reality: "Designed an educational Super App overhaul with WCAG AAA token systems and usability testing with real learners, accelerating release velocity.",
            ux: "Scalable Product Systems: Synthesizing deep qualitative user research into multi-tier atomic token libraries that development teams love implementing."
        }
    ];

    // 1. Traveling Photon Bead Animation
    function animatePhoton() {
        const bead = document.getElementById('electric-photon-bead');
        const track = document.getElementById('luminous-spine-track');
        if (bead && track) {
            const trackHeight = track.clientHeight;
            photonProgress = (photonProgress + 0.0035) % 1.0;
            const topPos = photonProgress * trackHeight;
            bead.style.top = `${topPos}px`;
            
            // Check proximity to any node
            const rows = document.querySelectorAll('.branch-row');
            rows.forEach((r, idx) => {
                const nodeTop = r.offsetTop;
                if (Math.abs(topPos - nodeTop) < 14) {
                    const dot = r.querySelector('.branch-node-dot');
                    if (dot && !dot.classList.contains('active-ping')) {
                        dot.classList.add('active-ping', 'shadow-[0_0_18px_#fef08a]');
                        setTimeout(() => dot.classList.remove('shadow-[0_0_18px_#fef08a]'), 300);
                    }
                }
            });
        }
        photonAnimFrame = requestAnimationFrame(animatePhoton);
    }

    // 2. Optical Rack-Focus Toggle Branch
    function toggleBranch(index) {
        const rows = document.querySelectorAll('.branch-row');
        
        if (openBranchIndex === index) {
            // Close card
            openBranchIndex = null;
            closeAllBranchCards();
        } else {
            // Open clicked card
            openBranchIndex = index;
            closeAllBranchCards();

            // Open Desktop Card with Optical Rack-Focus Entrance
            const card = document.getElementById(`branch-card-${index}`);
            if (card) {
                card.classList.remove('hidden');
                card.style.opacity = '0';
                card.style.filter = 'blur(8px)';
                card.style.transform = index % 2 === 0 ? 'translateX(-15px)' : 'translateX(15px)';

                // Force reflow
                void card.offsetWidth;

                // Animate to clear optical lens
                card.style.opacity = '1';
                card.style.filter = 'blur(0px)';
                card.style.transform = 'translateX(0px)';
            }

            // Open Mobile Card
            const cardMobile = document.getElementById(`branch-card-mobile-${index}`);
            if (cardMobile) {
                cardMobile.classList.remove('hidden');
            }

            // Highlight Active Pill & Node Dot
            const row = rows[index];
            if (row) {
                const pill = row.querySelector('.branch-pill');
                const dot = row.querySelector('.branch-node-dot');
                if (pill) {
                    pill.classList.add('border-amber-400', 'bg-[#1a1a20]', 'shadow-[0_0_25px_rgba(251,191,36,0.3)]');
                    pill.classList.remove('border-white/10', 'bg-[#121214]');
                }
                if (dot) {
                    dot.classList.add('bg-amber-400', 'scale-125', 'shadow-[0_0_15px_#fbbf24]');
                }
            }
        }

        if (typeof playClickSound === 'function') playClickSound();
    }

    function closeAllBranchCards() {
        const cards = document.querySelectorAll('.branch-story-card, .branch-story-card-mobile');
        cards.forEach(c => c.classList.add('hidden'));

        const pills = document.querySelectorAll('.branch-pill');
        pills.forEach(p => {
            p.classList.remove('border-amber-400', 'bg-[#1a1a20]', 'shadow-[0_0_25px_rgba(251,191,36,0.3)]');
            p.classList.add('border-white/10', 'bg-[#121214]');
        });

        const dots = document.querySelectorAll('.branch-node-dot');
        dots.forEach(d => {
            d.classList.remove('bg-amber-400', 'scale-125', 'shadow-[0_0_15px_#fbbf24]');
            d.classList.add('bg-black');
        });
    }

    // 3. 2-Way Perspective Lens Switcher
    function setCardLens(cardIdx, mode, event) {
        if (event) event.stopPropagation();
        const textEl = document.getElementById(`branch-text-${cardIdx}`);
        const btnReality = document.querySelector(`.lens-btn-reality-${cardIdx}`);
        const btnUx = document.querySelector(`.lens-btn-ux-${cardIdx}`);

        if (textEl && lensData[cardIdx]) {
            textEl.style.opacity = '0';
            textEl.style.transform = 'translateY(-4px)';
            
            setTimeout(() => {
                textEl.textContent = `"${lensData[cardIdx][mode]}"`;
                textEl.style.opacity = '1';
                textEl.style.transform = 'translateY(0)';
            }, 120);
        }

        if (mode === 'reality') {
            if (btnReality) btnReality.classList.add('bg-white/10', 'text-white', 'font-bold');
            if (btnUx) btnUx.classList.remove('bg-white/10', 'text-white', 'font-bold');
        } else {
            if (btnUx) btnUx.classList.add('bg-white/10', 'text-white', 'font-bold');
            if (btnReality) btnReality.classList.remove('bg-white/10', 'text-white', 'font-bold');
        }

        if (typeof playClickSound === 'function') playClickSound();
    }

    window.toggleBranch = toggleBranch;
    window.setCardLens = setCardLens;

    // Keyboard Shortcuts [1-6] and [Escape]
    document.addEventListener('keydown', (e) => {
        if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
            toggleBranch(parseInt(e.key) - 1);
        } else if (e.key === 'Escape' && openBranchIndex !== null) {
            openBranchIndex = null;
            closeAllBranchCards();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            toggleBranch(0);
            animatePhoton();
        });
    } else {
        toggleBranch(0);
        animatePhoton();
    }
})();
