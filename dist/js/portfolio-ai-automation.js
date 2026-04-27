// Portfolio page interactions
window.addEventListener('DOMContentLoaded', () => {
    const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (revealItems.length) {
        if (prefersReducedMotion) {
            revealItems.forEach((item) => item.classList.add('is-visible'));
        } else {
            const revealObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.2 }
            );

            revealItems.forEach((item) => revealObserver.observe(item));
        }
    }

    const chartsSection = document.querySelector('[data-charts-section]');
    if (!chartsSection) {
        return;
    }

    let chartsInitialized = false;
    const initCharts = () => {
        if (chartsInitialized || !window.Chart) {
            return;
        }

        chartsInitialized = true;
        const rootStyle = getComputedStyle(document.body);
        const primaryColor = '#bd5d38';
        const darkColor = '#343a40';
        const mutedColor = '#6c757d';
        const gridColor = 'rgba(0, 0, 0, 0.05)';
        const allowAnimation =
            !prefersReducedMotion && !window.matchMedia('(max-width: 575.98px)').matches;

        window.Chart.defaults.font.family = rootStyle.fontFamily;
        window.Chart.defaults.color = rootStyle.color;

        const sharedOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: allowAnimation
                ? {
                      duration: 800,
                      easing: 'easeOutQuart'
                  }
                : false
        };

        const improvementCanvas = document.getElementById('chart-improvement');
        if (improvementCanvas) {
            new window.Chart(improvementCanvas, {
                type: 'bar',
                data: {
                    labels: [
                        'Przygotowanie ofert',
                        'Obsługa klienta',
                        'Back-office',
                        'Analiza dokumentów',
                        'Raportowanie'
                    ],
                    datasets: [
                        {
                            label: 'Indeks',
                            data: [78, 72, 68, 74, 70],
                            backgroundColor: 'rgba(189, 93, 56, 0.65)',
                            borderColor: primaryColor,
                            borderWidth: 1,
                            borderRadius: 6
                        }
                    ]
                },
                options: {
                    ...sharedOptions,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: mutedColor }
                        },
                        y: {
                            beginAtZero: true,
                            suggestedMax: 100,
                            grid: { color: gridColor },
                            ticks: { color: mutedColor }
                        }
                    }
                }
            });
        }

        const maturityCanvas = document.getElementById('chart-maturity');
        if (maturityCanvas) {
            new window.Chart(maturityCanvas, {
                type: 'line',
                data: {
                    labels: ['Tydzień 1', 'Tydzień 2', 'Tydzień 3', 'Tydzień 4', 'Tydzień 6'],
                    datasets: [
                        {
                            label: 'Dojrzałość',
                            data: [35, 52, 68, 78, 86],
                            borderColor: darkColor,
                            backgroundColor: 'rgba(189, 93, 56, 0.15)',
                            fill: true,
                            tension: 0.35,
                            pointRadius: 3,
                            pointBackgroundColor: primaryColor
                        }
                    ]
                },
                options: {
                    ...sharedOptions,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: mutedColor }
                        },
                        y: {
                            beginAtZero: true,
                            suggestedMax: 100,
                            grid: { color: gridColor },
                            ticks: { color: mutedColor }
                        }
                    }
                }
            });
        }

        const timeCanvas = document.getElementById('chart-time');
        if (timeCanvas) {
            new window.Chart(timeCanvas, {
                type: 'doughnut',
                data: {
                    labels: [
                        'Discovery i architektura',
                        'Implementacja MVP',
                        'Integracje i dane',
                        'Hardening i testy',
                        'Wdrożenie i monitoring'
                    ],
                    datasets: [
                        {
                            data: [20, 35, 20, 15, 10],
                            backgroundColor: [
                                'rgba(189, 93, 56, 0.75)',
                                'rgba(52, 58, 64, 0.8)',
                                'rgba(108, 117, 125, 0.75)',
                                'rgba(189, 93, 56, 0.4)',
                                'rgba(52, 58, 64, 0.35)'
                            ],
                            borderWidth: 0
                        }
                    ]
                },
                options: {
                    ...sharedOptions,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { boxWidth: 12, boxHeight: 12 }
                        }
                    },
                    cutout: '60%'
                }
            });
        }
    };

    const chartsObserver = new IntersectionObserver(
        (entries, observer) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                initCharts();
                observer.disconnect();
            }
        },
        { rootMargin: '0px 0px -15% 0px' }
    );

    chartsObserver.observe(chartsSection);
});
