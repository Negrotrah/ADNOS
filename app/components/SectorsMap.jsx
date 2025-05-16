/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import styles from './SectorsMap.module.css';

// Проверка на клиентскую среду
const isClient = typeof window !== 'undefined';

// Данные о секторах с описанием
const sectorsData = [
  { 
    id: '12-A', 
    name: 'Сектор 12-A', 
    x: 150, 
    y: 300, 
    radius: 30, 
    type: 'anomalous', 
    description: 'Смотреть в разделе сектора 12-A',
    status: 'Исследуется'
  },
  { 
    id: '11-B', 
    name: 'Сектор 11-B', 
    x: 220, 
    y: 80, 
    radius: 25, 
    type: 'explored',
    description: 'Картографирован в 2181 году. Содержит 3 звездные системы с кислородными планетами. Представляет интерес для колонизации.',
    status: 'Исследован на 94%'
  },
  { 
    id: '13-B', 
    name: 'Сектор 13-B', 
    x: 320, 
    y: 160, 
    radius: 35, 
    type: 'restricted',
    description: 'Ограниченный доступ. Сам сектор безвреден, но является крайне преступной зоной.',
    status: 'Запрещённая зона'
  },
  { 
    id: '10-C', 
    name: 'Сектор 10-C', 
    x: 170, 
    y: 180, 
    radius: 28, 
    type: 'registered',
    description: 'Сектор регулярно используется для транзитных перелётов. Не представляет научного интереса.',
    status: 'Транзитный'
  },
  { 
    id: '14-A', 
    name: 'Сектор 14-A', 
    x: 370, 
    y: 100, 
    radius: 22, 
    type: 'registered',
    description: 'Содержит Опорный Пункт II - станцию технического обслуживания исследовательских кораблей.',
    status: 'Зарегистрирован'
  },
  { 
    id: '9-D', 
    name: 'Сектор 9-D', 
    x: 120, 
    y: 130, 
    radius: 20, 
    type: 'explored',
    description: 'Богат ресурсами. Отмечен для промышленного освоения. Содержит значительные залежи редких металлов.',
    status: 'Исследован'
  },
  { id: '15-B', name: 'Сектор 15-B', x: 420, y: 180, radius: 32, type: 'registered', description: 'Транзитный сектор с умеренной звездной плотностью. Используется для калибровки навигационных систем.', status: 'Зарегистрирован' },
  { id: '16-C', name: 'Сектор 16-C', x: 470, y: 130, radius: 26, type: 'restricted', description: 'Ограниченный доступ. В секторе проводятся эксперименты с квантовыми структурами вне юридической зоны конвенций.', status: 'Закрытый сектор' },
  { id: '8-A', name: 'Сектор 8-A', x: 140, y: 60, radius: 24, type: 'explored', description: 'Исследован в 2174. Примечательные объекты: система двойных нейтронных звезд B-99.', status: 'Изучен полностью' },
  { id: '17-D', name: 'Сектор 17-D', x: 520, y: 80, radius: 28, type: 'registered', description: 'Содержит значительное количество астероидных полей. Потенциально опасен для навигации.', status: 'Требует внимания' },
  { id: '7-B', name: 'Сектор 7-B', x: 90, y: 180, radius: 22, type: 'registered', description: 'Сектор с низкой звездной плотностью. Используется как контрольная точка при дальних перелетах.', status: 'Стандартный' },
  { id: '18-A', name: 'Сектор 18-A', x: 570, y: 160, radius: 30, type: 'registered', description: 'Зарегистрирован как стратегический сектор ввиду близости к главным транспортным путям.', status: 'Стратегическое значение' },
  { id: '19-C', name: 'Сектор 19-C', x: 540, y: 230, radius: 26, type: 'explored', description: 'Исследован в 2180. Обнаружены признаки древней технологической активности неизвестной цивилизации.', status: 'Исследуется (повторно)' },
  { id: '20-D', name: 'Сектор 20-D', x: 470, y: 250, radius: 24, type: 'registered', description: 'Стандартный сектор с регулярным движением транспортных и исследовательских кораблей.', status: 'Зарегистрирован' },
  { id: '21-A', name: 'Сектор 21-A', x: 400, y: 220, radius: 28, type: 'restricted', description: 'Закрыт для посещения. Сильные гравитационные аномалии. Высокий риск структурного повреждения кораблей.', status: 'Опасная зона' },
  { id: '22-B', name: 'Сектор 22-B', x: 320, y: 270, radius: 22, type: 'explored', description: 'Полностью исследован. Содержит 7 звездных систем. Нет обитаемых планет.', status: 'Изучен' },
];

