'use client';

import * as PIXI from 'pixi.js';

// Создание PixiJS приложения с настройками
export function createPixiApp(canvasParent, options = {}) {
  // Проверяем, что мы в браузере
  if (typeof window === 'undefined') return null;
  
  // Объединяем стандартные настройки с пользовательскими
  const defaultOptions = {
    width: window.innerWidth || 800,
    height: window.innerHeight || 600,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true,
  };
  
  const appOptions = { ...defaultOptions, ...options };
  
  // Создаем приложение
  const app = new PIXI.Application(appOptions);
  
  // Функция обработки изменения размера
  const handleResize = () => {
    if (!canvasParent || !canvasParent.current) return;
    
    const parent = canvasParent.current;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    
    app.renderer.resize(width, height);
  };
  
  // Добавляем обработчик изменения размера окна
  window.addEventListener('resize', handleResize);
  
  // Сохраняем ссылку на обработчик для последующего удаления
  app.resizeHandler = handleResize;
  
  return app;
}

// Функция для очистки ресурсов PixiJS
export function destroyPixiApp(app) {
  if (!app) return;
  
  // Удаляем слушатель изменения размера
  if (typeof window !== 'undefined' && app.resizeHandler) {
    window.removeEventListener('resize', app.resizeHandler);
  }
  
  // Останавливаем анимацию
  app.ticker.stop();
  
  // Уничтожаем приложение и освобождаем ресурсы
  app.destroy(true, { children: true, texture: true, baseTexture: true });
} 