'use client';

import { useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

const SpaceShip = ({ app }) => {
  useEffect(() => {
    if (!app) return;
    
    // Создаем контейнер для космического корабля
    const container = new PIXI.Container();
    app.stage.addChild(container);
    
    // Позиционируем контейнер в центре экрана
    container.position.set(app.screen.width / 2, app.screen.height / 2);
    
    // Создаем базовую форму корабля (временный плейсхолдер)
    const ship = new PIXI.Graphics();
    
    // Корпус
    ship.beginFill(0x333355);
    ship.drawRect(-100, -30, 200, 60);
    ship.endFill();
    
    // Кабина
    ship.beginFill(0x6666AA);
    ship.drawCircle(50, 0, 30);
    ship.endFill();
    
    // Двигатели
    ship.beginFill(0x444466);
    ship.drawRect(-110, -20, 20, 40);
    ship.endFill();
    
    // Свечение двигателей
    const engineGlow = new PIXI.Graphics();
    engineGlow.beginFill(0x3399FF, 0.7);
    engineGlow.drawCircle(-120, 0, 10);
    engineGlow.endFill();
    
    // Добавляем корабль и свечение в контейнер
    container.addChild(ship);
    container.addChild(engineGlow);
    
    // Создаем анимацию свечения двигателей с GSAP
    gsap.to(engineGlow, {
      alpha: 0.3,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
    
    // Анимация покачивания корабля
    gsap.to(container, {
      y: app.screen.height / 2 + 10,
      rotation: 0.03,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    
    return () => {
      // Очистка ресурсов
      container.destroy({ children: true });
      gsap.killTweensOf(container);
      gsap.killTweensOf(engineGlow);
    };
  }, [app]);
  
  return null; // Компонент не отображает HTML, только работает с PixiJS
};

export default SpaceShip; 