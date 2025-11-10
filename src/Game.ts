/**
 * Main Game Class
 * Orchestrates all systems, entities, and game state
 */

import * as THREE from 'three';
import { World } from './ecs/World';
import {
  InputSystem,
  MovementSystem,
  CollisionSystem,
  ProjectileSystem,
  AISystem,
} from './systems';
import { EntityFactory } from './entities/EntityFactory';
import { PositionComponent, VelocityComponent, HealthComponent, ShooterComponent, AIComponent, MeshComponent } from './components';

export type GameState = 'menu' | 'playing' | 'victory' | 'gameover';

export class Game {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private world: World;

  // Systems
  private inputSystem!: InputSystem;
  private movementSystem!: MovementSystem;
  private collisionSystem!: CollisionSystem;
  private projectileSystem!: ProjectileSystem;
  private aiSystem!: AISystem;

  // Entity Factory
  private entityFactory!: EntityFactory;

  // Game state
  private state: GameState = 'menu';
  private playerEntity: any;
  private config: any;

  // Game stats
  private kills = 0;
  private startTime = 0;
  private elapsedTime = 0;

  // Performance
  private lastTime = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // Setup Three.js renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);
    this.scene.fog = new THREE.Fog(0x111111, 1, 70);

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Setup ECS world
    this.world = new World();

    // Handle window resize
    window.addEventListener('resize', () => this.onResize());
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  async init(): Promise<void> {
    // Load game configuration
    const response = await fetch('/data/game-config.json');
    this.config = await response.json();

    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Initialize systems
    this.entityFactory = new EntityFactory(this.scene);
    this.inputSystem = new InputSystem(this.world);
    this.movementSystem = new MovementSystem(this.world);
    this.collisionSystem = new CollisionSystem(this.world);
    this.projectileSystem = new ProjectileSystem(this.world, this.scene);
    this.aiSystem = new AISystem(this.world);

    this.world.addSystem(this.inputSystem);
    this.world.addSystem(this.aiSystem);
    this.world.addSystem(this.movementSystem);
    this.world.addSystem(this.collisionSystem);
    this.world.addSystem(this.projectileSystem);

    // Setup UI event listeners
    this.setupUI();
  }

  private setupUI(): void {
    const startButton = document.getElementById('start-button');
    const victoryRestartButton = document.getElementById('victory-restart-button');
    const gameoverRestartButton = document.getElementById('gameover-restart-button');

    startButton?.addEventListener('click', () => this.startGame());
    victoryRestartButton?.addEventListener('click', () => this.startGame());
    gameoverRestartButton?.addEventListener('click', () => this.startGame());
  }

  startGame(): void {
    // Clear existing game entities (NOT systems)
    // Remove all entities but keep systems
    const entities = this.world.getAllEntities();
    entities.forEach(e => this.world.removeEntity(e));

    this.scene.clear();
    this.kills = 0;
    this.startTime = Date.now();

    // Re-add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Create arena
    const arenaEntities = this.entityFactory.createArena(this.config.map);
    arenaEntities.forEach(e => this.world.addEntity(e));

    // Create player
    this.playerEntity = this.entityFactory.createPlayer(this.config.player);
    this.world.addEntity(this.playerEntity);

    // Setup camera to follow player
    const playerPos = this.playerEntity.getComponent(PositionComponent);
    this.camera.position.copy(playerPos.position);
    this.camera.rotation.order = 'YXZ';

    // Create enemies
    console.log('Creating', this.config.enemy.count, 'enemies');
    for (let i = 0; i < this.config.enemy.count; i++) {
      const spawnPos = this.config.map.enemySpawns[i % this.config.map.enemySpawns.length];
      console.log(`Enemy ${i} spawning at:`, spawnPos);
      const enemy = this.entityFactory.createEnemy(this.config.enemy, spawnPos);
      this.world.addEntity(enemy);

      const enemyMesh = enemy.getComponent(MeshComponent);
      if (enemyMesh) {
        console.log('Enemy mesh added to scene:', enemyMesh.mesh);
      }
    }
    console.log('Total objects in scene:', this.scene.children.length);

    // Switch to playing state
    this.setState('playing');

    // Focus the canvas to receive keyboard events
    this.canvas.focus();
    this.canvas.setAttribute('tabindex', '0');

    // Add click handler to canvas for pointer lock
    const requestLock = () => {
      this.inputSystem.requestPointerLock(this.canvas);
      this.canvas.focus(); // Ensure focus after pointer lock
    };

    this.canvas.addEventListener('click', requestLock);

    // Request pointer lock immediately
    requestLock();
  }

