/**
 * ==========================================================================
 * MODAL CONTROL ENGINE
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

window.openModal = openModal;
window.closeModal = closeModal;

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
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
