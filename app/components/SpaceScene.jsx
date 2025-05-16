'use client';

import { useEffect, useState, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import usePixi from '@hooks/usePixi';
import { gsap } from 'gsap';
import { random, randomInt, randomColor } from '@lib/utils/math';
import { createParticleManager } from '@lib/particles/particleManager';
import { STAR_FIELD } from '@lib/particles/presets';
import { SPACE_CONFIG, RENDER_CONFIG, ANIMATION_CONFIG } from '@config/constants';
import styles from './SpaceScene.module.css';

const SpaceScene = () => {
  const { app, containerRef } = usePixi({
    backgroundColor: RENDER_CONFIG.BACKGROUND_COLOR,
  });
  
  const [isLoaded, setIsLoaded] = useState(false);
  // Создание звезды с разными свойствами
  const createStar = useCallback((app, layer, options = {}) => {
    const {
      scale = random(0.5, 2),
      alpha = random(0.5, 1),
      speed = random(0.05, 0.2),
      color = 0xFFFFFF,
      twinkle = true
    } = options;
    
    const star = new PIXI.Graphics();
    star.beginFill(color);
    star.drawCircle(0, 0, 1);
    star.endFill();
    star.x = random(0, app.screen.width);
    star.y = random(0, app.screen.height);
    star.alpha = alpha;
    star.scale.set(scale);
    
    // Добавляем пользовательские свойства
    star.speed = speed;
    star.twinkle = twinkle;
    star.baseAlpha = alpha;
    star.twinkleSpeed = random(
      ANIMATION_CONFIG.STAR_TWINKLE_SPEED.MIN, 
      ANIMATION_CONFIG.STAR_TWINKLE_SPEED.MAX
    );
    
    layer.addChild(star);
    
    return star;
  }, []);
  
  // Создание туманности
  const createNebula = useCallback((app, layer, options = {}) => {
    const {
      x = app.screen.width / 2,
      y = app.screen.height / 2,
      radius = random(100, 200),
      color = randomColor(),
      alpha = random(0.05, 0.15)
    } = options;
    
    // Создаем градиентную туманность
    const nebula = new PIXI.Graphics();
    nebula.position.set(x, y);
    
    // Градиент от центра к краям
    const gradientSteps = 10;
    for (let i = 0; i < gradientSteps; i++) {
      const ratio = i / gradientSteps;
      const currRadius = radius * (1 - ratio);
      const currAlpha = alpha * (1 - ratio);
      
      nebula.beginFill(color, currAlpha);
      nebula.drawCircle(0, 0, currRadius);
      nebula.endFill();
    }
    
    layer.addChild(nebula);
    
    // Анимация медленного вращения и пульсации
    gsap.to(nebula, {
      rotation: random(
        ANIMATION_CONFIG.NEBULA_ROTATION.MIN, 
        ANIMATION_CONFIG.NEBULA_ROTATION.MAX
      ),
      alpha: alpha * random(0.8, 1.2),
      duration: random(
        ANIMATION_CONFIG.NEBULA_PULSE_DURATION.MIN, 
        ANIMATION_CONFIG.NEBULA_PULSE_DURATION.MAX
      ),
      yoyo: true,
      repeat: -1
    });
    
    return nebula;
  }, []);
  
  // Инициализация космической сцены
  useEffect(() => {
    if (!app) return;
    
    // Создаем слои для разделения объектов
    const backgroundLayer = new PIXI.Container(); // Самый дальний слой (звездный фон)
    const nebulaLayer = new PIXI.Container();     // Средний слой (туманности)
    const foregroundLayer = new PIXI.Container(); // Ближний слой (яркие звезды, движущиеся объекты)
    
    app.stage.addChild(backgroundLayer);
    app.stage.addChild(nebulaLayer);
    app.stage.addChild(foregroundLayer);
    
    // Создаем туманности
    const nebulasCount = randomInt(
      SPACE_CONFIG.NEBULA_COUNT.MIN, 
      SPACE_CONFIG.NEBULA_COUNT.MAX
    );
    const nebulas = [];
    
    for (let i = 0; i < nebulasCount; i++) {
      const nebulaColor = SPACE_CONFIG.NEBULA_COLORS[randomInt(0, SPACE_CONFIG.NEBULA_COLORS.length - 1)];
      
      const nebula = createNebula(app, nebulaLayer, {
        x: random(0, app.screen.width),
        y: random(0, app.screen.height),
        radius: random(150, 300),
        color: nebulaColor,
        alpha: random(0.05, 0.15)
      });
      
      nebulas.push(nebula);
    }
    
    // Создаем отдаленные звезды (фоновый слой)
    const backgroundStars = [];
    const bgStarCount = SPACE_CONFIG.STAR_COUNT.BACKGROUND;
    
    for (let i = 0; i < bgStarCount; i++) {
      const star = createStar(app, backgroundLayer, {
        scale: random(0.2, 1),
        alpha: random(0.3, 0.7),
        speed: random(0.02, 0.08),
        twinkle: i % 3 === 0 // Только треть звезд мерцает
      });
      
      backgroundStars.push(star);
    }
    
    // Создаем ближние яркие звезды (передний план)
    const foregroundStars = [];
    const fgStarCount = SPACE_CONFIG.STAR_COUNT.FOREGROUND;
    
    for (let i = 0; i < fgStarCount; i++) {
      const starColor = SPACE_CONFIG.STAR_COLORS[randomInt(0, SPACE_CONFIG.STAR_COLORS.length - 1)];
      
      const star = createStar(app, foregroundLayer, {
        scale: random(1.5, 3),
        alpha: random(0.7, 1),
        speed: random(0.1, 0.3),
        color: starColor,
        twinkle: true
      });
      
      // Для ярких звезд добавляем свечение
      if (i % 5 === 0) {
        const glow = new PIXI.Graphics();
        glow.beginFill(starColor, 0.1);
        glow.drawCircle(0, 0, random(3, 6));
        glow.endFill();
        star.addChild(glow);
        
        // Анимация свечения
        gsap.to(glow, {
          alpha: 0.3,
          scale: random(1.5, 2),
          duration: random(1, 2),
          repeat: -1,
          yoyo: true
        });
      }
      
      foregroundStars.push(star);
    }
    
    // Создаем звездную пыль с помощью системы частиц
    const manager = createParticleManager(app);
    
    // Настройка для звездной пыли
    const dustConfig = {
      ...STAR_FIELD,
      settings: {
        ...STAR_FIELD.settings,
        alpha: {
          start: 0.3,
          end: 0
        },
        scale: {
          start: 0.1,
          end: 0.05
        },
        speed: {
          start: 20,
          end: 10
        },
        lifetime: {
          min: 5,
          max: 10
        },
        frequency: 0.2,
        maxParticles: 100
      }
    };
    
    // Создаем систему частиц
    manager.createParticleSystem('stardust', dustConfig);
    
    // Анимация звезд
    app.ticker.add((delta) => {
      // Анимация фоновых звезд
      backgroundStars.forEach(star => {
        if (star.twinkle) {
          // Мерцание
          star.alpha = star.baseAlpha + Math.sin(Date.now() * star.twinkleSpeed) * 0.3;
        }
        
        // Очень медленное движение
        star.y += star.speed * delta * 0.1;
        
        // Сброс позиции при выходе за границы
        if (star.y > app.screen.height) {
          star.y = 0;
          star.x = random(0, app.screen.width);
        }
      });
      
      // Анимация звезд переднего плана
      foregroundStars.forEach(star => {
        // Более заметное мерцание
        if (star.twinkle) {
          star.alpha = star.baseAlpha + Math.sin(Date.now() * star.twinkleSpeed) * 0.4;
        }
        
        // Более быстрое движение для эффекта параллакса
        star.y += star.speed * delta * 0.2;
        
        // Сброс позиции
        if (star.y > app.screen.height) {
          star.y = 0;
          star.x = random(0, app.screen.width);
        }
      });
    });
    
    setIsLoaded(true);
    
    return () => {
      // Очистка ресурсов
      app.ticker.remove();
      
      // Удаление систем частиц
      if (manager) {
        manager.destroyAllParticleSystems();
      }
      
      // Удаление слоев
      backgroundLayer.destroy({ children: true });
      nebulaLayer.destroy({ children: true });
      foregroundLayer.destroy({ children: true });
    };
  }, [app, createStar, createNebula]);
  
  return (
    <div className={styles.container}>
      <div className={styles.pixiContainer} ref={containerRef}></div>
      {!isLoaded && <div className={styles.loader}>Загрузка космического пространства...</div>}
    </div>
  );
};

export default SpaceScene; 