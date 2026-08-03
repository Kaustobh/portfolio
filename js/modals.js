/**
 * ==========================================================================
 * MODAL CONTROL & FULLSCREEN VIDEO POPUP ENGINE
 * ==========================================================================
 */

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
    
    const content = document.getElementById(`${modalId}-content`) || modal.querySelector('.scale-95') || modal.children[1];
    if (content) {
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    }
    document.body.style.overflow = 'hidden';
    if (typeof playSyntheticClick === 'function') playSyntheticClick('success');
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
    if (typeof playSyntheticClick === 'function') playSyntheticClick('click');
}

function openVideoModal(videoSrc, kpiTitle, kpiText, caseStudyModalId) {
    const modal = document.getElementById('video-modal');
    if (!modal) return;
    const content = document.getElementById('video-modal-content');
    const player = document.getElementById('video-modal-player');
    
    const finalSrc = videoSrc || 'NexusFin_tech.mp4';
    const finalTitle = kpiTitle || 'Fintech Dashboard // KPI Preview';
    const finalTex = kpiText || 'Reduced task time by 40%';
    const finalModalId = caseStudyModalId || 'fintech-modal';
    
    if (player) {
        const sourceEl = player.querySelector('source');
        if (sourceEl) sourceEl.setAttribute('src', finalSrc);
        player.src = finalSrc;
        player.currentTime = 0;
        player.muted = false;
        player.load();
        player.play().catch(e => console.log("Autoplay info:", e));
    }
    
    const titleEl = modal.querySelector('.video-kpi-title');
    const textEl = modal.querySelector('.video-kpi-text');
    const linkEl = modal.querySelector('.video-case-study-link');
    
    if (titleEl) titleEl.textContent = finalTitle;
    if (textEl) textEl.textContent = finalTex;
    if (linkEl && finalModalId) {
        linkEl.style.display = 'flex';
        linkEl.setAttribute('onclick', `event.preventDefault(); closeVideoModal(); setTimeout(()=>openModal('${finalModalId}'), 300);`);
    }
    
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
    if (content) {
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    }
    document.body.style.overflow = 'hidden';
    if (typeof playSyntheticClick === 'function') playSyntheticClick('success');
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    if (!modal) return;
    const content = document.getElementById('video-modal-content');
    const player = document.getElementById('video-modal-player');
    
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    if (content) {
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
    }
    if (player) player.pause();
    document.body.style.overflow = '';
    if (typeof playSyntheticClick === 'function') playSyntheticClick('click');
}

window.openModal = openModal;
window.closeModal = closeModal;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVideoModal();
        closeModal('cv-modal');
        closeModal('fintech-modal');
        closeModal('checkout-modal');
        closeModal('gallery-modal');
        closeModal('MilkDel-modal');
        closeModal('BioGrid-modal');
        closeModal('Apex-modal');
        closeModal('Silvatide-modal');
        closeModal('skill-detail-modal');
    }
});
