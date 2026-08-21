/**
 * ==========================================================================
 * LIGHTWEIGHT AUDIO CONTROLLER
 * - Syncs directly with Hero Background Video Audio
 * - Provides clean, instant UI Click and Modal Close sound effects
 * - Zero heavy synthesis engines, zero ambient drones, zero LFOs
 * ==========================================================================
 */

(function () {
    'use strict';

    let audioEnabled = false;
    let audioCtx = null;

    function getAudioCtx() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Clean UI micro-feedback (Fast 15ms click)
    function playClickSound() {
        if (!audioEnabled) return;
        try {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const now = ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(1000, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);

            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.02);
        } catch (e) {}
    }

    // Clean Modal Close sound (Soft 30ms downward chime)
    function playCloseSound() {
        if (!audioEnabled) return;
        try {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const now = ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, now);
            osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.04);
        } catch (e) {}
    }

    // Toggle mute/unmute synced to Hero Video and UI sound
    function toggleAudio() {
        audioEnabled = !audioEnabled;
        const heroVideo = document.getElementById('hero-bg-video');
        const audioBtn = document.getElementById('audio-click-toggle');

        if (audioEnabled) {
            getAudioCtx();
            if (heroVideo) {
                heroVideo.muted = false;
                heroVideo.play().catch(() => {});
            }
            if (audioBtn) {
                audioBtn.classList.remove('text-neutral-400');
                audioBtn.classList.add('text-neon-cyan', 'shadow-neon');
                audioBtn.title = 'Audio Active (Click to Mute)';
                audioBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
            }
            playClickSound();
        } else {
            if (heroVideo) {
                heroVideo.muted = true;
            }
            if (audioBtn) {
                audioBtn.classList.remove('text-neon-cyan', 'shadow-neon');
                audioBtn.classList.add('text-neutral-400');
                audioBtn.title = 'Audio Muted (Click to Unmute)';
                audioBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>`;
            }
        }
    }

    // Expose globals
    window.playClickSound = playClickSound;
    window.playCloseSound = playCloseSound;
    window.playSyntheticClick = (type) => (type === 'error' || type === 'close' ? playCloseSound() : playClickSound());
    window.toggleAudio = toggleAudio;

    document.addEventListener('DOMContentLoaded', () => {
        const audioBtn = document.getElementById('audio-click-toggle');
        if (audioBtn) {
            audioBtn.addEventListener('click', toggleAudio);
        }

        // Attach click sound to interactive buttons and links
        document.addEventListener('click', (e) => {
            if (e.target.closest('button, a, select, input')) {
                playClickSound();
            }
        }, { passive: true });
    });
})();
