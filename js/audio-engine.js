/**
 * ==========================================================================
 * AUDIO ENGINE & WEB AUDIO API MICRO-FEEDBACK SYNTHESIZER
 * ==========================================================================
 */
let audioCtx = null;
let isAudioMuted = false;

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSyntheticClick(type = 'click') {
    if (isAudioMuted) return;
    try {
        initAudioContext();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        if (type === 'hover') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.03);
            gain.gain.setValueAtTime(0.015, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
            osc.start(now);
            osc.stop(now + 0.03);
        } else if (type === 'click') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'success') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.05);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        }
    } catch (e) {
        // Fallback silently if audio context is blocked
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const audioToggleBtn = document.getElementById('audio-click-toggle');
    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            isAudioMuted = !isAudioMuted;
            audioToggleBtn.style.opacity = isAudioMuted ? '0.4' : '1';
            if (!isAudioMuted) playSyntheticClick('success');
        });
    }
});
