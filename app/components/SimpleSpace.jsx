/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useRef, useState } from 'react';
import SpaceHUD from './SpaceHUD';
import StarTooltip from './StarTooltip';
import styles from './SimpleSpace.module.css';
import { getRandomStarData } from '../data/starData';

// Массив шаблонов описаний для звезд-пустышек
const starDescriptionTemplates = [
  "Непримечательная звезда. Данные о ней отсутствуют в каталоге.",
  "Сигналы с объекта не поддаются расшифровке. Автоматическая классификация невозможна.",
  "Объект не числится ни в одном известном звёздном реестре. Анализ прерван.",
  "Наблюдение завершено с нулевыми результатами. Светимость и структура в пределах нормы.",
  "Телеметрия объекта утеряна. Вероятная причина — слабое электромагнитное излучение.",
  "Объект классифицирован как малозначимый. Дальнейшее сканирование нецелесообразно.",
  "Звезда стабильна и не представляет научного интереса.",
  "Ошибка: нет доступа к архивам спектрального анализа. Протокол: [ST-BLNK-17]",
  "Сведения о звезде отсутствуют. Возможно, наблюдение осуществляется впервые.",
  "Излучение объекта подавлено внешними источниками. Регистрация неполна.",
  "Объект соответствует параметрам стандартной звезды класса G.",
  "Нет зафиксированной активности. Радиошум в пределах нормы.",
  "Гравитационное воздействие минимально. Спутников не обнаружено.",
  "Идентификатор присвоен. Архивация завершена.",
  "Спектральный анализ завершён. Результаты типичны.",
  "Фоновый объект. Приоритет наблюдения: низкий.",
  "Аномалий не зафиксировано. Эмиссия стабильная.",
  "Показатели массы, объёма и светимости в пределах стандартных значений.",
  "Данные соответствуют шаблону класса K. Подробный анализ не требуется.",
  "Зарегистрировано тепловое излучение. Интенсивность: низкая.",
  "Фиксируется постоянное излучение без всплесков.",
  "Спутниковые тела не обнаружены. Одиночный объект.",
  "Цветовая температура указывает на зрелый фазовый цикл.",
  "Режим наблюдения: пассивный. Активное сканирование не инициировано.",
  "Сигнатура объекта стандартная. Уникальные признаки отсутствуют.",
  "Индексация завершена. Категория: некритическая.",
  "Ранее зафиксирована в стандартном пролёте. Повторное сканирование не требуется.",
  "Низкий приоритет по шкале интереса. Внимание не рекомендуется.",
  "Нет признаков нестабильности. Изменений не зарегистрировано.",
  "Фиксация завершена. Сигнал стабильный. Эхо отсутствует.",
  "Не соответствует признакам двойной системы. Один источник излучения.",
  "Типовое звёздное тело. Архивный уровень анализа.",
  "Все параметры соответствуют норме. Повторное сканирование неэффективно.",
  "Условия вокруг объекта не способствуют формированию систем.",
  "Результаты анализа внесены в базу. Объект помечен как вторичный.",
  "Энергетический профиль линейный. Шум в допустимых пределах.",
  "Целостность структуры не нарушена. Пульсаций нет.",
  "Навигационный маркер присвоен. Звезда не представляет интереса.",
  "Объект зарегистрирован без отклонений. Пропуск допускается.",
  "Сигнатура не содержит следов техногенного происхождения.",
  "Сканирование завершено с ошибкой. Данные не получены.",
  "Сигнал прерывается. Возможно, влияние внешнего поля.",
  "Попытка анализа отклонена. Объект вне зоны надёжного приёма.",
  "Нет стабильного отклика. Вероятная причина — нестабильная среда.",
  "Данные повреждены. Повторный анализ не рекомендован.",
  "Излучение мешает получению точной информации.",
  "Источник света нестабилен. Расчёты недоступны.",
  "Нарушена синхронизация сканирующего блока. Информация недоступна.",
  "Данные об объекте отсутствуют. Попытка записи не удалась.",
  "Фоновое излучение превышает допустимый порог.",
  "Звезда зафиксирована, но данные не сохранились.",
  "Задержка сигнала превысила лимит. Анализ прерван.",
  "Объект не откликается на стандартный пинг.",
  "Отражённый сигнал отсутствует. Поверхностный скан невозможен.",
  "Зарегистрирована тень звезды. Прямая фиксация не удалась.",
  "Протокол определения параметров провален. Причина неизвестна.",
  "Сканер не способен идентифицировать структуру излучения.",
  "Попытка чтения координат завершилась сбоем.",
  "Электромагнитные помехи перекрывают телеметрию.",
  "Звезда классифицирована как 'неопределённая'. Данные потеряны.",
  "Статус объекта — неконкретизированный. Сигнатура смазана.",
  "Не удалось определить форму или спектральный тип.",
  "Навигационные данные об объекте отсутствуют.",
  "Скан не выполнен. Возможно, звезда маскируется за фоновым излучением.",
  "Регистрируется лишь слабая пульсация. Диагностика невозможна.",
  "Задокументирована попытка сканирования. Итог: неизвестность.",
  "Анализ нарушен нестабильной квантовой сигнатурой.",
  "Чтение характеристик объекта невозможно. Причина: размытый контур.",
  "Пассивные сенсоры отказались фиксировать источник.",
  "Объект классифицирован как 'неподтверждённый'. Сведения не получены.",
  "Протокол опроса завершён с нулевым ответом. Архивирование невозможно.",
  "Звезда поглощает отправленные сигналы. Не удалось получить отклик.",
  "Визуальное наблюдение возможно. Спектральное — нет.",
  "Внутренняя помеха исказила результат. Попытка чтения провалена.",
  "Данные скрыты из-за искажений времени сигнала.",
  "Карта объекта обнулена после нескольких неудачных попыток.",
  "Регистрируется только позиция. Все параметры — неизвестны.",
  "Сканирующие датчики не смогли фокусироваться на объекте.",
  "Статус: видимый, но не идентифицируемый.",
  "Информация утеряна в процессе передачи. Источник остался неопределённым.",
  "Объект излучает нестабильную частоту вне стандартного спектра.",
  "Сигнатура излучения периодически исчезает без причины.",
  "В спектре присутствует несвойственный ультрафиолетовый пик.",
  "Наблюдается слабое, но регулярное смещение координат.",
  "Температурные показатели звезды непостоянны. Физическое объяснение отсутствует.",
  "Излучение объекта не соответствует известным законам термодинамики.",
  "Объект отображается на радаре с задержкой, как будто 'догоняет' сигнал.",
  "Внутренние расчёты часто дают разные результаты при повторном сканировании.",
  "Пульсация звезды напоминает кодированный сигнал, но не распознаётся.",
  "Масса объекта не соответствует его гравитационному воздействию.",
  "Визуальный образ объекта слегка искажается при приближении камеры.",
  "Периодически излучение исчезает, но объект остаётся на карте.",
  "Вокруг звезды наблюдается слабое искажение пространства.",
  "При попытке записи телеметрии — временные метки сбиваются.",
  "Окружающее пространство объекта демонстрирует неопознанный резонанс.",
  "Звезда, по расчётам, должна была охладиться — но продолжает излучать энергию.",
  "Структура спектра похожа на сигнал, но без повторяемости.",
  "Необычная плотность для объекта такого размера. Возможна ошибка модели.",
  "Некоторые сенсоры фиксируют два объекта в одной точке.",
  "Наблюдается временный глитч-контур при сканировании объекта.",
  "Частоты объекта резонируют с системными процессами навигации.",
  "Кратковременное наложение координат при попытке фокусировки.",
  "Объект влияет на точность курсора при наведении.",
  "Показания расстояния до объекта колеблются без изменения позиции.",
  "Структура излучения нестабильна и напоминает 'дыхание'.",
  "Цветовая температура противоречит спектральному классу.",
  "Визуальный размер объекта слегка варьируется при каждом рендере.",
  "Сенсоры фиксируют эхо от объекта спустя 0.2 сек после отклика.",
  "В некоторых ракурсах объект словно исчезает с карты.",
  "Фоновое излучение вокруг объекта вызывает паразитные шумы.",
  "Некорректные данные о плотности вещества. Возможно, пустотелая структура.",
  "Периодичность световых импульсов соответствует неестественному ритму.",
  "Наличие нестандартного поляризованного свечения без источника.",
  "Звезда вызывает кратковременное понижение FPS в области рендера.",
  "Световой профиль объекта неравномерный, как будто мерцает 'изнутри'.",
  "Инфракрасные сенсоры регистрируют кратковременные вспышки без источника.",
  "Попытка сфокусировать изображение вызывает сбой алгоритма масштабирования.",
  "Рядом с объектом зафиксирован 'тишинный карман' — нет излучения вообще.",
  "Некоторые значения параметров звезды зашкаливают допустимые границы, но только в логах.",
  "Имеется задержка между движением объекта и его визуальным отображением."
];

