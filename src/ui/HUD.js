export class HUD {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.createElements();
    }

    createElements() {
        this.container.innerHTML = `
      <div class="hud-top">
        <div class="score-board">Score: <span id="score-val">0</span></div>
        <div class="timer">Time: <span id="timer-val">00:00</span></div>
      </div>
      <div class="hud-bottom">
        <div id="item-list" class="item-list"></div>
      </div>
    `;

        this.scoreEl = document.getElementById('score-val');
        this.timerEl = document.getElementById('timer-val');
        this.itemListEl = document.getElementById('item-list');
    }

    updateScore(score) {
        this.scoreEl.innerText = score;
    }

    updateTimer(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        this.timerEl.innerText = `${mins}:${secs}`;
    }

    initItems(items) {
        this.itemListEl.innerHTML = '';
        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'hud-item';
            el.id = `hud-item-${item.id}`;
            el.innerHTML = `
        <span class="item-icon">${item.preview}</span>
        <span class="item-name">${item.name}</span>
      `;
            this.itemListEl.appendChild(el);
        });
    }

    markItemFound(itemId) {
        const el = document.getElementById(`hud-item-${itemId}`);
        if (el) {
            el.classList.add('found');
        }
    }
}
