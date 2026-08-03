/**
 * ==========================================================================
 * AUDIO ENGINE: SOOTHING AMBIENT HYMN MUSIC & UI MICRO-FEEDBACK SYNTHESIZER
 * ==========================================================================
 */

let audioCtx = null;
let isAudioMuted = false;
let ambientGainNode = null;
let ambientOscillators = [];
let isAmbientPlaying = false;

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Generates a soothing ambient hymn chord (Cmaj9: C4, E4, G4, B4, D5) with warm low-pass filtering
function startSoothingAmbientHymn() {
    if (isAmbientPlaying || isAudioMuted) return;
    try {
        initAudioContext();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;
        
        // Master Ambient Gain Node
        ambientGainNode = audioCtx.createGain();
        ambientGainNode.gain.setValueAtTime(0.001, now);
        ambientGainNode.gain.exponentialRampToValueAtTime(0.028, now + 3.0); // Smooth 3s fade-in

        // Low-pass filter for warm, relaxing, soothing atmosphere
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);
        filter.Q.setValueAtTime(1.5, now);

        // Warm LFO Filter Sweep (subtle breathing modulation)
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.frequency.setValueAtTime(0.1, now); // 0.1Hz slow modulation
        lfoGain.gain.setValueAtTime(80, now);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start(now);

        // Soothing Hymn Frequencies (C4, E4, G4, B4, D5)
        const chordFrequencies = [261.63, 329.63, 392.00, 493.88, 587.33];
        ambientOscillators = [];

        chordFrequencies.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            // Micro-detune for lush spatial chorus width
            const detuneAmount = (i - 2) * 2.5;
            osc.detune.setValueAtTime(detuneAmount, now);

            osc.connect(filter);
            osc.start(now);
            ambientOscillators.push(osc);
        });

        filter.connect(ambientGainNode);
        ambientGainNode.connect(audioCtx.destination);
        isAmbientPlaying = true;
    } catch (e) {
        // Fallback silently if audio policy restricts context
    }
}

function stopSoothingAmbientHymn() {
    if (!isAmbientPlaying) return;
    try {
        if (ambientGainNode && audioCtx) {
            const now = audioCtx.currentTime;
            ambientGainNode.gain.setValueAtTime(ambientGainNode.gain.value, now);
            ambientGainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
            setTimeout(() => {
                ambientOscillators.forEach(osc => {
                    try { osc.stop(); } catch (e) {}
                });
                ambientOscillators = [];
                isAmbientPlaying = false;
            }, 500);
        }
    } catch (e) {
        isAmbientPlaying = false;
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
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'success') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.05);
            gain.gain.setValueAtTime(0.035, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        }
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
    const audioToggleBtn = document.getElementById('audio-click-toggle');
    
    // Auto-start soothing ambient music on load / first user gesture
    const startAudioOnInteraction = () => {
        if (!isAudioMuted && !isAmbientPlaying) {
            startSoothingAmbientHymn();
        }
        window.removeEventListener('click', startAudioOnInteraction);
        window.removeEventListener('scroll', startAudioOnInteraction);
        window.removeEventListener('keydown', startAudioOnInteraction);
    };

    window.addEventListener('click', startAudioOnInteraction, { passive: true });
    window.addEventListener('scroll', startAudioOnInteraction, { passive: true });
    window.addEventListener('keydown', startAudioOnInteraction, { passive: true });

    // Try starting immediately on load
    setTimeout(startSoothingAmbientHymn, 300);

    // Top Right Mute / Unmute Toggle Button Handler
    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            isAudioMuted = !isAudioMuted;
            if (isAudioMuted) {
                stopSoothingAmbientHymn();
                audioToggleBtn.style.opacity = '0.4';
                audioToggleBtn.title = "Unmute soothing ambient music";
            } else {
                startSoothingAmbientHymn();
                audioToggleBtn.style.opacity = '1';
                audioToggleBtn.title = "Mute soothing ambient music";
                playSyntheticClick('success');
            }
        });
    }
});
