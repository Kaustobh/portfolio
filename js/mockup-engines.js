/**
 * ==========================================================================
 * INTERACTIVE MOCKUP ENGINES (FINTECH, E-COMMERCE, GALLERY, SCHEDULER, CHATBOT)
 * ==========================================================================
 */

// 1. FINTECH MOCKUP ENGINE
const chartDataScales = {
    '24H': {
        points: [
            { x: 0, y: 80, date: "00:00", val: "$124,100" },
            { x: 20, y: 70, date: "04:00", val: "$125,450" },
            { x: 40, y: 85, date: "08:00", val: "$123,800" },
            { x: 60, y: 40, date: "12:00", val: "$128,920" },
            { x: 80, y: 55, date: "16:00", val: "$127,100" },
            { x: 100, y: 25, date: "20:00", val: "$131,450" }
        ],
        scaleLabel: "24-Hour Real-Time Telemetry"
    },
    '1W': {
        points: [
            { x: 0, y: 95, date: "Mon 09", val: "$118,200" },
            { x: 20, y: 75, date: "Tue 10", val: "$122,400" },
            { x: 40, y: 60, date: "Wed 11", val: "$125,100" },
            { x: 60, y: 80, date: "Thu 12", val: "$121,800" },
            { x: 80, y: 35, date: "Fri 13", val: "$129,500" },
            { x: 100, y: 15, date: "Sat 14", val: "$134,850" }
        ],
        scaleLabel: "7-Day Volume & Liquidity Delta"
    },
    '1M': {
        points: [
            { x: 0, y: 110, date: "Week 1", val: "$98,400" },
            { x: 25, y: 85, date: "Week 2", val: "$112,000" },
            { x: 50, y: 50, date: "Week 3", val: "$124,300" },
            { x: 75, y: 30, date: "Week 4", val: "$131,200" },
            { x: 100, y: 10, date: "Current", val: "$142,600" }
        ],
        scaleLabel: "30-Day Automated Yield Growth"
    }
};

let currentChartScale = '1W';

