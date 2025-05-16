'use client';

import { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

/**
 * Базовый компонент для секций космического корабля
 * Используется как абстрактный класс для создания различных отсеков
 */
const ShipSection = ({ app, sectionName, position, visible = false, onSelect }) => {
  const [container, setContainer] = useState(null);
  const [isActive, setIsActive] = useState(false);
  
  // Создание контейнера для секции
  useEffect(() => {
    if (!app) return;
    
    // Создаем главный контейнер для секции
    const sectionContainer = new PIXI.Container();
    sectionContainer.position.set(position.x, position.y);
    sectionContainer.visible = visible;
    sectionContainer.alpha = 0.7; // По умолчанию немного прозрачен
    app.stage.addChild(sectionContainer);
    
    // Делаем контейнер интерактивным
    sectionContainer.interactive = true;
    sectionContainer.buttonMode = true;
    
    // Добавляем обработчики событий
    sectionContainer.on('pointerover', () => {
      gsap.to(sectionContainer, { alpha: 1, duration: 0.3 });
    });
    
    sectionContainer.on('pointerout', () => {
      if (!isActive) {
        gsap.to(sectionContainer, { alpha: 0.7, duration: 0.3 });
      }
    });
    
    sectionContainer.on('pointerdown', () => {
      setIsActive(true);
      if (onSelect) {
        onSelect(sectionName);
      }
    });
    
    // Сохраняем контейнер в состоянии
    setContainer(sectionContainer);
    
    // Очистка при размонтировании
    return () => {
      if (sectionContainer) {
        app.stage.removeChild(sectionContainer);
        sectionContainer.destroy({ children: true });
      }
    };
  }, [app, position, sectionName, visible, onSelect, isActive]);
  
  // Обновление активного состояния
  useEffect(() => {
    if (!container) return;
    
    if (isActive) {
      gsap.to(container, { alpha: 1, scale: 1.05, duration: 0.3 });
    } else {
      gsap.to(container, { alpha: 0.7, scale: 1, duration: 0.3 });
    }
  }, [isActive, container]);
  
  // Эффект для обновления видимости
  useEffect(() => {
    if (!container) return;
    container.visible = visible;
  }, [visible, container]);
  
  return null; // Компонент не возвращает JSX, работает только с PixiJS
};

export default ShipSection; 