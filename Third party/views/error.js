module.exports = function renderError(title, message) {
    return `
        <div class="max-w-md mx-auto text-center py-12">
            <div class="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">!</div>
            <h2 class="text-2xl font-bold mb-2 text-rose-400">${title}</h2>
            <p class="text-sm text-slate-400 mb-6">${message}</p>
            <a href="/" class="inline-flex px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg transition text-slate-300">
                Back to Launcher
            </a>
        </div>
    `;
};
