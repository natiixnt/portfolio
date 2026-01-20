(() => {
    const pageRoot = document.body;
    if (!pageRoot || !pageRoot.classList.contains('portfolio-ai')) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));

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

    const chartsSection = document.querySelector('[data-charts]');
    if (!chartsSection) {
        return;
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const accent = rootStyles.getPropertyValue('--accent').trim() || '#2563eb';
    const accentAlt = rootStyles.getPropertyValue('--accent-2').trim() || '#0ea5e9';
    const textColor = '#e2e8f0';
    const muted = '#94a3b8';

    let chartsRequested = false;
    let plotlyPromise;
    const loadPlotly = () => {
        if (window.Plotly) {
            return Promise.resolve();
        }
        if (plotlyPromise) {
            return plotlyPromise;
        }

        plotlyPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.plot.ly/plotly-latest.min.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Plotly failed to load'));
            document.head.appendChild(script);
        });

        return plotlyPromise;
    };

    const renderCharts = () => {
        const config = { displayModeBar: false, responsive: true };
        const layoutBase = {
            margin: { t: 8, r: 8, b: 40, l: 42 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { color: textColor }
        };

        const improvementEl = document.getElementById('chart-improvement');
        if (improvementEl) {
            const trace = {
                type: 'bar',
                x: [
                    'Przygotowanie ofert',
                    'Obsługa klienta',
                    'Back-office',
                    'Analiza dokumentów',
                    'Raportowanie'
                ],
                y: [78, 72, 68, 74, 70],
                marker: {
                    color: 'rgba(37, 99, 235, 0.65)',
                    line: { color: accent, width: 1 }
                }
            };

            const layout = {
                ...layoutBase,
                xaxis: { tickfont: { color: muted }, automargin: true },
                yaxis: {
                    range: [0, 100],
                    tickfont: { color: muted },
                    gridcolor: 'rgba(148, 163, 184, 0.15)'
                }
            };

            window.Plotly.newPlot(improvementEl, [trace], layout, config);
        }

        const maturityEl = document.getElementById('chart-maturity');
        if (maturityEl) {
            const trace = {
                type: 'scatter',
                mode: 'lines+markers',
                x: ['Tydzień 1', 'Tydzień 2', 'Tydzień 3', 'Tydzień 4', 'Tydzień 6'],
                y: [35, 52, 68, 78, 86],
                line: { color: accentAlt, width: 3 },
                marker: { color: accent, size: 6 },
                fill: 'tozeroy',
                fillcolor: 'rgba(14, 165, 233, 0.15)'
            };

            const layout = {
                ...layoutBase,
                xaxis: { tickfont: { color: muted } },
                yaxis: {
                    range: [0, 100],
                    tickfont: { color: muted },
                    gridcolor: 'rgba(148, 163, 184, 0.15)'
                }
            };

            window.Plotly.newPlot(maturityEl, [trace], layout, config);
        }

        const timeEl = document.getElementById('chart-time');
        if (timeEl) {
            const trace = {
                type: 'pie',
                labels: [
                    'Discovery i architektura',
                    'Implementacja MVP',
                    'Integracje i dane',
                    'Hardening i testy',
                    'Wdrożenie i monitoring'
                ],
                values: [20, 35, 20, 15, 10],
                hole: 0.58,
                textinfo: 'label+percent',
                textposition: 'inside',
                marker: {
                    colors: [
                        'rgba(37, 99, 235, 0.8)',
                        'rgba(14, 165, 233, 0.8)',
                        'rgba(226, 232, 240, 0.5)',
                        'rgba(37, 99, 235, 0.35)',
                        'rgba(148, 163, 184, 0.4)'
                    ]
                }
            };

            const layout = {
                ...layoutBase,
                margin: { t: 8, r: 8, b: 8, l: 8 },
                showlegend: false
            };

            window.Plotly.newPlot(timeEl, [trace], layout, config);
        }
    };

    const ensureCharts = () => {
        if (chartsRequested) {
            return;
        }

        chartsRequested = true;
        loadPlotly()
            .then(() => {
                renderCharts();
            })
            .catch(() => {
                chartsRequested = false;
            });
    };

    if (!('IntersectionObserver' in window)) {
        ensureCharts();
        return;
    }

    const chartsObserver = new IntersectionObserver(
        (entries, observer) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                ensureCharts();
                observer.disconnect();
            }
        },
        { rootMargin: '0px 0px -15% 0px' }
    );

    chartsObserver.observe(chartsSection);
})();