function renderChartPath(scale) {
    currentChartScale = scale;
    const config = chartDataScales[scale];
    if (!config) return;
    
    const points = config.points;
    const timeframeLabel = document.getElementById('fintech-timeframe-label');
    const chartSvg = document.getElementById('fintech-chart-svg');
    const balanceLabel = document.getElementById('fintech-balance-value');
    
    if (timeframeLabel) timeframeLabel.innerText = config.scaleLabel;
    if (!chartSvg) return;
    
    const width = chartSvg.clientWidth || 320;
    
    let d = `M 0 ${points[0].y}`;
    let dFill = `M 0 120 L 0 ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
        const cx = points[i-1].x + (points[i].x - points[i-1].x) / 2;
        d += ` C ${cx * width / 100} ${points[i-1].y}, ${cx * width / 100} ${points[i].y}, ${points[i].x * width / 100} ${points[i].y}`;
        dFill += ` C ${cx * width / 100} ${points[i-1].y}, ${cx * width / 100} ${points[i].y}, ${points[i].x * width / 100} ${points[i].y}`;
    }
    
    dFill += ` L ${width} 120 Z`;
    
    const lineEl = document.getElementById('chart-path-line');
    const fillEl = document.getElementById('chart-path-fill');
    if (lineEl) lineEl.setAttribute('d', d);
    if (fillEl) fillEl.setAttribute('d', dFill);
    if (balanceLabel) balanceLabel.innerText = points[points.length - 1].val;
}

// 2. E-COMMERCE WATCH CUSTOMIZER
const watchConfigs = {
    'white': { name: 'Edition 01 // Phantom White', price: '$499.00', accentColor: '#ffffff', glowColor: 'rgba(255,255,255,0.15)' },
    'cyan': { name: 'Edition 02 // Cyber Cyan', price: '$549.00', accentColor: '#00F3FF', glowColor: 'rgba(0,243,255,0.2)' },
    'magenta': { name: 'Edition 03 // Neon Magenta', price: '$549.00', accentColor: '#FF00A0', glowColor: 'rgba(255,0,160,0.2)' },
    'lime': { name: 'Edition 04 // Acid Lime', price: '$599.00', accentColor: '#D4FF00', glowColor: 'rgba(212,255,0,0.2)' }
};

let selectedWatchColor = 'cyan';
let cartCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Fintech Chart Listeners
    const chartSvg = document.getElementById('fintech-chart-svg');
    if (chartSvg) {
        setTimeout(() => renderChartPath('1W'), 300);
        window.addEventListener('resize', () => renderChartPath(currentChartScale));

        let chartTicking = false;
        chartSvg.addEventListener('mousemove', (e) => {
            if (!chartTicking) {
                requestAnimationFrame(() => {
                    const rect = chartSvg.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const pct = (x / rect.width) * 100;
                    
                    const points = chartDataScales[currentChartScale].points;
                    let closest = points[0];
                    let minDist = 100;

                    for (let p of points) {
                        const dist = Math.abs(p.x - pct);
                        if (dist < minDist) {
                            minDist = dist;
                            closest = p;
                        }
                    }

                    const targetX = closest.x * rect.width / 100;
                    const targetY = closest.y;

                    const tooltipLine = document.getElementById('chart-tooltip-line');
                    const tooltipBubble = document.getElementById('chart-tooltip-bubble');
                    const tooltipDot = document.getElementById('chart-tooltip-dot');
                    const balanceLabel = document.getElementById('fintech-balance-value');

                    if (tooltipLine) {
                        tooltipLine.style.left = `${targetX}px`;
                        tooltipLine.classList.remove('hidden');
                    }
                    if (tooltipDot) {
                        tooltipDot.setAttribute('cx', targetX);
                        tooltipDot.setAttribute('cy', targetY);
                        tooltipDot.classList.remove('hidden');
                    }
                    if (tooltipBubble) {
                        tooltipBubble.style.left = `${targetX - 25}px`;
                        tooltipBubble.style.top = `${targetY - 35}px`;
                        tooltipBubble.classList.remove('hidden');
                    }
                    
                    const tooltipDate = document.getElementById('tooltip-date');
                    const tooltipVal = document.getElementById('tooltip-value');
                    if (tooltipDate) tooltipDate.innerText = closest.date;
                    if (tooltipVal) tooltipVal.innerText = closest.val;
                    if (balanceLabel) balanceLabel.innerText = closest.val;

                    chartTicking = false;
                });
                chartTicking = true;
            }
        });

        chartSvg.addEventListener('mouseleave', () => {
            const tooltipLine = document.getElementById('chart-tooltip-line');
            const tooltipBubble = document.getElementById('chart-tooltip-bubble');
            const tooltipDot = document.getElementById('chart-tooltip-dot');
            const balanceLabel = document.getElementById('fintech-balance-value');

            if (tooltipLine) tooltipLine.classList.add('hidden');
            if (tooltipBubble) tooltipBubble.classList.add('hidden');
            if (tooltipDot) tooltipDot.classList.add('hidden');
            
            const points = chartDataScales[currentChartScale].points;
            if (balanceLabel) balanceLabel.innerText = points[points.length - 1].val;
        });
    }

    // Chart Timescale Selectors
    const chartButtons = document.querySelectorAll('#chart-timescale-selectors button');
    chartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            chartButtons.forEach(b => b.className = "px-1.5 py-0.5 rounded text-neutral-400 hover:text-charcoal dark:hover:text-white cursor-pointer");
            e.target.className = "px-1.5 py-0.5 rounded bg-neon-cyan/25 dark:bg-neon-cyan/20 light:bg-electric-blue/20 text-neon-cyan dark:text-neon-cyan light:text-electric-blue font-bold cursor-pointer";
            renderChartPath(e.target.getAttribute('data-scale'));
        });
    });

    // E-Commerce Watch Color Buttons
    const colorButtons = document.querySelectorAll('#product-color-selector button');
    const watchAccentRing = document.getElementById('watch-accent-ring');
    const watchSecondHand = document.getElementById('watch-second-hand');
    const watchDialGlow = document.getElementById('watch-dial-glow');
    const watchModelName = document.getElementById('product-model-name');
    const watchPriceLabel = document.getElementById('product-price');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const cartBadge = document.getElementById('cart-badge-count');

    colorButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const color = e.target.getAttribute('data-color');
            selectedWatchColor = color;
            
            colorButtons.forEach(b => {
                b.className = "w-4 h-4 rounded-full border border-transparent hover:scale-110 cursor-pointer transition-transform";
                if (b.getAttribute('data-color') === 'white') b.classList.add('bg-white', 'dark:bg-zinc-300');
                else if (b.getAttribute('data-color') === 'cyan') b.classList.add('bg-neon-cyan');
                else if (b.getAttribute('data-color') === 'magenta') b.classList.add('bg-neon-magenta');
                else if (b.getAttribute('data-color') === 'lime') b.classList.add('bg-acid-lime');
            });
            
            e.target.className = `w-4 h-4 rounded-full border-2 border-white dark:border-white ring-2 cursor-pointer transition-transform`;
            if (color === 'white') e.target.classList.add('bg-white', 'dark:bg-zinc-300', 'ring-neutral-400');
            else if (color === 'cyan') e.target.classList.add('bg-neon-cyan', 'ring-neon-cyan');
            else if (color === 'magenta') e.target.classList.add('bg-neon-magenta', 'ring-neon-magenta');
            else if (color === 'lime') e.target.classList.add('bg-acid-lime', 'ring-acid-lime');

            const config = watchConfigs[color];
            if (watchAccentRing) watchAccentRing.style.stroke = config.accentColor;
            if (watchSecondHand) watchSecondHand.style.stroke = config.accentColor;
            if (watchDialGlow) watchDialGlow.style.fill = config.glowColor;
            if (watchModelName) watchModelName.innerText = config.name;
            if (watchPriceLabel) watchPriceLabel.innerText = config.price;
        });
    });

    if (addToCartBtn && cartBadge) {
        addToCartBtn.addEventListener('click', () => {
            cartCount++;
            cartBadge.innerText = cartCount;
            cartBadge.classList.add('scale-125', 'bg-neon-cyan');
            setTimeout(() => cartBadge.classList.remove('scale-125'), 200);
            playSyntheticClick('success');
        });
    }

    // 3. ART GALLERY SLIDER ENGINE
    const sliders = document.querySelectorAll('.interactive-gallery-slider');
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.gallery-slide');
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');
        const currentLabel = slider.querySelector('.slider-current');
        const totalLabel = slider.querySelector('.slider-total');
        let currentIdx = 0;

        if (totalLabel) totalLabel.innerText = slides.length;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
                    slide.classList.add('opacity-100', 'pointer-events-auto', 'scale-100');
                } else {
                    slide.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
                    slide.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
                }
            });
            if (currentLabel) currentLabel.innerText = index + 1;
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIdx = (currentIdx + 1) % slides.length;
                showSlide(currentIdx);
                playSyntheticClick('click');
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIdx = (currentIdx - 1 + slides.length) % slides.length;
                showSlide(currentIdx);
                playSyntheticClick('click');
            });
        }
    });
});