  private setState(newState: GameState): void {
    this.state = newState;

    // Update UI
    document.getElementById('menu-screen')?.classList.toggle('hidden', newState !== 'menu');
    document.getElementById('victory-screen')?.classList.toggle('hidden', newState !== 'victory');
    document.getElementById('gameover-screen')?.classList.toggle('hidden', newState !== 'gameover');
    document.getElementById('hud')?.classList.toggle('hidden', newState !== 'playing');
    document.getElementById('crosshair')?.classList.toggle('hidden', newState !== 'playing');

    if (newState === 'victory' || newState === 'gameover') {
      this.inputSystem.exitPointerLock();
      this.updateEndGameUI(newState);
    }

    // Setup pointer lock change listener for "click to play" message
    if (newState === 'playing') {
      this.setupPointerLockListener();
    }
  }

  private setupPointerLockListener(): void {
    const clickToPlay = document.getElementById('click-to-play');

    const updateClickToPlay = () => {
      const isLocked = document.pointerLockElement !== null;
      clickToPlay?.classList.toggle('hidden', isLocked);
    };

    document.addEventListener('pointerlockchange', updateClickToPlay);
    document.addEventListener('pointerlockerror', () => {
      console.error('Pointer lock error');
      clickToPlay?.classList.remove('hidden');
    });

    // Initial check
    updateClickToPlay();
  }

  private updateEndGameUI(state: 'victory' | 'gameover'): void {
    const prefix = state === 'victory' ? 'victory' : 'gameover';
    const minutes = Math.floor(this.elapsedTime / 60);
    const seconds = Math.floor(this.elapsedTime % 60);

    document.getElementById(`${prefix}-kills`)!.textContent = `Kills: ${this.kills}`;
    document.getElementById(`${prefix}-time`)!.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  update(): void {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    if (this.state !== 'playing') {
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(() => this.update());
      return;
    }

    // Update elapsed time
    this.elapsedTime = (Date.now() - this.startTime) / 1000;

    // Handle player input (sets velocity, handles shooting)
    this.handlePlayerInput(deltaTime);

    // Update AI system with player position
    const playerPos = this.playerEntity.getComponent(PositionComponent);
    if (playerPos) {
      this.aiSystem.setPlayerPosition(playerPos.position);
    }

    // Handle enemy shooting
    this.handleEnemyShooting();

    // Update all systems (this moves entities based on velocity)
    this.world.update(deltaTime);

    // NOW update camera position after movement
    this.updateCamera();

    // Check win/lose conditions
    this.checkGameConditions();

    // Update HUD
    this.updateHUD();

    // Render
    this.renderer.render(this.scene, this.camera);

    // Continue game loop
    requestAnimationFrame(() => this.update());
  }

  private updateCamera(): void {
    const playerPos = this.playerEntity.getComponent(PositionComponent);
    if (playerPos) {
      this.camera.position.copy(playerPos.position);
      this.camera.position.y += 1.6; // Eye height
      console.log('Camera updated to:', this.camera.position);
    }
  }

  private handlePlayerInput(_deltaTime: number): void {
    const playerPos = this.playerEntity.getComponent(PositionComponent);
    const playerVelocity = this.playerEntity.getComponent(VelocityComponent);
    const playerShooter = this.playerEntity.getComponent(ShooterComponent);

    // Mouse look
    const mouseMovement = this.inputSystem.getMouseMovement();
    const sensitivity = 0.002;

    this.camera.rotation.y -= mouseMovement.x * sensitivity;
    this.camera.rotation.x -= mouseMovement.y * sensitivity;
    this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x));

    playerPos.rotation.y = this.camera.rotation.y;

    // Movement input
    const input = this.inputSystem.getMovementInput();

