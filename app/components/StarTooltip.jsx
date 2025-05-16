'use client';

import { useRef, useEffect, useState } from 'react';
import styles from './StarTooltip.module.css';

const StarTooltip = ({ starData, position }) => {
  const tooltipRef = useRef(null);
  const descriptionRef = useRef(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 400, height: 300 });
  
  // Смещение, чтобы не закрывать звезду и позиционировать относительно курсора
  const offsetX = 20;
  const offsetY = 10;
  
  // Замеряем размеры тултипа после монтирования компонента
  useEffect(() => {
    if (tooltipRef.current && starData) {
      const { offsetWidth, offsetHeight } = tooltipRef.current;
      setTooltipSize({ width: offsetWidth, height: offsetHeight });
    }
  }, [starData]);
  
  // Добавляем обработчик событий колёсика мыши при монтировании компонента
  useEffect(() => {
    const descriptionElement = descriptionRef.current;
    if (!descriptionElement) return;
    
    const handleWheelEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
      descriptionElement.scrollTop += e.deltaY;
    };
    
    descriptionElement.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    return () => {
      descriptionElement.removeEventListener('wheel', handleWheelEvent);
    };
  }, []);
  
  // Расширенная логика вычисления позиции, чтобы тултип не выходил за границы экрана
  const getTooltipPosition = () => {
    if (typeof window === 'undefined') return { left: 0, top: 0 };
    
    const { width, height } = tooltipSize;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Начальное предположение - разместить справа от курсора
    let left = position.x + offsetX;
    let top = position.y + offsetY;
    
    // Правая граница - если не помещается, размещаем слева от курсора
    if (left + width > windowWidth - 10) {
      left = position.x - width - offsetX;
    }
    
    // Если и слева не помещается, центрируем по горизонтали
    if (left < 10) {
      left = Math.max(10, Math.min(windowWidth - width - 10, position.x - width / 2));
    }
    
    // Нижняя граница - если не помещается, размещаем над курсором
    if (top + height > windowHeight - 10) {
      top = position.y - height - offsetY;
    }
    
    // Если и сверху не помещается, размещаем в области видимости
    if (top < 10) {
      top = Math.max(10, Math.min(windowHeight - height - 10, position.y + 10));
    }
    
    return { left, top };
  };
  
  if (!starData) return null;
  
  const { left, top } = getTooltipPosition();
  
  return (
    <div 
      ref={tooltipRef}
      className={styles.starTooltip} 
      style={{ left: `${left}px`, top: `${top}px` }}
    >
      <div className={styles.tooltipContent}>
        <div className={styles.tooltipCorner}></div>
        <div className={styles.tooltipCorner}></div>
        <div className={styles.tooltipCorner}></div>
        <div className={styles.tooltipCorner}></div>
        
        <div className={styles.tooltipHeader}>
          <div className={styles.starName}>{starData.name}</div>
          <div className={styles.starType}>{starData.type}</div>
        </div>
        
        <div className={styles.divider} />
        
        <div className={styles.starDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Class:</span>
            <span className={styles.detailValue}>{starData.class}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Temperature:</span>
            <span className={styles.detailValue}>{starData.temperature}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Generation:</span>
            <span className={styles.detailValue}>{starData.id}</span>
          </div>
        </div>
        
        <div className={styles.divider} />
        
        {/* Улучшенная визуализация звезды */}
        <div className={styles.starVisualization}>
          <div className={styles.starSystem}>
            {/* Звезда с хромосферой и короной */}
            <div 
              className={`${styles.starVisual} ${getStarTypeClass(starData.type)}`} 
              title={`Star type: ${starData.type}`}
            >
              <div className={styles.starCore}></div>
              <div className={styles.starChromosphere}></div>
              <div className={styles.starCorona}></div>
              
              {/* Солнечные вспышки/протуберанцы */}
              <div className={`${styles.starFlare} ${styles.flare1}`}></div>
              <div className={`${styles.starFlare} ${styles.flare2}`}></div>
              <div className={`${styles.starFlare} ${styles.flare3}`}></div>
            </div>
            
            {/* Орбиты планет (без планет) */}
            <div className={`${styles.starOrbit} ${styles.orbit1}`}></div>
            <div className={`${styles.starOrbit} ${styles.orbit2}`}></div>
            <div className={`${styles.starOrbit} ${styles.orbit3}`}></div>
          </div>
          
          {/* Данные о звезде наложенные на визуализацию */}
          <div className={styles.starDataOverlay}>
            <div className={styles.overlayData}>R: {generateStarRadius(starData)}</div>
            <div className={styles.overlayData}>M: {generateStarMass(starData)}</div>
          </div>
        </div>
        
        <div 
          ref={descriptionRef}
          className={styles.starDescription}
        >
          {starData.description}
        </div>
      </div>
    </div>
  );
};

