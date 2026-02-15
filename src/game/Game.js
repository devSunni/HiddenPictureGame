import { ThemeManager } from './ThemeManager.js';
import { LevelLoader } from './LevelLoader.js';

import { HUD } from '../ui/HUD.js';

export class Game {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.hud = new HUD('ui-layer'); // Initialize HUD
        this.themeManager = new ThemeManager();
        this.levelLoader = new LevelLoader();
        this.state = {
            currentLevel: null,
            score: 0,
            foundItems: [],
            startTime: 0,
            isPlaying: false,
            timerInterval: null
        };

        this.init();
    }

    // ... init remains same ...

    async startLevel(themeId, levelId) {
        console.log(`Starting Level: ${themeId} - ${levelId}`);
        const levelData = await this.levelLoader.loadLevel(themeId, levelId);
        this.state.currentLevel = levelData;
        this.state.foundItems = [];
        this.state.isPlaying = true;
        this.state.startTime = Date.now();
        this.state.score = 0;

        // Setup HUD
        this.hud.initItems(levelData.items);
        this.hud.updateScore(0);
        this.startTimer();

        this.renderLevel();
    }

    startTimer() {
        if (this.state.timerInterval) clearInterval(this.state.timerInterval);
        this.state.timerInterval = setInterval(() => {
            if (!this.state.isPlaying) return;
            const elapsed = Math.floor((Date.now() - this.state.startTime) / 1000);
            // Maybe count down? forcing count up for now.
            this.hud.updateTimer(elapsed);
        }, 1000);
    }


    startTimer() {
        if (this.state.timerInterval) clearInterval(this.state.timerInterval);
        this.state.timerInterval = setInterval(() => {
            if (!this.state.isPlaying) return;
            const elapsed = Math.floor((Date.now() - this.state.startTime) / 1000);
            this.hud.updateTimer(elapsed);
        }, 1000);
    }

    renderLevel() {
        if (!this.state.currentLevel) return;

        // Clear container
        this.container.innerHTML = '';

        // Background
        console.log(`Loading background: ${this.state.currentLevel.background}`);
        const bg = document.createElement('div');
        bg.className = 'game-background';

        // Validate image loading
        const img = new Image();
        img.src = this.state.currentLevel.background;
        img.onload = () => console.log('Background image loaded successfully');
        img.onerror = (e) => console.error(`Failed to load background image: ${this.state.currentLevel.background}`, e);

        bg.style.backgroundImage = `url(${this.state.currentLevel.background})`;
        bg.style.width = '100%';
        bg.style.height = '100%';

        bg.style.backgroundSize = 'contain';
        bg.style.backgroundRepeat = 'no-repeat';
        bg.style.backgroundPosition = 'center';
        bg.style.position = 'relative';

        // Click handler
        bg.addEventListener('pointerdown', (e) => this.handleInteraction(e));

        this.container.appendChild(bg);
    }

    handleInteraction(e) {
        if (!this.state.isPlaying) return;

        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalize coordinates to 0-100% relative to image
        const outputSize = { w: rect.width, h: rect.height };
        // Note: This needs more complex logic to handle "contain" aspect ratio.
        // simpler to map clicks to the image's coordinate space.

        console.log(`Clicked at ${x}, ${y}`);

        // Check hit logic
        const nx = x / outputSize.w;
        const ny = y / outputSize.h;

        console.log(`Click normalized: ${nx.toFixed(3)}, ${ny.toFixed(3)}`);

        const items = this.state.currentLevel.items;
        let found = false;

        // Iterate backwards to handle potential overlaps (topmost first)
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            if (this.state.foundItems.includes(item.id)) continue;

            // Simple AABB collision detection (assuming x,y is center)
            const halfW = item.width / 2;
            const halfH = item.height / 2;

            if (
                nx >= item.x - halfW &&
                nx <= item.x + halfW &&
                ny >= item.y - halfH &&
                ny <= item.y + halfH
            ) {
                console.log(`Found item: ${item.name}`);
                this.handleItemFound(item);
                found = true;
                break;
            }
        }

        if (!found) {
            this.handleMiss(x, y);
        }
    }

    handleItemFound(item) {
        this.state.foundItems.push(item.id);
        this.state.score += 100;

        // Visual feedback
        this.showFeedback(item.x, item.y, 'FOUND!');

        // Check win condition
        if (this.state.foundItems.length === this.state.currentLevel.items.length) {
            console.log('Level Complete!');
            setTimeout(() => alert('Level Complete! Score: ' + this.state.score), 100);
            this.state.isPlaying = false;
        }
    }

    endLevel(win) {
        this.state.isPlaying = false;
        clearInterval(this.state.timerInterval);
        setTimeout(() => alert(win ? `Level Complete! Score: ${this.state.score}` : 'Game Over'), 100);
    }

    handleMiss(x, y) {
        console.log('Miss!');
        this.state.score = Math.max(0, this.state.score - 10);
        this.hud.updateScore(this.state.score);
        // Visual feedback can be added here
    }

    showFeedback(nx, ny, text) {
        // Convert normalized back to pixel for feedback element
        const rect = this.container.getBoundingClientRect();
        const px = nx * rect.width;
        const py = ny * rect.height;

        const feedback = document.createElement('div');
        feedback.innerText = text;
        feedback.style.position = 'absolute';
        feedback.style.left = `${px}px`;
        feedback.style.top = `${py}px`;
        feedback.style.color = '#0f0';
        feedback.style.fontWeight = 'bold';
        feedback.style.pointerEvents = 'none';
        feedback.style.transform = 'translate(-50%, -50%)';
        feedback.style.animation = 'floatUp 1s ease-out forwards';

        // Add minimal animation style if not present
        if (!document.getElementById('feedback-style')) {
            const style = document.createElement('style');
            style.id = 'feedback-style';
            style.innerHTML = `
                @keyframes floatUp {
                    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -150%) scale(1.5); }
                }
            `;
            document.head.appendChild(style);
        }

        this.container.appendChild(feedback);
        setTimeout(() => feedback.remove(), 1000);
    }
}
