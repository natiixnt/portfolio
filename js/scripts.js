function initMermaid() {
    if (window.mermaid) {
        window.mermaid.initialize({ startOnLoad: true, theme: 'dark' });
    }
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function decorateCodeBlocks() {
    document.querySelectorAll('.code-block code').forEach((codeEl) => {
        const raw = codeEl.textContent.replace(/^\n/, '').replace(/\s+$/, '');
        codeEl.dataset.raw = raw;
        const lines = raw.split('\n').map((line) => `<span>${escapeHtml(line)}</span>`).join('\n');
        codeEl.innerHTML = lines;

        const block = codeEl.closest('.code-block');
        if (block && !block.querySelector('.copy-btn')) {
            const btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.type = 'button';
            btn.textContent = 'Copy';
            block.appendChild(btn);
        }
    });
}

function bindCopyButtons() {
    document.addEventListener('click', async (event) => {
        const btn = event.target.closest('.copy-btn');
        if (!btn) return;
        const block = btn.closest('.code-block');
        const code = block?.querySelector('code');
        if (!code) return;
        const text = code.dataset.raw || '';
        try {
            await navigator.clipboard.writeText(text);
            btn.textContent = 'Copied';
            btn.classList.add('success');
            setTimeout(() => {
                btn.textContent = 'Copy';
                btn.classList.remove('success');
            }, 1500);
        } catch (err) {
            console.error('Copy failed', err);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMermaid();
    decorateCodeBlocks();
    bindCopyButtons();
});
