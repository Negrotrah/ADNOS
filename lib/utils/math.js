/**
 * Утилиты для математических операций, часто используемые в графике и анимации
 */

// Конвертирует градусы в радианы
export const degToRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

// Конвертирует радианы в градусы
export const radToDeg = (radians) => {
  return radians * (180 / Math.PI);
};

// Линейная интерполяция между двумя значениями
export const lerp = (a, b, t) => {
  return a + (b - a) * t;
};

// Нормализует значение в диапазоне
export const normalize = (val, min, max) => {
  return (val - min) / (max - min);
};

// Ограничивает значение в определенном диапазоне
export const clamp = (val, min, max) => {
  return Math.min(Math.max(val, min), max);
};

// Случайное значение в диапазоне
export const random = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Случайное целое число в диапазоне
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Расстояние между двумя точками
export const distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// Генерирует случайный цвет в формате Hex
export const randomColor = () => {
  return Math.floor(Math.random() * 0xFFFFFF);
};

// Возвращает значение с шумом Перлина (эмуляция простого шума)
export const perlinNoise = (x, y = 0) => {
  // Очень упрощенная версия
  return Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.5 + 0.5;
}; 