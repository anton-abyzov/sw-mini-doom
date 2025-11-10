/**
 * Entity class - represents a game object
 * Entities are containers for components
 */

import { Component } from './Component';

let nextEntityId = 1;

export class Entity {
  public readonly id: string;
  public isActive: boolean = true;
  private components: Map<string, Component> = new Map();

  constructor(name?: string) {
    this.id = name || `entity_${nextEntityId++}`;
  }

  /**
   * Add a component to this entity
   */
  addComponent<T extends Component>(component: T): this {
    this.components.set(component.constructor.name, component);
    return this;
  }

  /**
   * Get a component by its class
   */
  getComponent<T extends Component>(componentClass: new (...args: any[]) => T): T | undefined {
    return this.components.get(componentClass.name) as T | undefined;
  }

  /**
   * Check if entity has a component
   */
  hasComponent<T extends Component>(componentClass: new (...args: any[]) => T): boolean {
    return this.components.has(componentClass.name);
  }

  /**
   * Remove a component from this entity
   */
  removeComponent<T extends Component>(componentClass: new (...args: any[]) => T): void {
    this.components.delete(componentClass.name);
  }

  /**
   * Get all components
   */
  getAllComponents(): Component[] {
    return Array.from(this.components.values());
  }

  /**
   * Destroy this entity (mark as inactive)
   */
  destroy(): void {
    this.isActive = false;
    this.components.clear();
  }
}
