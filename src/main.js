import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="game-container">
    <h1>Hidden Picture Game</h1>
    <div id="game-view"></div>
    <div id="ui-layer"></div>
  </div>
`

import { Game } from './game/Game.js';
import { DebugLogger } from './utils/DebugLogger.js';

// Initialize Debug Logger
new DebugLogger();

const game = new Game('game-view');


// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
