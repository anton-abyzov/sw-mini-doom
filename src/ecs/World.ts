/**
 * World class - manages all entities and systems
 */

import { Entity } from './Entity';
import { System } from './System';

export class World {
  private entities: Set<Entity> = new Set();
  private systems: System[] = [];

  /**
   * Create and add a new entity to the world
   */
  createEntity(name?: string): Entity {
    const entity = new Entity(name);
    this.entities.add(entity);
    return entity;
  }

  /**
   * Add an existing entity to the world
   */
  addEntity(entity: Entity): void {
    this.entities.add(entity);
  }

  /**
   * Remove an entity from the world
   */
  removeEntity(entity: Entity): void {
    entity.destroy();
    this.entities.delete(entity);
  }

  /**
   * Get all active entities
   */
  getAllEntities(): Entity[] {
    return Array.from(this.entities).filter(e => e.isActive);
  }

  /**
   * Get entity by ID
   */
  getEntityById(id: string): Entity | undefined {
    return Array.from(this.entities).find(e => e.id === id);
  }

  /**
   * Add a system to the world
   */
  addSystem(system: System): void {
    this.systems.push(system);
  }

  /**
   * Update all systems
   */
  update(deltaTime: number): void {
    // Remove inactive entities
    for (const entity of this.entities) {
      if (!entity.isActive) {
        this.entities.delete(entity);
      }
    }

    // Update all systems
    for (const system of this.systems) {
      system.update(deltaTime);
    }
  }

  /**
   * Clear all entities and systems
   */
  clear(): void {
    for (const entity of this.entities) {
      entity.destroy();
    }
    this.entities.clear();
    this.systems = [];
  }
}
