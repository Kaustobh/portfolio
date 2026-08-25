/**
 * ==========================================================================
 * AI CHATBOT REPRESENTATIVE & AUTOMATED SCHEDULER ENGINE
 * ==========================================================================
 */

(function () {
    'use strict';

    // ──────────────────────────────────────────────────────────────────────────
    // 1. AUTOMATED BOOKING SCHEDULER
    // ──────────────────────────────────────────────────────────────────────────
    let selectedDateNode = '';
    let selectedTimeNode = '';

    window.openBookingScheduler = function () {
        const bookTrigger = document.getElementById('book-walkthrough-trigger');
        const schedulerPanel = document.getElementById('booking-scheduler-panel');
        if (!bookTrigger || !schedulerPanel) return;

        bookTrigger.classList.add('hidden');
        schedulerPanel.classList.remove('max-h-0', 'opacity-0', 'scale-95');
        schedulerPanel.classList.add('max-h-[500px]', 'opacity-100', 'scale-100');
        populateDateRow();
        if (typeof window.playSyntheticClick === 'function') window.playSyntheticClick('success');
    };

    window.populateDateRow = function () {
        const dateRow = document.getElementById('scheduler-date-row');
        if (!dateRow) return;
        dateRow.innerHTML = '';

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let count = 0;
        let dateIter = new Date();

        while (count < 5) {
            if (dateIter.getDay() === 0) {
                dateIter.setDate(dateIter.getDate() + 1);
                continue;
            }

            const dayName = days[dateIter.getDay()];
            const dateNum = dateIter.getDate();
            const monthName = months[dateIter.getMonth()];
            const fullDateStr = `${dayName}, ${dateNum} ${monthName}`;

            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = "grow p-2.5 bg-black/40 border border-white/10 hover:border-lime-400 text-white rounded-xl text-center transition-all cursor-pointer select-none";
            chip.innerHTML = `<p class="text-[9px] uppercase text-neutral-400 font-mono">${dayName}</p><p class="text-xs font-bold font-mono">${dateNum}</p>`;
            chip.setAttribute('data-date', fullDateStr);

            chip.addEventListener('click', () => {
                const siblings = dateRow.querySelectorAll('button');
                siblings.forEach(s => {
                    s.className = "grow p-2.5 bg-black/40 border border-white/10 hover:border-lime-400 text-white rounded-xl text-center transition-all cursor-pointer select-none";
                });

                chip.className = "grow p-2.5 bg-lime-500/20 border-2 border-lime-400 text-lime-300 rounded-xl text-center font-bold font-mono transition-all cursor-pointer shadow-[0_0_15px_rgba(212,255,0,0.3)]";
                selectedDateNode = fullDateStr;
                populateTimeRow();
                validateSchedulerStep();
                if (typeof window.playSyntheticClick === 'function') window.playSyntheticClick('click');
            });

            dateRow.appendChild(chip);
            dateIter.setDate(dateIter.getDate() + 1);
            count++;
        }
    };

    window.populateTimeRow = function () {
        const timeRow = document.getElementById('scheduler-time-row');
        if (!timeRow) return;
        timeRow.innerHTML = '';
        const times = ["10:00 AM", "01:30 PM", "04:00 PM", "06:30 PM", "08:00 PM"];

        times.forEach(t => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = "px-3 py-1.5 bg-white/5 border border-white/10 hover:border-lime-400 text-white text-[10px] font-mono rounded-lg transition-all cursor-pointer select-none";
            btn.innerText = t;

            btn.addEventListener('click', () => {
                const siblings = timeRow.querySelectorAll('button');
                siblings.forEach(s => {
                    s.className = "px-3 py-1.5 bg-white/5 border border-white/10 hover:border-lime-400 text-white text-[10px] font-mono rounded-lg transition-all cursor-pointer select-none";
                });
                btn.className = "px-3 py-1.5 bg-lime-500/20 border-2 border-lime-400 text-lime-300 font-bold text-[10px] font-mono rounded-lg transition-all cursor-pointer shadow-[0_0_12px_rgba(212,255,0,0.3)]";
                selectedTimeNode = t;
                validateSchedulerStep();
                if (typeof window.playSyntheticClick === 'function') window.playSyntheticClick('click');
            });

            timeRow.appendChild(btn);
        });
    };

    window.validateSchedulerStep = function () {
        const nextBtn = document.getElementById('scheduler-next-btn');
        if (!nextBtn) return;
        if (selectedDateNode && selectedTimeNode) {
            nextBtn.removeAttribute('disabled');
            nextBtn.className = "w-full py-3 bg-lime-400 hover:bg-white text-black font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(212,255,0,0.4)] cursor-pointer";
        } else {
            nextBtn.setAttribute('disabled', 'true');
            nextBtn.className = "w-full py-3 bg-white/10 text-neutral-500 font-mono text-xs uppercase tracking-wider rounded-xl cursor-not-allowed";
        }
    };

    window.handleSchedulerNext = function () {
        const step1 = document.getElementById('scheduler-step-1');
        const step2 = document.getElementById('scheduler-step-2');
        const nextBtn = document.getElementById('scheduler-next-btn');
        const indicator = document.getElementById('scheduler-step-indicator');

        if (step1 && step2) {
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            if (indicator) indicator.innerText = `Step 2 // Confirm ${selectedDateNode} @ ${selectedTimeNode}`;
            if (nextBtn) {
                nextBtn.innerText = "Confirm & Send Calendar Invite ↗";
                nextBtn.onclick = function () {
                    const emailInput = document.getElementById('scheduler-guest-email');
                    const email = emailInput ? emailInput.value.trim() : '';
                    if (email) {
                        window.location.href = `mailto:Kaustobh1920@gmail.com?subject=Walkthrough%20Booking%20(${selectedDateNode}%20at%20${selectedTimeNode})&body=Hi%20Kaustobh,%0A%0AI%20would%20like%20to%20confirm%20a%2020-minute%20walkthrough%20on%20${selectedDateNode}%20at%20${selectedTimeNode}.%0A%0AMy%20Email:%20${email}`;
                    } else {
                        alert('Please enter your contact email.');
                    }
                };
            }
        }
    };

    window.resetBookingScheduler = function () {
        const bookTrigger = document.getElementById('book-walkthrough-trigger');
        const schedulerPanel = document.getElementById('booking-scheduler-panel');
        if (bookTrigger) bookTrigger.classList.remove('hidden');
        if (schedulerPanel) {
            schedulerPanel.classList.add('max-h-0', 'opacity-0', 'scale-95');
            schedulerPanel.classList.remove('max-h-[500px]', 'opacity-100', 'scale-100');
        }
    };

    // ──────────────────────────────────────────────────────────────────────────
    // 2. AI CHATBOT ASSISTANT
    // ──────────────────────────────────────────────────────────────────────────
    let isChatOpen = false;

    window.toggleAIChat = function () {
        const win = document.getElementById('ai-chat-window');
        if (!win) return;
        isChatOpen = !isChatOpen;

        if (isChatOpen) {
            win.classList.remove('opacity-0', 'scale-95', 'pointer-events-none', 'translate-y-4');
            win.classList.add('opacity-100', 'scale-100', 'pointer-events-auto', 'translate-y-0');
        } else {
            win.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto', 'translate-y-0');
            win.classList.add('opacity-0', 'scale-95', 'pointer-events-none', 'translate-y-4');
        }
        if (typeof window.playSyntheticClick === 'function') window.playSyntheticClick('click');
    };

    const chatAnswers = {
        "who is kaustobh": "Kaustobh Bhattacharya is a UX Designer & Frontend Engineer specializing in data-driven design systems, WCAG AAA accessibility, 60fps micro-interactions, and WebGL experiences.",
        "fintech": "PulseHQ AI is a proactive manager intelligence platform that compresses sprint telemetry into sub-3-second AI action cards with +38% decision velocity lift.",
        "checkout": "E-Comm Checkout is an interactive customizer that reduced cart abandonment by +32% using real-time DOM validations and haptic feedback physics.",
        "steady": "Steady is a calm priority manager that isolates the single highest-impact action tailored to real-time energy levels without rigid calendar blocks.",
        "silvatide": "Silvatide Cottage is an Astro-powered luxury retreat frontend featuring typography clip-path masking and +29% direct reservation lift.",
        "default": "I can help orient your search through Kaustobh's case studies, skills matrix, verified credentials, or schedule a 20-minute walkthrough!"
    };

    window.handleChatSend = function () {
        const input = document.getElementById('ai-chat-input');
        const log = document.getElementById('ai-chat-log');
        if (!input || !log) return;

        const text = input.value.trim();
        if (!text) return;

        // User bubble
        const userBubble = document.createElement('div');
        userBubble.className = "flex flex-col items-end gap-1";
        userBubble.innerHTML = `<span class="text-[8px] font-mono text-neutral-400">You</span><div class="bg-cyan-500/20 text-white rounded-lg rounded-tr-none p-2.5 max-w-[85%] border border-cyan-500/30">${text}</div>`;
        log.appendChild(userBubble);
        input.value = '';
        log.scrollTop = log.scrollHeight;

        // Bot response
        setTimeout(() => {
            let reply = chatAnswers.default;
            const lower = text.toLowerCase();
            if (lower.includes('who') || lower.includes('about')) reply = chatAnswers["who is kaustobh"];
            else if (lower.includes('fintech') || lower.includes('pulse')) reply = chatAnswers.fintech;
            else if (lower.includes('checkout') || lower.includes('ecomm')) reply = chatAnswers.checkout;
            else if (lower.includes('steady')) reply = chatAnswers.steady;
            else if (lower.includes('silvatide')) reply = chatAnswers.silvatide;

            const botBubble = document.createElement('div');
            botBubble.className = "flex flex-col items-start gap-1";
            botBubble.innerHTML = `<span class="text-[8px] font-mono text-neon-cyan">K-Bot</span><div class="bg-white/5 text-neutral-200 rounded-lg rounded-tl-none p-2.5 max-w-[85%] border border-white/10">${reply}</div>`;
            log.appendChild(botBubble);
            log.scrollTop = log.scrollHeight;
            if (typeof window.playSyntheticClick === 'function') window.playSyntheticClick('success');
        }, 400);
    };

    window.sendChipQuestion = function (question) {
        const input = document.getElementById('ai-chat-input');
        if (input) {
            input.value = question;
            window.handleChatSend();
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        const closeBtn = document.getElementById('ai-chat-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', window.toggleAIChat);
    });
})();
