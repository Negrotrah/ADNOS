'use client';

/* global Map */
import { gsap } from 'gsap';

// Класс для управления анимациями
export class Animator {
  constructor() {
    this.animations = new Map();
  }

  // Создаёт и запускает анимацию с GSAP
  animate(target, props, key) {
    // Остановить предыдущую анимацию с этим ключом, если она существует
    if (key && this.animations.has(key)) {
      this.stop(key);
    }

    // Создаем анимацию с GSAP
    const animation = gsap.to(target, props);
    
    // Сохраняем анимацию, если указан ключ
    if (key) {
      this.animations.set(key, animation);
    }
    
    return animation;
  }

  // Останавливает анимацию по ключу
  stop(key) {
    if (this.animations.has(key)) {
      const animation = this.animations.get(key);
      animation.kill();
      this.animations.delete(key);
    }
  }

  // Останавливает все активные анимации
  stopAll() {
    this.animations.forEach((animation) => {
      animation.kill();
    });
    this.animations.clear();
  }
  
  // Создает циклическую анимацию пульсации
  pulse(target, props = {}, key) {
    const defaultProps = {
      alpha: 0.5,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    };
    
    return this.animate(target, { ...defaultProps, ...props }, key);
  }
  
  // Создает анимацию покачивания
  float(target, props = {}, key) {
    const defaultProps = {
      y: '+=10',
      rotation: 0.02,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    };
    
    return this.animate(target, { ...defaultProps, ...props }, key);
  }
}

// Экспортируем синглтон для использования во всем приложении
export const animator = new Animator();

export default animator; 