// Генерация звезд для фона
const generateStars = (count = 500, width = 600, height = 350) => {
  const stars = [];
  
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() < 0.9 ? 1 : Math.random() < 0.97 ? 1.5 : 2;
    
    let color = '#ffffff';
    if (Math.random() < 0.3) {
      color = '#c0e3ff'; // Голубоватый
    } else if (Math.random() < 0.2) {
      color = '#ffe0b2'; // Желтоватый
    }
    
    stars.push({
      x,
      y,
      size,
      color,
      alpha: 0.3 + Math.random() * 0.7
    });
  }
  
  return stars;
};

const SectorsMap = () => {
  const canvasRef = useRef(null);
  const [stars, setStars] = useState([]);
  const [hoveredSector, setHoveredSector] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const animationFrameRef = useRef(null);
  
  // Референс для звука клика
  const cliSoundRef = useRef(null);
  
  // Размеры карты
  const mapWidth = 600;
  const mapHeight = 350;
  
  // Инициализация звукового эффекта
  useEffect(() => {
    if (typeof window !== 'undefined') {
      cliSoundRef.current = new Audio('/assets/sounds/Cli.mp3');
      cliSoundRef.current.volume = 0.15;
    }
    
    return () => {
      if (cliSoundRef.current) {
        cliSoundRef.current.pause();
        cliSoundRef.current = null;
      }
    };
  }, []);
  
  // Генерируем звезды при первом рендере
  useEffect(() => {
    if (isClient) {
      setStars(generateStars(500, mapWidth, mapHeight));
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Функция для обработки движения мыши для определения наведенного сектора
  const handleMouseMove = (event) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    
    // Проверяем, находится ли курсор над каким-либо сектором
    let found = null;
    for (const sector of sectorsData) {
      const dx = x - sector.x;
      const dy = y - sector.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < sector.radius) {
        found = sector;
        break;
      }
    }
    
    setHoveredSector(found);
  };
  
  // Обработчик клика для выбора сектора - обернем в useCallback для мемоизации
  const handleClick = useCallback(() => {
    if (hoveredSector) {
      // Воспроизводим звук при клике на сектор
      if (cliSoundRef.current) {
        cliSoundRef.current.currentTime = 0;
        cliSoundRef.current.play().catch(e => console.log('Audio play error:', e));
      }
      
      setSelectedSector(selectedSector && selectedSector.id === hoveredSector.id ? null : hoveredSector);
    } else {
      setSelectedSector(null);
    }
  }, [hoveredSector, selectedSector]);
  
  // Рисуем карту на canvas
  useEffect(() => {
    if (!canvasRef.current || !isClient || stars.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Устанавливаем правильные размеры canvas (для четкости на Retina дисплеях)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = mapWidth * dpr;
    canvas.height = mapHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${mapWidth}px`;
    canvas.style.height = `${mapHeight}px`;
    
    // Добавляем обработчики
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    
    // Функция для отрисовки кадра анимации
    const renderFrame = () => {
      // Очищаем холст
      ctx.fillStyle = '#050a18';
      ctx.fillRect(0, 0, mapWidth, mapHeight);
      
      // Рисуем звезды фона
      stars.forEach(star => {
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Рисуем координатную сетку
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = '#4099ff';
      ctx.lineWidth = 1;
      
      // Горизонтальные линии (увеличиваем количество)
      for (let y = 0; y <= mapHeight; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(mapWidth, y);
        ctx.stroke();
      }
      
      // Вертикальные линии (увеличиваем количество)
      for (let x = 0; x <= mapWidth; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, mapHeight);
        ctx.stroke();
      }
      
      // Рисуем сектора
      sectorsData.forEach(sector => {
        // Определяем цвет в зависимости от типа сектора
        let fillColor;
        let strokeColor;
        
        switch (sector.type) {
          case 'current':
            fillColor = 'rgba(72, 255, 237, 0.15)';
            strokeColor = 'rgba(72, 255, 237, 0.7)';
            break;
          case 'anomalous': // Новый тип - аномальный с фиолетовым цветом
            fillColor = 'rgba(150, 70, 255, 0.2)';
            strokeColor = 'rgba(180, 90, 255, 0.7)';
            break;
          case 'explored':
            fillColor = 'rgba(255, 255, 255, 0.08)';
            strokeColor = 'rgba(255, 255, 255, 0.3)';
            break;
          case 'restricted':
            fillColor = 'rgba(255, 56, 96, 0.1)';
            strokeColor = 'rgba(255, 56, 96, 0.4)';
            break;
          case 'registered':
          default:
            fillColor = 'rgba(64, 153, 255, 0.08)';
            strokeColor = 'rgba(64, 153, 255, 0.4)';
        }
        
        // Увеличиваем прозрачность при наведении или выборе
        const isActive = (hoveredSector && hoveredSector.id === sector.id) || 
                         (selectedSector && selectedSector.id === sector.id);
        
        if (isActive) {
          fillColor = fillColor.replace(/[\d.]+\)$/, '0.25)');
          strokeColor = strokeColor.replace(/[\d.]+\)$/, '0.9)');
        }
        
        // Рисуем сектор как шестиугольник
        ctx.globalAlpha = 1;
        const sides = 6;
        const angleOffset = Math.PI / 6;
        
        // Заполнение
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const angle = angleOffset + i * (2 * Math.PI / sides);
          const x = sector.x + sector.radius * Math.cos(angle);
          const y = sector.y + sector.radius * Math.sin(angle);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fill();
        
        // Обводка
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const angle = angleOffset + i * (2 * Math.PI / sides);
          const x = sector.x + sector.radius * Math.cos(angle);
          const y = sector.y + sector.radius * Math.sin(angle);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
        
        // Подпись сектора
        ctx.fillStyle = sector.type === 'anomalous' ? 'rgba(180, 90, 255, 0.9)' : 
                      sector.type === 'current' ? 'rgba(72, 255, 237, 0.9)' : 
                      'rgba(220, 220, 220, 0.7)';
        ctx.font = '10px "Share Tech Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(sector.id, sector.x, sector.y);
        
        // Если это аномальный сектор (12-A), добавляем подпись "ANOMALY DETECTED"
        if (sector.type === 'anomalous') {
          ctx.fillStyle = 'rgba(180, 90, 255, 0.8)';
          ctx.font = '9px "Share Tech Mono", monospace';
          ctx.fillText('ANOMALY DETECTED', sector.x, sector.y + 15);
        }
        // Если это текущий сектор, добавим подпись "CURRENT POSITION"
        else if (sector.type === 'current') {
          ctx.fillStyle = 'rgba(72, 255, 237, 0.8)';
          ctx.font = '9px "Share Tech Mono", monospace';
          ctx.fillText('CURRENT POSITION', sector.x, sector.y + 15);
        }
      });
      
      // Рисуем информацию о наведенном секторе в верхнем левом углу (вместо левого нижнего)
      if (hoveredSector) {
        const infoX = 20;
        const infoY = 30; // Верхний левый угол
        
        ctx.fillStyle = 'rgba(8, 19, 39, 0.8)';
        ctx.fillRect(infoX - 10, infoY - 20, 200, 60);
        ctx.strokeStyle = 'rgba(64, 153, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(infoX - 10, infoY - 20, 200, 60);
        
        ctx.fillStyle = 'rgba(220, 220, 220, 0.9)';
        ctx.font = '12px "Share Tech Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`SECTOR: ${hoveredSector.id}`, infoX, infoY);
        ctx.fillText(`TYPE: ${hoveredSector.type.toUpperCase()}`, infoX, infoY + 15);
        ctx.fillText(`STATUS: ${hoveredSector.status}`, infoX, infoY + 30);
      }
      
      // Если сектор выбран, отображаем детальную информацию справа сверху
      if (selectedSector) {
        const infoX = mapWidth - 280;
        const infoY = 30;
        const infoWidth = 270;
        const infoHeight = 120;
        
        // Фон панели
        ctx.fillStyle = 'rgba(8, 19, 39, 0.9)';
        ctx.fillRect(infoX - 10, infoY - 20, infoWidth, infoHeight);
        
        // Рамка панели
        ctx.strokeStyle = selectedSector.type === 'anomalous' ? 'rgba(180, 90, 255, 0.7)' :
                         selectedSector.type === 'restricted' ? 'rgba(255, 56, 96, 0.7)' :
                         selectedSector.type === 'explored' ? 'rgba(255, 255, 255, 0.5)' :
                         'rgba(64, 153, 255, 0.7)';
        ctx.lineWidth = 1;
        ctx.strokeRect(infoX - 10, infoY - 20, infoWidth, infoHeight);
        
        // Заголовок
        ctx.fillStyle = selectedSector.type === 'anomalous' ? 'rgba(180, 90, 255, 0.9)' :
                      selectedSector.type === 'restricted' ? 'rgba(255, 56, 96, 0.9)' :
                      selectedSector.type === 'explored' ? 'rgba(255, 255, 255, 0.9)' :
                      'rgba(64, 153, 255, 0.9)';
        ctx.font = 'bold 14px "Share Tech Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${selectedSector.name.toUpperCase()}`, infoX, infoY);
        
        // Статус
        ctx.fillStyle = 'rgba(180, 180, 180, 0.9)';
        ctx.font = '12px "Share Tech Mono", monospace';
        ctx.fillText(`СТАТУС: ${selectedSector.status}`, infoX, infoY + 20);
        
        // Тип сектора
        ctx.fillText(`ТИП: ${selectedSector.type.toUpperCase()}`, infoX, infoY + 40);
        
        // Описание (с переносом строк)
        const description = selectedSector.description;
        const maxWidth = infoWidth - 10;
        const lineHeight = 16;
        
        ctx.fillStyle = 'rgba(220, 220, 220, 0.8)';
        ctx.font = '11px "Share Tech Mono", monospace';
        
        let y = infoY + 60;
        let words = description.split(' ');
        let line = '';
        
        for (let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + ' ';
          let metrics = ctx.measureText(testLine);
          let testWidth = metrics.width;
          
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, infoX, y);
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, infoX, y);
      }
      
      // Рисуем текущую позицию корабля под сектором 12-A
      const anomalousSector = sectorsData.find(s => s.id === '12-A');
      if (anomalousSector) {
        // Координаты текущей позиции - прямо в центре сектора, но слегка левее
        const currentX = anomalousSector.x - 7; // Смещение влево
        const currentY = anomalousSector.y + 5; // Слегка ниже центра сектора, но внутри него
        
        // Создаем свечение (градиент) для точки
        const glow = ctx.createRadialGradient(
          currentX, currentY, 0,
          currentX, currentY, 8
        );
        glow.addColorStop(0, 'rgba(72, 255, 150, 0.9)');
        glow.addColorStop(0.5, 'rgba(72, 255, 150, 0.3)');
        glow.addColorStop(1, 'rgba(72, 255, 150, 0)');
        
        // Рисуем свечение
        ctx.globalAlpha = 1;
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Рисуем центральную точку
        ctx.fillStyle = 'rgba(120, 255, 180, 1)';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Запрашиваем следующий кадр
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };
    
    // Запускаем анимацию
    animationFrameRef.current = requestAnimationFrame(renderFrame);
    renderFrame();
    
    // Очистка при размонтировании
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [stars.length, handleMouseMove, handleClick]);
  
  // Если мы не на клиенте, возвращаем пустой div чтобы избежать ошибок серверного рендеринга
  if (!isClient) {
    return <div style={{ width: '100%', height: '100%' }}></div>;
  }
  
  return (
    <div className={styles.sectorsMapContainer}>
      <canvas 
        ref={canvasRef} 
        width={mapWidth}
        height={mapHeight}
        style={{ 
          width: '100%', 
          height: '100%',
          objectFit: 'contain'
        }} 
      />
      <div className={styles.sectorInstructions}>
        НАЖМИТЕ НА СЕКТОР ДЛЯ ПОЛУЧЕНИЯ ИНФОРМАЦИИ
      </div>
    </div>
  );
};

export default SectorsMap; 