// Пасхальное описание (с вероятностью появления не более 5%)
const easterEggDescription = "[АНОМАЛИЯ] Координаты объекта зафиксированы во всех известных системах. Вероятно, это ошибка.";

const SimpleSpace = () => {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const backgroundStarsRef = useRef([]); // Статичные фоновые звезды
  const animationRef = useRef();
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const lastHoverCheckRef = useRef(0); // Для оптимизации проверки наведения
  const pulseEffectRef = useRef(0); // Для эффекта пульсации звезд
  
  // Используем useRef для значений, которые не должны вызывать перерендер
  const isMovingRef = useRef(0); // 0 - стоп, 1 - вперёд, -1 - назад
  const currentSpeedRef = useRef(0); // текущая скорость с инерцией
  const maxSpeedRef = useRef(0.5); // максимальная скорость
  
  // Отображаемые значения через useState
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const [displayMaxSpeed, setDisplayMaxSpeed] = useState(0.5);
  const [displayDirection, setDisplayDirection] = useState('Stopped');
  
  // Состояние для всплывающей подсказки о звезде
  const [hoveredStar, setHoveredStar] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Для хранения референсов на звезды, которые находятся под курсором
  const [hoveredStaticStar, setHoveredStaticStar] = useState(null);
  const [hoveredDynamicStar, setHoveredDynamicStar] = useState(null);
  
  // Инерция как ref, так как это не визуальное состояние
  const inertiaFactor = useRef(0.03);
  
  // Аудио ссылки
  const engineSoundRef = useRef(null);
  const startSoundRef = useRef(null);
  const brakeSoundRef = useRef(null);
  
  // Состояние воспроизведения звуков
  const soundStateRef = useRef({
    enginePlaying: false,
    lastDirection: 0,
  });

  // Функция для создания фоновых статичных звезд
  const createBackgroundStars = (width, height, count) => {
    const stars = [];
    
    // Определяем цвета звезд (неяркие оттенки)
    const starColors = [
      '255, 255, 255',  // белый
      '255, 200, 150',  // оранжевый (более приглушенный для фона)
      '180, 160, 230',  // фиолетовый (более приглушенный для фона)
      '150, 180, 255'   // синий (более приглушенный для фона)
    ];
    
    // Вычисляем количество звезд для разных зон
    const cornerStarsCount = 30; // Звезды для углов
    const remainingStars = count - cornerStarsCount; // Оставшиеся звезды
    const centerStarsCount = Math.floor(remainingStars * 0.25); // 25% оставшихся для центра
    const edgeStarsCount = remainingStars - centerStarsCount; // 75% оставшихся по краям
    
    // Создаем звезды для центральной области (25% от оставшихся)
    for (let i = 0; i < centerStarsCount; i++) {
      // Случайные координаты в центральной части холста
      // Используем 60% от центра холста
      const centralAreaRadius = Math.min(width, height) * 0.3;
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * centralAreaRadius;
      
      const x = width / 2 + Math.cos(angle) * distance;
      const y = height / 2 + Math.sin(angle) * distance;
      
      // Случайный размер - для фоновых звезд делаем меньше
      const radius = Math.random() * 0.8 + 0.2;
      
      // Случайно выбираем цвет из массива
      const colorIndex = Math.floor(Math.random() * starColors.length);
      const color = starColors[colorIndex];
      
      // Делаем более прозрачными, они фоновые
      const alpha = Math.random() * 0.3 + 0.2;
      
      // Добавляем случайные данные о звезде примерно для 30% звезд
      const hasInfo = Math.random() < 0.3;
      const starInfo = hasInfo ? getRandomStarData() : null;
      
      stars.push({
        x: x,
        y: y,
        radius: radius,
        color: `rgba(${color}, ${alpha})`,
        info: starInfo,
        hasInfo: hasInfo
      });
    }
    
    // Создаем звезды для краевой области (75% от оставшихся)
    for (let i = 0; i < edgeStarsCount; i++) {
      // Угол для равномерного распределения по окружности
      const angle = Math.random() * Math.PI * 2;
      
      // Минимальное расстояние от центра (60% от расстояния до края)
      const minEdgeDistance = Math.min(width, height) * 0.3;
      // Максимальное расстояние (до самого края)
      const maxEdgeDistance = Math.sqrt(Math.pow(Math.max(width / 2, width - width / 2), 2) + 
                                       Math.pow(Math.max(height / 2, height - height / 2), 2));
      
      // Случайное расстояние в краевой зоне
      const distance = minEdgeDistance + Math.random() * (maxEdgeDistance - minEdgeDistance);
      
      // Вычисляем координаты
      const x = width / 2 + Math.cos(angle) * distance;
      const y = height / 2 + Math.sin(angle) * distance;
      
      // Ограничиваем координаты в пределах холста с небольшим отступом
      const margin = 10;
      const boundedX = Math.max(margin, Math.min(width - margin, x));
      const boundedY = Math.max(margin, Math.min(height - margin, y));
      
      // Случайный размер - для краевых звезд делаем немного больше
      const radius = Math.random() * 0.9 + 0.3;
      
      // Случайно выбираем цвет из массива
      const colorIndex = Math.floor(Math.random() * starColors.length);
      const color = starColors[colorIndex];
      
      // Делаем более прозрачными, они фоновые, но краевые немного ярче
      const alpha = Math.random() * 0.4 + 0.3;
      
      // Добавляем случайные данные о звезде примерно для 20% звезд
      const hasInfo = Math.random() < 0.2;
      const starInfo = hasInfo ? getRandomStarData() : null;
      
      stars.push({
        x: boundedX,
        y: boundedY,
        radius: radius,
        color: `rgba(${color}, ${alpha})`,
        info: starInfo,
        hasInfo: hasInfo
      });
    }
    
    // Создаем звезды специально для углов экрана
    // Определим четыре угла
    const margin = 10; // Отступ от краев экрана для звезд
    const corners = [
      { x: margin, y: margin },                // верхний левый
      { x: width - margin, y: margin },        // верхний правый
      { x: margin, y: height - margin },       // нижний левый
      { x: width - margin, y: height - margin } // нижний правый
    ];
    
    // Распределяем звезды по углам равномерно
    for (let i = 0; i < cornerStarsCount; i++) {
      // Выбираем угол (циклически)
      const cornerIndex = i % 4;
      const corner = corners[cornerIndex];
      
      // Случайное смещение от угла (в пределах 20% от размера экрана)
      const maxOffset = Math.min(width, height) * 0.2;
      let offsetX, offsetY;
      
      // Смещаем координаты в зависимости от угла
      switch (cornerIndex) {
        case 0: // верхний левый - вправо и вниз
          offsetX = Math.random() * maxOffset;
          offsetY = Math.random() * maxOffset;
          break;
        case 1: // верхний правый - влево и вниз
          offsetX = -Math.random() * maxOffset;
          offsetY = Math.random() * maxOffset;
          break;
        case 2: // нижний левый - вправо и вверх
          offsetX = Math.random() * maxOffset;
          offsetY = -Math.random() * maxOffset;
          break;
        case 3: // нижний правый - влево и вверх
          offsetX = -Math.random() * maxOffset;
          offsetY = -Math.random() * maxOffset;
          break;
      }
      
      // Вычисляем финальные координаты
      const x = corner.x + offsetX;
      const y = corner.y + offsetY;
      
      // Случайный размер - для угловых звезд делаем немного больше
      const radius = Math.random() * 1.0 + 0.4;
      
      // Случайно выбираем цвет из массива, предпочитая более яркие цвета для углов
      const colorIndex = Math.floor(Math.random() * starColors.length);
      const color = starColors[colorIndex];
      
      // Угловые звезды делаем более яркими
      const alpha = Math.random() * 0.5 + 0.4;
      
      // Добавляем случайные данные о звезде примерно для 40% звезд
      const hasInfo = Math.random() < 0.4;
      const starInfo = hasInfo ? getRandomStarData() : null;
      
      stars.push({
        x: x,
        y: y,
        radius: radius,
        color: `rgba(${color}, ${alpha})`,
        info: starInfo,
        hasInfo: hasInfo
      });
    }
    
    return stars;
  };

  // Функция для создания звезд с 3D координатами
  const createStars = (width, height, count) => {
    const stars = [];
    
    // Коэффициент расширения за пределы экрана
    const expansionFactor = 2.0; // Увеличиваем область
    const expandedWidth = width * expansionFactor;
    const expandedHeight = height * expansionFactor;
    
    // Определяем цвета звезд (неяркие оттенки)
    const starColors = [
      '255, 255, 255',  // белый
      '255, 180, 120',  // оранжевый (приглушенный)
      '180, 140, 220',  // фиолетовый (приглушенный)
      '140, 170, 255'   // синий (приглушенный)
    ];
    
    // Создаем звезды с равномерным распределением по z-координате
    for (let i = 0; i < count; i++) {
      // Распределяем Z равномерно по всему диапазону для первоначального заполнения
      const z = 1 + Math.random() * 1000;
      
      // Используем 3D координаты с более широким распределением
      const x = (Math.random() * expandedWidth) - (expandedWidth / 2);
      const y = (Math.random() * expandedHeight) - (expandedHeight / 2);
      
      // Случайно выбираем цвет из массива
      const colorIndex = Math.floor(Math.random() * starColors.length);
      const color = starColors[colorIndex];
      
      // Прозрачность зависит от размера звезды
      const alpha = Math.random() * 0.5 + 0.5;
      
      // Добавляем случайные данные о звезде примерно для 20% звезд
      const hasInfo = Math.random() < 0.2;
      const starInfo = hasInfo ? getRandomStarData() : null;
      
      stars.push({
        x: x,
        y: y,
        z: z,
        radius: Math.random() * 1.5 + 0.5,
        color: `rgba(${color}, ${alpha})`,
        info: starInfo,
        hasInfo: hasInfo,
        projectedX: 0, // Будем хранить спроецированные координаты для проверки наведения
        projectedY: 0,
        projectedRadius: 0
      });
    }
    
    return stars;
  };

  // Функция обработки движения мыши
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Получаем положение и размеры canvas
    const rect = canvas.getBoundingClientRect();
    
    // Вычисляем координаты мыши относительно canvas с учетом масштабирования
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    // Обновляем положение мыши для использования в анимации
    mousePositionRef.current = { x, y };
    
    // Немедленно проверяем наведение при движении мыши, но не слишком часто
    const now = performance.now();
    if (now - lastHoverCheckRef.current > 16) { // примерно 60 FPS
      checkStarHover(x, y);
    }
  };

  // Функция для проверки, находится ли курсор над звездой
  const checkStarHover = (mouseX, mouseY) => {
    // Обновляем время последней проверки
    lastHoverCheckRef.current = performance.now();
    
    // Создаем массив кандидатов для наведения (и динамических, и статичных звезд)
    const candidateStars = [];
    
    // Сначала проверяем динамические звезды (с эффектом глубины)
    starsRef.current
      .forEach(star => {
        // Проверим, находится ли звезда на экране
        if (
          star.projectedX < -10 || 
          star.projectedX > window.innerWidth + 10 || 
          star.projectedY < -10 || 
          star.projectedY > window.innerHeight + 10
        ) {
          return; // Звезда за границами экрана
        }
        
        const distance = Math.sqrt(
          Math.pow(mouseX - star.projectedX, 2) + 
          Math.pow(mouseY - star.projectedY, 2)
        );
        
        // Если у звезды нет информации, создаем стандартную информацию
        if (!star.hasInfo && !star.infoGenerated) {
          // Генерируем уникальный ID на основе координат для постоянства между наведениями
          const uniqueId = `gen_${Math.round(star.x)}_${Math.round(star.y)}_${Math.round(star.z)}`;
          
          // Извлекаем RGB компоненты из цвета
          const colorParts = star.color.substring(5, star.color.length - 1).split(',');
          const r = parseInt(colorParts[0].trim());
          const g = parseInt(colorParts[1].trim());
          const b = parseInt(colorParts[2].trim());
          
          // Определяем температуру по цвету
          let temp = '5000 K';
          let starClass = 'Неизвестный';
          let starType = '??';
          
          if (r > 200 && g > 200 && b > 200) {
            temp = '9000+ K';
            starClass = 'Бело-голубой';
            starType = 'A0';
          } else if (r > g && r > b) {
            temp = '3500 K';
            starClass = 'Красный карлик';
            starType = 'M5';
          } else if (g > r && g > b) {
            temp = '6000 K';
            starClass = 'Желтый';
            starType = 'G2';
          } else if (b > r && b > g) {
            temp = '12000 K';
            starClass = 'Голубой гигант';
            starType = 'B3';
          }
          
          // Выбираем описание на основе хеша координат для стабильности
          // Преобразуем uniqueId в число для выбора индекса описания
          const descriptionSeed = uniqueId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          
          // Добавляем логику для пасхального яйца (5% вероятность)
          let description;
          if (Math.random() < 0.05) {
            description = easterEggDescription;
          } else {
            const descriptionIndex = descriptionSeed % starDescriptionTemplates.length;
            description = starDescriptionTemplates[descriptionIndex];
          }
          
          // Создаем информацию о звезде
          star.info = {
            id: uniqueId,
            name: `Неизвестная звезда #${uniqueId.substring(4, 10)}`,
            type: starType,
            class: starClass,
            temperature: temp,
            description: description
          };
          
          star.infoGenerated = true;
        }
        
        // Рассчитываем радиус срабатывания - более либеральный радиус для удобства
        // Используем фактический радиус звезды для определения зоны наведения
        // с минимальным значением для удобства выбора
        const minClickRadius = 10; // Увеличиваем минимальный радиус для удобства клика
        const actualRadius = star.projectedRadius * 5; // Увеличиваем множитель для большей зоны наведения
        const hitRadius = Math.max(minClickRadius, actualRadius);
        
        // Добавляем небольшой гистерезис: если звезда уже выбрана, увеличиваем радиус срабатывания
        const isCurrentlyHovered = hoveredDynamicStar === star;
        const finalHitRadius = isCurrentlyHovered ? hitRadius * 1.2 : hitRadius;
        
        if (distance < finalHitRadius) {
          // Рассчитываем приоритет звезды: ближе к курсору и ближе к нам = выше приоритет
          // Дополнительный приоритет для звезд с настоящей (не сгенерированной) информацией
          const distancePriority = 1 - (distance / finalHitRadius); // 0 до 1, где 1 - курсор прямо на звезде
          const depthPriority = 1 - (star.z / 1000); // 0 до 1, где 1 - звезда ближе всего
          const infoPriority = star.hasInfo ? 0.3 : 0; // Бонус для звезд с реальной информацией
          
          // Гистерезис: дополнительный бонус для текущей наведенной звезды
          const hoverBonus = isCurrentlyHovered ? 0.4 : 0;
          
          // Комбинированный приоритет
          const priority = distancePriority * 0.6 + depthPriority * 0.2 + infoPriority + hoverBonus;
          
          candidateStars.push({
            type: 'dynamic',
            star: star,
            distance: distance,
            priority: priority
          });
        }
      });
    
    // Затем проверяем статичные фоновые звезды
    backgroundStarsRef.current
      .forEach(star => {
        const distance = Math.sqrt(
          Math.pow(mouseX - star.x, 2) + 
          Math.pow(mouseY - star.y, 2)
        );
        
        // Если у звезды нет информации, создаем стандартную информацию
        if (!star.hasInfo && !star.infoGenerated) {
          // Генерируем уникальный ID на основе координат для постоянства между наведениями
          const uniqueId = `gen_${Math.round(star.x)}_${Math.round(star.y)}`;
          
          // Извлекаем RGB компоненты из цвета
          const colorParts = star.color.substring(5, star.color.length - 1).split(',');
          const r = parseInt(colorParts[0].trim());
          const g = parseInt(colorParts[1].trim());
          const b = parseInt(colorParts[2].trim());
          
          // Определяем температуру по цвету
          let temp = '5000 K';
          let starClass = 'Неизвестный';
          let starType = '??';
          
          if (r > 200 && g > 200 && b > 200) {
            temp = '9000+ K';
            starClass = 'Бело-голубой';
            starType = 'A0';
          } else if (r > g && r > b) {
            temp = '3500 K';
            starClass = 'Красный карлик';
            starType = 'M5';
          } else if (g > r && g > b) {
            temp = '6000 K';
            starClass = 'Желтый';
            starType = 'G2';
          } else if (b > r && b > g) {
            temp = '12000 K';
            starClass = 'Голубой гигант';
            starType = 'B3';
          }
          
          // Выбираем описание на основе хеша координат для стабильности
          // Преобразуем uniqueId в число для выбора индекса описания
          const descriptionSeed = uniqueId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          
          // Добавляем логику для пасхального яйца (5% вероятность)
          let description;
          if (Math.random() < 0.05) {
            description = easterEggDescription;
          } else {
            const descriptionIndex = descriptionSeed % starDescriptionTemplates.length;
            description = starDescriptionTemplates[descriptionIndex];
          }
          
          // Создаем информацию о звезде
          star.info = {
            id: uniqueId,
            name: `Неизвестная звезда #${uniqueId.substring(4, 10)}`,
            type: starType,
            class: starClass,
            temperature: temp,
            description: description
          };
          
          star.infoGenerated = true;
        }
        
        // Для фоновых звезд более либеральный радиус срабатывания
        const minClickRadius = 10; // Увеличиваем минимальный радиус
        const actualRadius = star.radius * 6; // Увеличиваем множитель
        const hitRadius = Math.max(minClickRadius, actualRadius);
        
        // Добавляем гистерезис: если звезда уже выбрана, увеличиваем радиус срабатывания
        const isCurrentlyHovered = hoveredStaticStar === star;
        const finalHitRadius = isCurrentlyHovered ? hitRadius * 1.2 : hitRadius;
        
        if (distance < finalHitRadius) {
          // Приоритет только на основе расстояния (они все на одной "глубине")
          // Дополнительный приоритет для звезд с настоящей (не сгенерированной) информацией
          const distancePriority = 1 - (distance / finalHitRadius);
          const infoPriority = star.hasInfo ? 0.3 : 0;
          
          // Гистерезис: дополнительный бонус для текущей наведенной звезды
          const hoverBonus = isCurrentlyHovered ? 0.4 : 0;
          
          const priority = distancePriority * 0.7 + infoPriority + hoverBonus;
          
          candidateStars.push({
            type: 'static',
            star: star,
            distance: distance,
            priority: priority
          });
        }
      });
    
    // Если есть кандидаты, выбираем звезду с наивысшим приоритетом
    if (candidateStars.length > 0) {
      // Сортируем по приоритету (от высшего к низшему)
      candidateStars.sort((a, b) => b.priority - a.priority);
      
      const bestCandidate = candidateStars[0];
      
      if (bestCandidate.type === 'dynamic') {
        setHoveredStar(bestCandidate.star.info);
        setHoveredDynamicStar(bestCandidate.star);
        setHoveredStaticStar(null);
      } else {
        setHoveredStar(bestCandidate.star.info);
        setHoveredStaticStar(bestCandidate.star);
        setHoveredDynamicStar(null);
      }
      
      setTooltipPosition({ x: mouseX, y: mouseY });
      
      // Изменяем стиль курсора на canvas при наведении на звезду
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'pointer';
      }
      
      return true;
    }
    
    // Если курсор не над звездой, сбрасываем состояние
    setHoveredStar(null);
    setHoveredStaticStar(null);
    setHoveredDynamicStar(null);
    
    // Возвращаем обычный курсор
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'default';
    }
    
    return false;
  };

  // Функция для рисования статичных фоновых звезд
  const drawBackgroundStars = (ctx, width, height, stars) => {
    // Обновляем эффект пульсации
    pulseEffectRef.current = Math.sin(performance.now() * 0.003) * 0.5 + 0.5; // 0 до 1
    
    // Рисуем каждую фоновую звезду
    stars.forEach(star => {
      ctx.beginPath();
      
      // Если у звезды есть информация или это звезда под курсором, рисуем её крупнее
      const isHovered = hoveredStaticStar === star;
      
      // Добавляем эффект пульсации для звезд с информацией
      const pulseMultiplier = star.hasInfo ? 
                             (0.2 * pulseEffectRef.current + 0.8) : 1.0; // Пульсация 0.8-1.0 для звезд с инфо
      
      // Увеличиваем размер звезды при наведении или если у нее есть информация
      const radius = isHovered ? star.radius * 3.0 : 
                     star.hasInfo ? star.radius * 1.5 * pulseMultiplier : star.radius;
      
      ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
      
      // Для звезды под курсором используем яркий цвет
      if (isHovered) {
        const colorParts = star.color.substring(5, star.color.length - 1).split(',');
        const r = colorParts[0].trim();
        const g = colorParts[1].trim();
        const b = colorParts[2].trim();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1.0)`;
      } else {
        // Для звезд с информацией делаем более яркими в зависимости от пульсации
        if (star.hasInfo) {
          const colorParts = star.color.substring(5, star.color.length - 1).split(',');
          const r = colorParts[0].trim();
          const g = colorParts[1].trim();
          const b = colorParts[2].trim();
          const alpha = parseFloat(colorParts[3].trim()) * (pulseMultiplier * 0.5 + 0.7); // 0.7-1.2 от исходной прозрачности
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else {
          ctx.fillStyle = star.color;
        }
      }
      
      // Для звезд с информацией добавляем свечение
      if (star.hasInfo || isHovered) {
        const colorParts = star.color.substring(5, star.color.length - 1).split(',');
        const r = colorParts[0].trim();
        const g = colorParts[1].trim();
        const b = colorParts[2].trim();
        
        // Для звезды под курсором свечение ярче и больше
        const alpha = isHovered ? 0.9 : 0.5 + 0.3 * pulseEffectRef.current; // Пульсация 0.5-0.8 для свечения
        const glowRadius = isHovered ? radius * 6 : radius * (3 + pulseEffectRef.current * 1.5); // Пульсация 3-4.5
        
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, glowRadius
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
      }
      
      ctx.fill();
    });
  };

  // Функция для рисования звезд с учетом 3D перспективы
  const drawStars = (ctx, width, height, stars) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Очищаем холст тускло-фиолетовым цветом вместо чёрного
    ctx.fillStyle = '#0a0114';
    ctx.fillRect(0, 0, width, height);
    
    // Сначала рисуем фоновые звезды
    drawBackgroundStars(ctx, width, height, backgroundStarsRef.current);
    
    // Рисуем каждую звезду с учетом глубины
    stars.forEach(star => {
      // Игнорируем звезды позади нас
      if (star.z <= 0) return;
      
      // Вычисляем масштаб для создания эффекта перспективы
      const scale = 200 / star.z;
      
      // Проецируем 3D координаты на 2D холст
      const projectedX = centerX + star.x * scale;
      const projectedY = centerY + star.y * scale;
      
      // Размер звезды зависит от глубины
      const projectedRadius = Math.max(0.1, star.radius * scale);
      
      // Сохраняем спроецированные координаты для проверки наведения мыши
      star.projectedX = projectedX;
      star.projectedY = projectedY;
      star.projectedRadius = projectedRadius;
      
      // Только если звезда находится в пределах холста
      if (
        projectedX > -50 && 
        projectedX < width + 50 && 
        projectedY > -50 && 
        projectedY < height + 50
      ) {
        // Яркость звезды зависит от ее глубины
        const alpha = Math.min(1, 200 / star.z);
        
        // Проверяем, является ли звезда текущей под курсором
        const isHovered = hoveredDynamicStar === star;
        
        // Добавляем эффект пульсации для интерактивных звезд
        const pulseMultiplier = star.hasInfo ? 
                                (0.2 * pulseEffectRef.current + 0.8) : 1.0; // Пульсация 0.8-1.0
        
        // Нарисуем звезду
        ctx.beginPath();
        
        // Увеличиваем размер для звезды под курсором или с информацией
        const finalRadius = isHovered ? projectedRadius * 2.5 : 
                           star.hasInfo ? projectedRadius * (1.2 * pulseMultiplier) : 
                           projectedRadius;
        
        ctx.arc(projectedX, projectedY, finalRadius, 0, Math.PI * 2);
        
        // Для звезды под курсором используем яркий цвет
        if (isHovered) {
          const colorParts = star.color.substring(5, star.color.length - 1).split(',');
          const r = colorParts[0].trim();
          const g = colorParts[1].trim();
          const b = colorParts[2].trim();
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1.0)`;
        } else if (star.hasInfo) {
          // Для звезд с информацией делаем более яркими в зависимости от пульсации
          const colorParts = star.color.substring(5, star.color.length - 1).split(',');
          const r = colorParts[0].trim();
          const g = colorParts[1].trim();
          const b = colorParts[2].trim();
          const starAlpha = alpha * (pulseMultiplier * 0.3 + 0.8); // 0.8-1.1 от исходной прозрачности
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${starAlpha})`;
        } else {
          // Используем цвет звезды (сохраняя прозрачность)
          ctx.fillStyle = star.color;
        }
        
        // Создаем легкое свечение для крупных звезд или звезд с информацией
        if (projectedRadius > 1 || star.hasInfo || isHovered) {
          // Извлекаем RGB компоненты из цвета звезды
          const colorParts = star.color.substring(5, star.color.length - 1).split(',');
          const r = colorParts[0].trim();
          const g = colorParts[1].trim();
          const b = colorParts[2].trim();
          
          // Если у звезды есть информация или это звезда под курсором, делаем свечение ярче
          const glowRadius = isHovered ? finalRadius * 8 : 
                            star.hasInfo ? finalRadius * (4 + pulseEffectRef.current * 2) : // 4-6
                            finalRadius * 2;
          
          const gradient = ctx.createRadialGradient(
            projectedX, projectedY, 0,
            projectedX, projectedY, glowRadius
          );
          
          // Для звезды под курсором более яркое свечение
          const baseAlpha = isHovered ? Math.min(1, alpha * 1.5) : alpha;
          const glowAlpha = star.hasInfo && !isHovered ? 
                            baseAlpha * (0.8 + pulseEffectRef.current * 0.4) : // 0.8-1.2
                            baseAlpha;
          
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${glowAlpha})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = gradient;
        }
        
        ctx.fill();
      }
    });
    
    // Проверяем наведение курсора каждый кадр
    if (mousePositionRef.current.x > 0) {
      checkStarHover(mousePositionRef.current.x, mousePositionRef.current.y);
    }
  };

  // Функция для анимации звезд с эффектом движения вперед/назад
  const animateStars = (ctx, width, height) => {
    // Убедимся, что у нас есть звезды
    if (starsRef.current.length === 0) {
      starsRef.current = createStars(width, height, 1000); // Увеличиваем количество звезд
    }
    
    // Обновляем текущую скорость с учетом инерции (плавно)
    const targetSpeed = isMovingRef.current * maxSpeedRef.current;
    
    // Расчет инерции в зависимости от направления
    let inertiaValue = inertiaFactor.current;
    
    // При торможении инерция медленнее (плавное торможение)
    if ((targetSpeed === 0 && currentSpeedRef.current !== 0) ||
        (Math.sign(targetSpeed) !== Math.sign(currentSpeedRef.current))) {
      inertiaValue = inertiaFactor.current * 0.5; // более плавное торможение
    }
    
    // Обновляем скорость с инерцией
    currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * inertiaValue;
    
    // Если скорость очень маленькая и целевая скорость 0, то останавливаем полностью
    if (Math.abs(currentSpeedRef.current) < 0.001 && targetSpeed === 0) {
      currentSpeedRef.current = 0;
    }
    
    // Двигаем звезды только если есть скорость
    if (Math.abs(currentSpeedRef.current) > 0.001) {
      const expansionFactor = 2.0; // Тот же коэффициент, что и в createStars
      const expandedWidth = width * expansionFactor;
      const expandedHeight = height * expansionFactor;
      
      starsRef.current.forEach(star => {
        // Изменяем глубину в зависимости от текущей скорости с инерцией
        star.z -= currentSpeedRef.current;
        
        // Если звезда вышла за пределы по глубине, пересоздаем её в новой позиции
        if (star.z <= 0 || star.z > 1000) {
          // При движении вперед (звезды выходят за z=0) создаем новые звезды далеко впереди
          if (currentSpeedRef.current > 0) {
            // Равномерное распределение по Z в дальней области
            star.z = 800 + Math.random() * 200; // Создаем звезды в диапазоне 800-1000
            
            // Распределяем их по всей ширине и высоте
            star.x = (Math.random() * expandedWidth) - (expandedWidth / 2);
            star.y = (Math.random() * expandedHeight) - (expandedHeight / 2);
          } 
          // При движении назад (звезды выходят за z=1000) создаем новые звезды близко
          else {
            // Равномерное распределение по Z в ближней области
            star.z = 1 + Math.random() * 200; // Создаем звезды в диапазоне 1-201
            
            // Распределяем их по всей ширине и высоте
            star.x = (Math.random() * expandedWidth) - (expandedWidth / 2);
            star.y = (Math.random() * expandedHeight) - (expandedHeight / 2);
          }
          
          // Случайно меняем цвет при пересоздании для большего разнообразия
          const starColors = [
            '255, 255, 255',  // белый
            '255, 180, 120',  // оранжевый (приглушенный)
            '180, 140, 220',  // фиолетовый (приглушенный)
            '140, 170, 255'   // синий (приглушенный)
          ];
          
          const colorIndex = Math.floor(Math.random() * starColors.length);
          const color = starColors[colorIndex];
          const alpha = Math.random() * 0.5 + 0.5;
          
          star.color = `rgba(${color}, ${alpha})`;
          star.radius = Math.random() * 1.5 + 0.5;
        }
      });
    }
    
    // Обновляем отображаемые значения скорости раз в 10 кадров для производительности
    if (Math.floor(performance.now() / 100) % 2 === 0) {
      setDisplaySpeed(Math.abs(currentSpeedRef.current));
      setDisplayMaxSpeed(maxSpeedRef.current);
      
      // Устанавливаем отображаемое направление
      let directionText = 'Stopped';
      if (isMovingRef.current > 0) {
        directionText = 'Forward';
      } else if (isMovingRef.current < 0) {
        directionText = 'Backward';
      }
      setDisplayDirection(directionText);
    }
    
    // Рисуем обновленные звезды
    drawStars(ctx, width, height, starsRef.current);
    
    // Продолжаем анимацию
    animationRef.current = requestAnimationFrame(() => 
      animateStars(ctx, width, height)
    );
  };

  // Функция обработки движения мыши
  const handleMouseLeave = () => {
    setHoveredStar(null);
    setHoveredStaticStar(null);
    setHoveredDynamicStar(null);
  };

  // Инициализация аудио
  const initAudio = () => {
    // Создаем аудио объекты только на клиенте
    if (typeof window === 'undefined') return;
    
    // Звук полёта (зацикленный)
    engineSoundRef.current = new Audio('/assets/sounds/Flight.mp3');
    engineSoundRef.current.loop = true;
    engineSoundRef.current.volume = 0.5;
    
    // Звук взлёта (одноразовый)
    startSoundRef.current = new Audio('/assets/sounds/Take-off.mp3');
    startSoundRef.current.volume = 0.7;
    
    // Звук торможения (одноразовый)
    brakeSoundRef.current = new Audio('/assets/sounds/Shutdown.mp3');
    brakeSoundRef.current.volume = 0.7;
    
    // Предзагрузка звуков
    engineSoundRef.current.load();
    startSoundRef.current.load();
    brakeSoundRef.current.load();
  };

  // Функции для обработки клавиш
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      if (isMovingRef.current !== 1) { // Проверяем, что не было движения вперёд
        isMovingRef.current = 1; // вперёд
        
        // Воспроизводим звук запуска при нажатии
        startSoundRef.current.currentTime = 0;
        startSoundRef.current.play().catch(e => console.log('Audio play error:', e));
        
        // Запускаем звук двигателя с задержкой
        if (engineSoundRef.current) {
          // Остановим звук сначала, чтобы убедиться, что он не играет
          engineSoundRef.current.pause();
          engineSoundRef.current.currentTime = 0;
          
          // Запуск звука двигателя через 3 секунды
          setTimeout(() => {
            if (isMovingRef.current !== 0) { // Проверяем, что корабль всё ещё в движении
              engineSoundRef.current.play().catch(e => console.log('Audio play error:', e));
              soundStateRef.current.enginePlaying = true;
            }
          }, 3000);
        }
      }
    } else if (e.key === 'ArrowDown') {
      if (isMovingRef.current !== -1) { // Проверяем, что не было движения назад
        isMovingRef.current = -1; // назад
        
        // Воспроизводим звук запуска при нажатии
        startSoundRef.current.currentTime = 0;
        startSoundRef.current.play().catch(e => console.log('Audio play error:', e));
        
        // Запускаем звук двигателя с задержкой
        if (engineSoundRef.current) {
          // Остановим звук сначала, чтобы убедиться, что он не играет
          engineSoundRef.current.pause();
          engineSoundRef.current.currentTime = 0;
          
          // Запуск звука двигателя через 3 секунды
          setTimeout(() => {
            if (isMovingRef.current !== 0) { // Проверяем, что корабль всё ещё в движении
              engineSoundRef.current.play().catch(e => console.log('Audio play error:', e));
              soundStateRef.current.enginePlaying = true;
            }
          }, 3000);
        }
      }
    } else if (e.key === 'ArrowRight') {
      // Увеличение скорости
      const newSpeed = Math.min(5, maxSpeedRef.current + 0.1);
      maxSpeedRef.current = newSpeed;
      setDisplayMaxSpeed(newSpeed);
    } else if (e.key === 'ArrowLeft') {
      // Уменьшение скорости
      const newSpeed = Math.max(0.1, maxSpeedRef.current - 0.1);
      maxSpeedRef.current = newSpeed;
      setDisplayMaxSpeed(newSpeed);
    }
  };
  
  const handleKeyUp = (e) => {
    if ((e.key === 'ArrowUp' && isMovingRef.current === 1) || 
        (e.key === 'ArrowDown' && isMovingRef.current === -1)) {
      // Устанавливаем состояние остановки
      isMovingRef.current = 0;
      
      // Останавливаем звук двигателя
      if (engineSoundRef.current && soundStateRef.current.enginePlaying) {
        engineSoundRef.current.pause();
        engineSoundRef.current.currentTime = 0;
        soundStateRef.current.enginePlaying = false;
      }
      
      // Воспроизводим звук торможения сразу при отпускании клавиши
      if (brakeSoundRef.current) {
        brakeSoundRef.current.currentTime = 0;
        brakeSoundRef.current.play().catch(e => console.log('Audio play error:', e));
      }
    }
  };

  // Инициализация Canvas и аудио после рендеринга компонента
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Инициализируем аудио
    initAudio();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Получаем контекст рисования
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Добавляем обработчики событий мыши
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // Функция для настройки размера canvas
    const handleResize = () => {
      // Устанавливаем размер canvas равным размеру окна
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Создаем статичные фоновые звезды
      backgroundStarsRef.current = createBackgroundStars(canvas.width, canvas.height, 130);
      
      // Сбрасываем движущиеся звезды при изменении размера окна
      starsRef.current = createStars(canvas.width, canvas.height, 1000);
    };
    
    // Настраиваем canvas и начинаем анимацию
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Запускаем анимацию
    animateStars(ctx, canvas.width, canvas.height);
    
    // Очистка при размонтировании компонента
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      
      // Остановка всех звуков при размонтировании
      if (engineSoundRef.current) {
        engineSoundRef.current.pause();
        engineSoundRef.current.currentTime = 0;
      }
      
      if (startSoundRef.current) {
        startSoundRef.current.pause();
        startSoundRef.current.currentTime = 0;
      }
      
      if (brakeSoundRef.current) {
        brakeSoundRef.current.pause();
        brakeSoundRef.current.currentTime = 0;
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} />
      <SpaceHUD
        speed={displaySpeed}
        maxSpeed={displayMaxSpeed}
        direction={displayDirection}
      />
      {hoveredStar && (
        <StarTooltip 
          starData={hoveredStar}
          position={tooltipPosition}
        />
      )}
    </>
  );
};

export default SimpleSpace; 