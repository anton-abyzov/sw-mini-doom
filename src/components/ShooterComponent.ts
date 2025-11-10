/**
 * Shooter Component
 * Stores shooting capabilities and cooldown
 */

import { Component } from '../ecs/Component';

export class ShooterComponent extends Component {
  public damage: number;
  public fireRate: number; // shots per second
  public lastShotTime: number;
  public projectileSpeed: number;

  constructor(
    damage: number = 10,
    fireRate: number = 5.0,
    projectileSpeed: number = 50
  ) {
    super();
    this.damage = damage;
    this.fireRate = fireRate;
    this.lastShotTime = 0;
    this.projectileSpeed = projectileSpeed;
  }

  public canShoot(currentTime: number): boolean {
    const cooldown = 1000 / this.fireRate; // milliseconds between shots
    return currentTime - this.lastShotTime >= cooldown;
  }
}
