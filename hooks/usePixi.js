'use client';

import { useState, useEffect, useRef } from 'react';
import { createPixiApp, destroyPixiApp } from '@lib/pixi/pixiApp';

// React Hook для работы с PixiJS в функциональных компонентах
export function usePixi(options = {}) {
  const [app, setApp] = useState(null);
  const containerRef = useRef(null);
  const isInitialized = useRef(false);

  // Инициализация PixiJS
  useEffect(() => {
    // Проверяем, что мы находимся в браузере
    if (typeof window === 'undefined') return;
    
    // Предотвращаем повторную инициализацию
    if (isInitialized.current || !containerRef.current) return;
    
    // Создаем приложение PixiJS
    const pixiApp = createPixiApp(containerRef, options);
    
    // Проверяем, что контейнер существует перед добавлением canvas
    if (containerRef.current) {
      // Добавляем canvas в DOM
      containerRef.current.appendChild(pixiApp.view);
    }
    
    // Обновляем состояние
    setApp(pixiApp);
    isInitialized.current = true;
    
    // Очистка при размонтировании компонента
    return () => {
      if (pixiApp) {
        destroyPixiApp(pixiApp);
      }
      isInitialized.current = false;
    };
  }, [options]);

  return { app, containerRef };
}

export default usePixi; 