// Функция для определения класса стиля на основе типа звезды
function getStarTypeClass(type) {
  if (!type) return styles.defaultStar;
  
  const firstChar = type.charAt(0).toUpperCase();
  
  switch (firstChar) {
    case 'O': return styles.blueStar;     // Голубые звезды
    case 'B': return styles.blueStar;     // Бело-голубые звезды
    case 'A': return styles.whiteStar;    // Белые звезды
    case 'F': return styles.whiteStar;    // Бело-желтые звезды
    case 'G': return styles.yellowStar;   // Желтые звезды (как Солнце)
    case 'K': return styles.orangeStar;   // Оранжевые звезды
    case 'M': return styles.redStar;      // Красные звезды
    case 'L': 
    case 'T': 
    case 'Y': return styles.brownStar;    // Коричневые карлики
    case 'R': 
    case 'N': 
    case 'S': return styles.carbonStar;   // Углеродные звезды
    case 'W': return styles.wolfRayetStar; // Звезды Вольфа-Райе
    case 'Q': 
    case 'X': 
    case 'Z': return styles.exoticStar;   // Экзотические звезды
    default: return styles.defaultStar;
  }
}

// Вспомогательные функции для генерации информации о звезде
function generateStarRadius(starData) {
  // Генерируем псевдо-случайный радиус на основе ID звезды
  if (!starData || !starData.id) return "1.0 R☉";
  
  // Используем первые 4 символа ID как seed
  const seed = starData.id.substring(0, 4).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  
  // Определяем диапазон в зависимости от типа звезды
  let radius = 1.0;
  const firstChar = starData.type ? starData.type.charAt(0).toUpperCase() : 'G';
  
  switch (firstChar) {
    case 'O': radius = 6.0 + (seed % 15); break;     // Сверхгиганты
    case 'B': radius = 4.0 + (seed % 10); break;     // Гиганты
    case 'A': 
    case 'F': radius = 1.5 + (seed % 5); break;      // Больше Солнца
    case 'G': radius = 0.8 + (seed % 15) / 10; break; // Как Солнце
    case 'K': radius = 0.5 + (seed % 10) / 10; break; // Меньше Солнца
    case 'M': radius = 0.1 + (seed % 5) / 10; break;  // Красные карлики
    case 'L': 
    case 'T': 
    case 'Y': radius = 0.05 + (seed % 10) / 100; break; // Коричневые карлики
    case 'W': radius = 1.0 + (seed % 20) / 10; break;   // Вольфа-Райе
    default: radius = 1.0 + (seed % 20) / 10;
  }
  
  return `${radius.toFixed(1)} R☉`;
}

function generateStarMass(starData) {
  if (!starData || !starData.id) return "1.0 M☉";
  
  // Используем последние 4 символа ID как seed
  const idLength = starData.id.length;
  const seed = starData.id.substring(Math.max(0, idLength - 4)).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  
  // Определяем диапазон в зависимости от типа звезды
  let mass = 1.0;
  const firstChar = starData.type ? starData.type.charAt(0).toUpperCase() : 'G';
  
  switch (firstChar) {
    case 'O': mass = 20.0 + (seed % 40); break;      // Массивные звезды
    case 'B': mass = 10.0 + (seed % 20); break;      // Тяжелые звезды
    case 'A': 
    case 'F': mass = 1.5 + (seed % 10); break;       // Больше Солнца
    case 'G': mass = 0.8 + (seed % 20) / 10; break;  // Как Солнце
    case 'K': mass = 0.5 + (seed % 10) / 10; break;  // Меньше Солнца
    case 'M': mass = 0.1 + (seed % 30) / 10; break;  // Красные карлики
    case 'L': 
    case 'T': 
    case 'Y': mass = 0.01 + (seed % 10) / 100; break; // Коричневые карлики
    case 'W': mass = 10.0 + (seed % 30); break;       // Вольфа-Райе
    default: mass = 1.0 + (seed % 30) / 10;
  }
  
  return `${mass.toFixed(1)} M☉`;
}

export default StarTooltip; 