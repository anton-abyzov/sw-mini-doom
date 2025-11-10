/**
 * Health Component
 * Stores health points and max health
 */

import { Component } from '../ecs/Component';

export class HealthComponent extends Component {
  public health: number;
  public maxHealth: number;

  constructor(maxHealth: number = 100) {
    super();
    this.health = maxHealth;
    this.maxHealth = maxHealth;
  }

  public takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  public heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  public isDead(): boolean {
    return this.health <= 0;
  }

  public getHealthPercent(): number {
    return (this.health / this.maxHealth) * 100;
  }
}
