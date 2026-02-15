export class DebugLogger {
    constructor() {
        this.createOverlay();
        this.overrideConsole();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.style.position = 'fixed';
        this.overlay.style.bottom = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '150px';
        this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.overlay.style.color = '#0f0';
        this.overlay.style.fontFamily = 'monospace';
        this.overlay.style.fontSize = '12px';
        this.overlay.style.overflowY = 'scroll';
        this.overlay.style.padding = '10px';
        this.overlay.style.zIndex = '9999';
        this.overlay.style.pointerEvents = 'none'; // Click through
        document.body.appendChild(this.overlay);
    }

    log(message, type = 'INFO') {
        const line = document.createElement('div');
        line.textContent = `[${type}] ${new Date().toLocaleTimeString()} - ${message}`;
        if (type === 'ERROR') line.style.color = '#f00';
        this.overlay.appendChild(line);
        this.overlay.scrollTop = this.overlay.scrollHeight;
    }

    overrideConsole() {
        const originalLog = console.log;
        const originalError = console.error;
        const self = this;

        console.log = function (...args) {
            originalLog.apply(console, args);
            self.log(args.join(' '));
        };

        console.error = function (...args) {
            originalError.apply(console, args);
            self.log(args.join(' '), 'ERROR');
        };

        window.onerror = function (msg, url, lineNo, columnNo, error) {
            self.log(`${msg} at ${lineNo}:${columnNo}`, 'ERROR');
            return false;
        };
    }
}
