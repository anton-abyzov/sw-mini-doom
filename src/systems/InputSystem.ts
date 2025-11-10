/**
 * Input System
 * Handles keyboard and mouse input
 */

import { System } from '../ecs/System';

export class InputSystem extends System {
  private keys: Map<string, boolean> = new Map();
  private mouseMovement: { x: number; y: number } = { x: 0, y: 0 };
  private mouseButtons: Map<number, boolean> = new Map();
  private isPointerLocked: boolean = false;

  constructor(world: any) {
    super(world);
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    console.log('InputSystem: Setting up event listeners...');

    // Keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('RAW keydown event:', e.code, e.key);
      this.keys.set(e.code, true);
      console.log('Key down:', e.code, 'Keys map size:', this.keys.size);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      this.keys.set(e.code, false);
      console.log('Key up:', e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Test if listeners work
    console.log('Event listeners added to window. Test by pressing any key.');

    // Mouse events
    window.addEventListener('mousemove', (e) => {
      if (this.isPointerLocked) {
        this.mouseMovement.x += e.movementX;
        this.mouseMovement.y += e.movementY;
      }
    });

    window.addEventListener('mousedown', (e) => {
      this.mouseButtons.set(e.button, true);
    });

    window.addEventListener('mouseup', (e) => {
      this.mouseButtons.set(e.button, false);
    });

    // Pointer lock events
    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement !== null;
    });
  }

  public requestPointerLock(element: HTMLElement): void {
    element.requestPointerLock();
  }

  public exitPointerLock(): void {
    if (this.isPointerLocked) {
      document.exitPointerLock();
    }
  }

  public isKeyPressed(code: string): boolean {
    return this.keys.get(code) || false;
  }

  public isMouseButtonPressed(button: number): boolean {
    return this.mouseButtons.get(button) || false;
  }

  public getMouseMovement(): { x: number; y: number } {
    const movement = { ...this.mouseMovement };
    this.mouseMovement.x = 0;
    this.mouseMovement.y = 0;
    return movement;
  }

  public getMovementInput(): { forward: number; right: number } {
    let forward = 0;
    let right = 0;

    // WASD or Arrow keys
    if (this.isKeyPressed('KeyW') || this.isKeyPressed('ArrowUp')) forward += 1;
    if (this.isKeyPressed('KeyS') || this.isKeyPressed('ArrowDown')) forward -= 1;
    if (this.isKeyPressed('KeyD') || this.isKeyPressed('ArrowRight')) right += 1;
    if (this.isKeyPressed('KeyA') || this.isKeyPressed('ArrowLeft')) right -= 1;

    if (forward !== 0 || right !== 0) {
      console.log('Movement input:', { forward, right });
    }

    return { forward, right };
  }

  public update(_deltaTime: number): void {
    // Input system doesn't need update logic
    // It just provides input state to other systems
  }
}
