/**
 * Main Entry Point
 * Initializes and starts the game
 */

import { Game } from './Game';

async function main() {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }

  const game = new Game(canvas);

  try {
    await game.init();
    game.start();
    console.log('Game initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

// Start the game when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
