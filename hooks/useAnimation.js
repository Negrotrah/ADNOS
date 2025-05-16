'use client';

import { useEffect, useRef } from 'react';
import { animator } from '@lib/animation/animator';

/**
 * Хук для управления анимацией GSAP в React компонентах
 * @param {Object} animationConfig - Конфигурация анимации
 * @param {Object} dependencies - Зависимости, при изменении которых нужно пересоздать анимацию
 */
export const useAnimation = (animationConfig, dependencies = []) => {
  const animationRef = useRef(null);
  
  useEffect(() => {
    // Очистка предыдущей анимации
    if (animationRef.current) {
      animator.stop(animationRef.current);
    }
    
    // Если нет конфигурации, не создаем анимацию
    if (!animationConfig || !animationConfig.target) {
      return;
    }
    
    // Создаем новую анимацию
    const { target, props, key, type = 'default' } = animationConfig;
    
    // Выбор типа анимации
    switch (type) {
      case 'pulse':
        animationRef.current = animator.pulse(target, props, key || 'animation');
        break;
      case 'float':
        animationRef.current = animator.float(target, props, key || 'animation');
        break;
      default:
        animationRef.current = animator.animate(target, props, key || 'animation');
    }
    
    // Очистка при размонтировании
    return () => {
      if (animationRef.current) {
        animator.stop(animationRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationConfig, dependencies]);
  
  // Возвращаем функции для управления анимацией
  return {
    stop: () => {
      if (animationRef.current) {
        animator.stop(animationRef.current);
      }
    },
    restart: () => {
      if (!animationConfig || !animationConfig.target) {
        return;
      }
      
      // Останавливаем текущую анимацию
      if (animationRef.current) {
        animator.stop(animationRef.current);
      }
      
      // Создаем новую
      const { target, props, key, type = 'default' } = animationConfig;
      
      switch (type) {
        case 'pulse':
          animationRef.current = animator.pulse(target, props, key || 'animation');
          break;
        case 'float':
          animationRef.current = animator.float(target, props, key || 'animation');
          break;
        default:
          animationRef.current = animator.animate(target, props, key || 'animation');
      }
    }
  };
};

export default useAnimation; 