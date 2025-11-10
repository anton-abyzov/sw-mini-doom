/**
 * Projectile Component
 * Marks entity as a projectile with damage and owner
 */

import { Component } from '../ecs/Component';

export type ProjectileOwner = 'player' | 'enemy';

export class ProjectileComponent extends Component {
  public damage: number;
  public owner: ProjectileOwner;
  public lifetime: number; // milliseconds
  public createdAt: number;

  constructor(damage: number, owner: ProjectileOwner, lifetime: number = 5000) {
    super();
    this.damage = damage;
    this.owner = owner;
    this.lifetime = lifetime;
    this.createdAt = Date.now();
  }

  public isExpired(): boolean {
    return Date.now() - this.createdAt > this.lifetime;
  }
}
