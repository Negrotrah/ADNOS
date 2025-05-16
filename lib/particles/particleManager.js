'use client';

/* global Map */
import * as PIXI from 'pixi.js';
import 'pixi-particles';

// Класс для управления системами частиц
export class ParticleManager {
  constructor(app) {
    this.app = app;
    this.particleSystems = new Map();
    this.emitters = new Map();
    this.textures = new Map();
    this.tickers = new Map(); // Хранение тикеров для правильной очистки
  }

  // Загрузка текстуры для частиц
  loadTexture(name, path) {
    if (this.textures.has(name)) {
      return this.textures.get(name);
    }

    const texture = PIXI.Texture.from(path);
    this.textures.set(name, texture);
    
    return texture;
  }

  // Создает новую систему частиц
  createParticleSystem(key, config) {
    // Если система с таким ключом уже существует, удаляем её
    if (this.particleSystems.has(key)) {
      this.destroyParticleSystem(key);
    }

    // Создаем контейнер для системы частиц
    const container = new PIXI.Container();
    this.app.stage.addChild(container);
    
    // Создаем эмиттер частиц
    const emitter = new PIXI.particles.Emitter(
      container,
      [this.getParticleTexture(config.texture)],
      config.settings
    );
    
    // Запускаем эмиттер
    emitter.emit = true;
    
    // Сохраняем ссылки на контейнер и эмиттер
    this.particleSystems.set(key, container);
    this.emitters.set(key, emitter);
    
    // Добавляем обновление частиц в игровой цикл
    // Сохраняем функцию обновления, чтобы позже можно было её удалить
    const updateFn = (delta) => {
      emitter.update(delta * 0.01); // Преобразуем дельту для совместимости
    };
    
    // Сохраняем тикер для последующего удаления
    this.app.ticker.add(updateFn);
    this.tickers.set(key, updateFn);
    
    return { container, emitter };
  }
  
  // Получает текстуру для частиц
  getParticleTexture(textureName) {
    if (!this.textures.has(textureName)) {
      // Если текстура не найдена, создаем простую круглую текстуру
      const graphics = new PIXI.Graphics();
      graphics.beginFill(0xFFFFFF);
      graphics.drawCircle(0, 0, 5);
      graphics.endFill();
      
      const texture = this.app.renderer.generateTexture(graphics);
      this.textures.set(textureName, texture);
      
      return texture;
    }
    
    return this.textures.get(textureName);
  }
  
  // Останавливает систему частиц
  stopParticleSystem(key) {
    if (this.emitters.has(key)) {
      const emitter = this.emitters.get(key);
      emitter.emit = false;
    }
  }
  
  // Удаляет систему частиц
  destroyParticleSystem(key) {
    if (this.particleSystems.has(key)) {
      const container = this.particleSystems.get(key);
      const emitter = this.emitters.get(key);
      const updateFn = this.tickers.get(key);
      
      // Удаляем эмиттер из тикера
      if (updateFn) {
        this.app.ticker.remove(updateFn);
        this.tickers.delete(key);
      }
      
      // Останавливаем эмиттер
      emitter.emit = false;
      
      // Очищаем ресурсы
      emitter.cleanup();
      container.destroy({ children: true });
      
      // Удаляем из коллекций
      this.particleSystems.delete(key);
      this.emitters.delete(key);
    }
  }
  
  // Удаляет все системы частиц
  destroyAllParticleSystems() {
    for (const key of this.particleSystems.keys()) {
      this.destroyParticleSystem(key);
    }
  }
}

// Factory функция для создания менеджера частиц
export const createParticleManager = (app) => {
  return new ParticleManager(app);
};

export default createParticleManager; 