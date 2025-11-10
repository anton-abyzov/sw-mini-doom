/**
 * System base class
 * Systems contain logic that operates on entities with specific components
 */

import { Entity } from './Entity';
import { World } from './World';

export abstract class System {
  protected world: World;

  constructor(world: World) {
    this.world = world;
  }

  /**
   * Update system logic (called every frame)
   * @param deltaTime Time since last frame in seconds
   */
  abstract update(deltaTime: number): void;

  /**
   * Get entities that match the required components for this system
   */
  protected getEntities(): Entity[] {
    return this.world.getAllEntities();
  }
}