    const forward = new THREE.Vector3(0, 0, -1)  // Fixed: negative Z is forward in Three.js
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.camera.rotation.y);
    const right = new THREE.Vector3(1, 0, 0)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.camera.rotation.y);

    playerVelocity.velocity.set(0, 0, 0);
    playerVelocity.velocity.addScaledVector(forward, input.forward * playerVelocity.speed);
    playerVelocity.velocity.addScaledVector(right, input.right * playerVelocity.speed);

    console.log('Velocity set to:', playerVelocity.velocity, 'Speed:', playerVelocity.speed);

    // Shooting - LEFT CLICK or SPACEBAR
    const wantsToShoot = this.inputSystem.isMouseButtonPressed(0) || this.inputSystem.isKeyPressed('Space');

    if (wantsToShoot) {
      console.log('Shoot button pressed! Can shoot?', playerShooter.canShoot(Date.now()));

      if (playerShooter.canShoot(Date.now())) {
        const direction = new THREE.Vector3(0, 0, -1)  // Fixed: negative Z is forward in Three.js
          .applyEuler(this.camera.rotation)
          .normalize();

        console.log('SHOOTING! Direction:', direction, 'From position:', this.camera.position);

        const projectile = this.entityFactory.createProjectile(
          this.camera.position.clone(),
          direction,
          playerShooter.projectileSpeed,
          playerShooter.damage,
          'player'
        );

        this.world.addEntity(projectile);
        playerShooter.lastShotTime = Date.now();
        console.log('Projectile created and added to world');
      }
    }
  }

  private handleEnemyShooting(): void {
    const enemies = this.world.getAllEntities().filter(e =>
      e.hasComponent(AIComponent) &&
      e.hasComponent(ShooterComponent) &&
      e.hasComponent(PositionComponent)
    );

    const playerPos = this.playerEntity.getComponent(PositionComponent).position;

    for (const enemy of enemies) {
      const ai = enemy.getComponent(AIComponent)!;
      const shooter = enemy.getComponent(ShooterComponent)!;
      const pos = enemy.getComponent(PositionComponent)!;

      if (ai.state === 'attack' && ai.canShoot(Date.now())) {
        const toPlayer = playerPos.clone().sub(pos.position).normalize();

        const projectile = this.entityFactory.createProjectile(
          pos.position.clone().add(new THREE.Vector3(0, 1, 0)),
          toPlayer,
          shooter.projectileSpeed,
          shooter.damage,
          'enemy'
        );

        this.world.addEntity(projectile);
        ai.lastShotTime = Date.now();
      }
    }
  }

  private checkGameConditions(): void {
    // Check player health
    const playerHealth = this.playerEntity.getComponent(HealthComponent);
    if (playerHealth.isDead()) {
      this.setState('gameover');
      return;
    }

    // Count alive enemies
    const enemies = this.world.getAllEntities().filter(e =>
      e.hasComponent(AIComponent) && e.hasComponent(HealthComponent)
    );

    const aliveEnemies = enemies.filter(e => {
      const health = e.getComponent(HealthComponent)!;
      const ai = e.getComponent(AIComponent)!;
      return !health.isDead() && ai.state !== 'dead';
    });

    // Update kill count
    this.kills = this.config.enemy.count - aliveEnemies.length;

    // Check victory
    if (aliveEnemies.length === 0) {
      this.setState('victory');
    }
  }

  private updateHUD(): void {
    const playerHealth = this.playerEntity.getComponent(HealthComponent);

    // Health bar
    const healthPercent = playerHealth.getHealthPercent();
    const healthBar = document.getElementById('health-bar') as HTMLElement;
    healthBar.style.width = `${healthPercent}%`;

    // Health text
    document.getElementById('health-text')!.textContent = `Health: ${Math.ceil(playerHealth.health)}`;

    // Kills
    document.getElementById('kills-text')!.textContent = `Kills: ${this.kills}`;

    // Timer
    const minutes = Math.floor(this.elapsedTime / 60);
    const seconds = Math.floor(this.elapsedTime % 60);
    document.getElementById('timer-text')!.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  start(): void {
    this.lastTime = performance.now();
    this.update();
  }
}
