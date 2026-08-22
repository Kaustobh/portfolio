/**
 * ==========================================================================
 * HIGH-PERFORMANCE INSTANT MODAL ENGINE (0ms Latency & Pre-Warming)
 * ==========================================================================
 */

(function () {
    'use strict';

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.style.display = 'flex';
        // Force reflow for instant transition
        void modal.offsetWidth;

        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto');
        
        const content = document.getElementById(`${modalId}-content`) || modal.querySelector('.scale-95') || modal.children[1];
        if (content) {
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }
        document.body.style.overflow = 'hidden';
        if (typeof playClickSound === 'function') playClickSound();
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.remove('opacity-100', 'pointer-events-auto');
        modal.classList.add('opacity-0', 'pointer-events-none');
        
        const content = document.getElementById(`${modalId}-content`) || modal.querySelector('.scale-100') || modal.children[1];
        if (content) {
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
        }
        document.body.style.overflow = '';
        
        setTimeout(() => {
            if (modal.classList.contains('opacity-0')) {
                modal.style.display = 'none';
            }
        }, 300);

        if (typeof playCloseSound === 'function') playCloseSound();
    }

    // Pre-warm modal DOM node into browser compositor
    function prewarmModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.style.willChange = 'opacity, transform';
    }

    // Attach instant pre-warm triggers on project cards
    function initPrewarmListeners() {
        const cardMap = {
            '0': 'fintech-modal',
            '1': 'checkout-modal',
            '2': 'gallery-modal',
            '3': 'MilkDel-modal',
            '4': 'BioGrid-modal',
            '5': 'Apex-modal',
            '6': 'Silvatide-modal'
        };

        const cards = document.querySelectorAll('.project-carousel-card');
        cards.forEach(card => {
            const idx = card.getAttribute('data-index');
            const modalId = cardMap[idx];
            if (modalId) {
                card.addEventListener('pointerenter', () => prewarmModal(modalId), { passive: true });
                card.addEventListener('touchstart', () => prewarmModal(modalId), { passive: true });
            }
        });
    }

    window.openModal = openModal;
    window.closeModal = closeModal;
    window.prewarmModal = prewarmModal;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('[id$="-modal"].opacity-100, #cv-modal.opacity-100, #image-lightbox.opacity-100');
            openModals.forEach(m => {
                if (m.id === 'image-lightbox' && typeof window.closeLightbox === 'function') {
                    window.closeLightbox();
                } else {
                    closeModal(m.id);
                }
            });
            document.body.style.overflow = '';
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPrewarmListeners);
    } else {
        initPrewarmListeners();
    }
})();
