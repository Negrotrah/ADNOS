'use client';

import { useRef, useEffect, useState } from 'react';
import styles from './GalaxyMap.module.css';

// Проверка на клиентскую среду
const isClient = typeof window !== 'undefined';

// Генерация случайных звездных точек
const generateStars = (count = 150) => {
  const stars = [];
  
  for (let i = 0; i < count; i++) {
    // Равномерно распределяем звезды по всему полю с небольшим смещением
    const x = Math.random() * 180;
    const y = Math.random() * 140;
    
    // Разные размеры "звезд" с большей вероятностью маленьких звезд
    const size = Math.random() < 0.85 ? 1 : Math.random() < 0.95 ? 2 : 3;
    
    // Разные цвета (преимущественно бело-голубые)
    let color = '#ffffff';
    if (Math.random() < 0.3) {
      color = '#c0e3ff'; // Голубоватый
    } else if (Math.random() < 0.2) {
      color = '#ffe0b2'; // Желтоватый
    }
    
    // Добавим случайную "важность" объекта
    const isImportant = Math.random() < 0.07;
    
    stars.push({
      x,
      y,
      initialX: x, // Сохраняем начальную X-координату для стабильности
      size,
      color,
      alpha: 0.5 + Math.random() * 0.5,
      isImportant,
      pulsateSpeed: 0.2 + Math.random() * 0.5
    });
  }
  
  return stars;
};

const GalaxyMap = ({ speed = 0, direction = 'Stopped' }) => {
  const canvasRef = useRef(null);
  const [stars, setStars] = useState([]);
  const animationFrameRef = useRef(null);
  const lastUpdateTimeRef = useRef(Date.now());
  const lastDirectionRef = useRef('Forward'); // Сохраняем последнее направление движения
  
  // Фиксированная позиция корабля - всегда в центре
  const shipPosition = { x: 90, y: 70 };
  
  // Генерируем звезды при первом рендере
  useEffect(() => {
    if (isClient) {
      setStars(generateStars(150));
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Обновление звезд при изменении скорости или направления
  useEffect(() => {
    lastUpdateTimeRef.current = Date.now();
    
    // Запоминаем направление при движении (игнорируем Stopped)
    if (speed > 0 && direction !== 'Stopped') {
      lastDirectionRef.current = direction;
    }
  }, [speed, direction]);
  
  // Рисуем карту на canvas
  useEffect(() => {
    if (!canvasRef.current || !isClient || stars.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Устанавливаем правильные размеры canvas (для четкости на Retina дисплеях)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 180 * dpr;
    canvas.height = 140 * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = '180px';
    canvas.style.height = '140px';
    
    // Функция для отрисовки кадра анимации
    const renderFrame = () => {
      // Вычисляем дельту времени для плавности
      const now = Date.now();
      const deltaTime = now - lastUpdateTimeRef.current;
      lastUpdateTimeRef.current = now;
      
      // Очищаем холст
      ctx.fillStyle = '#050a18';
      ctx.fillRect(0, 0, 180, 140);
      
      // Рисуем координатные оси
      ctx.strokeStyle = 'rgba(48, 112, 170, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 70);
      ctx.lineTo(180, 70);
      ctx.moveTo(90, 0);
      ctx.lineTo(90, 140);
      ctx.stroke();
      
      // Перемещаем звезды если скорость не равна нулю
      if (speed !== 0 && deltaTime > 0) {
        setStars(prevStars => prevStars.map(star => {
          // Направление движения зависит от направления корабля
          // Используем текущее направление или последнее сохраненное
          const directionFactor = (direction === 'Backward' || 
            (direction === 'Stopped' && lastDirectionRef.current === 'Backward')) ? -1 : 1;
          
          // Скорость движения звезд (уменьшаем коэффициент для более плавного движения)
          const moveSpeed = Math.abs(speed) * deltaTime * 0.01;
          
          // Новая Y-координата - движение вертикально (учитываем направление)
          let newY = star.y + directionFactor * moveSpeed;
          
          // Делаем изменение X-координаты детерминированным и зависящим от позиции звезды
          // Используем синусоидальное движение вместо случайного для более плавного эффекта
          // Для каждой звезды используем ее initialX как базу и добавляем легкое синусоидальное колебание
          const phase = star.initialX * 0.05; // Уникальная фаза для каждой звезды 
          let newX = star.initialX + Math.sin(now * 0.0002 + phase) * 0.05;
          
          // Ограничиваем X-координату пределами экрана
          if (newX < 0) newX = 0;
          if (newX > 180) newX = 180;
          
          // Проверяем, не вышла ли звезда за границы поля
          if (directionFactor > 0) { // Движение вперед - звезды идут сверху вниз
            if (newY > 140) {
              // Переносим звезду в верхнюю часть экрана с сохранением X-координаты
              newY = -5 - Math.random() * 10; // Добавляем небольшой разброс по Y для менее однородного появления
            }
          } else { // Движение назад - звезды идут снизу вверх
            if (newY < 0) {
              // Переносим звезду в нижнюю часть экрана с сохранением X-координаты
              newY = 145 + Math.random() * 10; // Добавляем небольшой разброс по Y
            }
          }
          
          return {
            ...star,
            x: newX,
            y: newY,
            initialX: star.initialX || newX // Сохраняем initialX или устанавливаем для обратной совместимости
          };
        }));
      }
      
      // Рисуем звезды (точки)
      stars.forEach(star => {
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Дополнительная обводка для важных объектов
        if (star.isImportant) {
          ctx.globalAlpha = 0.5;
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          const pulseSize = star.size + 3 + Math.sin(Date.now() * 0.001 * star.pulsateSpeed) * 2;
          ctx.arc(star.x, star.y, pulseSize, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      
      // Рисуем текущую позицию корабля (фиксированную)
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(shipPosition.x, shipPosition.y, 4, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#00ffaa';
      ctx.beginPath();
      ctx.arc(shipPosition.x, shipPosition.y, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Рисуем пунктирную окружность вокруг текущей позиции
      ctx.strokeStyle = 'rgba(68, 170, 255, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i < Math.PI * 2; i += Math.PI / 12) {
        const startAngle = i;
        const endAngle = i + Math.PI / 24;
        ctx.beginPath();
        ctx.arc(shipPosition.x, shipPosition.y, 8, startAngle, endAngle);
        ctx.stroke();
      }
      
      // Запрашиваем следующий кадр
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };
    
    // Запускаем анимацию
    renderFrame();
    
    // Очистка при размонтировании
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [stars, speed, direction, shipPosition.x, shipPosition.y]);
  
  // Если мы не на клиенте, возвращаем пустой div чтобы избежать ошибок серверного рендеринга
  if (!isClient) {
    return <div className={styles.galaxyMapContainer}></div>;
  }
  
  return (
    <div className={styles.galaxyMapContainer}>
      <div className={styles.mapTitle}>КАРТА МЕСТНОСТИ</div>
      <div className={styles.mapBox}>
        <canvas 
          ref={canvasRef} 
          width="180" 
          height="140" 
          style={{ display: 'block', width: '180px', height: '140px' }} 
        />
      </div>
      <div className={styles.mapLegend}>
        <div className={styles.legendItem}>
          <span className={styles.dot}></span>
          <span className={styles.legendText}>ТЕКУЩЕЕ ПОЛОЖЕНИЕ</span>
        </div>
      </div>
    </div>
  );
};

export default GalaxyMap; 