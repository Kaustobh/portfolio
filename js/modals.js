/**
 * ==========================================================================
 * MODAL CONTROL & POPUP ENGINE
 * ==========================================================================
 */

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
    
    const content = modal.querySelector('.scale-95') || modal.children[1];
    if (content) {
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    }
    playSyntheticClick('success');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    modal.classList.add('opacity-0', 'pointer-events-none');
    
    const content = modal.querySelector('.scale-100') || modal.children[1];
    if (content) {
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
    }
    playSyntheticClick('click');
}

function openVideoModal(videoSrc, title) {
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('modal-video-player');
    const titleEl = document.getElementById('video-modal-title');
    
    if (player && titleEl && modal) {
        player.src = videoSrc;
        titleEl.innerText = title || "Project Video Walkthrough";
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto');
        player.play();
        playSyntheticClick('success');
    }
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('modal-video-player');
    if (player && modal) {
        player.pause();
        player.currentTime = 0;
        modal.classList.remove('opacity-100', 'pointer-events-auto');
        modal.classList.add('opacity-0', 'pointer-events-none');
        playSyntheticClick('click');
    }
}

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
