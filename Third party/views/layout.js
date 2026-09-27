module.exports = function renderPage(title, content, PORT) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title} - Mock Client</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Plus Jakarta Sans', sans-serif; }
            </style>
        </head>
        <body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col justify-between">
            <header class="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md px-6 py-4">
                <div class="max-w-5xl mx-auto flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/30">M</div>
                        <span class="font-bold text-lg tracking-tight">Mock Partner App</span>
                    </div>
                    <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">Environment: Port ${PORT}</span>
                </div>
            </header>
            <main class="max-w-5xl w-full mx-auto p-6 lg:py-12 flex-grow">
                ${content}
            </main>
            <footer class="border-t border-slate-800 bg-slate-950/20 py-6 text-center text-xs text-slate-500">
                &copy; 2026 TrustAuth Mock Integration Client. All rights reserved.
            </footer>
        </body>
        </html>
    `;
};
