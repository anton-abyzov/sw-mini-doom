/**
 * AI Component
 * Stores AI state and behavior parameters
 */

import * as THREE from 'three';
import { Component } from '../ecs/Component';

export type AIState = 'idle' | 'chase' | 'attack' | 'dead';

export class AIComponent extends Component {
  public state: AIState;
  public detectionRadius: number;
  public attackRange: number;
  public target: THREE.Vector3 | null;
  public lastShotTime: number;
  public fireRate: number; // shots per second

  constructor(
    detectionRadius: number = 20,
    attackRange: number = 8,
    fireRate: number = 1.0
  ) {
    super();
    this.state = 'idle';
    this.detectionRadius = detectionRadius;
    this.attackRange = attackRange;
    this.target = null;
    this.lastShotTime = 0;
    this.fireRate = fireRate;
  }

  public canShoot(currentTime: number): boolean {
    const cooldown = 1000 / this.fireRate; // milliseconds between shots
    return currentTime - this.lastShotTime >= cooldown;
  }
}
