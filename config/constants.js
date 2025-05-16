// Общие настройки приложения
export const APP_CONFIG = {
  NAME: 'Adnos',
  VERSION: '0.1.0',
};

// Настройки космической сцены
export const SPACE_CONFIG = {
  STAR_COUNT: {
    BACKGROUND: 300,
    FOREGROUND: 50
  },
  STAR_COLORS: [
    0xFFFFFF, // Белый
    0xFFEECC, // Желтоватый
    0xCCEEFF, // Голубоватый
    0xFFCCEE  // Розоватый
  ],
  NEBULA_COLORS: [
    0x3366aa, // Голубая
    0x6633aa, // Фиолетовая
    0xaa3366, // Розовая
    0x33aa66, // Зеленая
    0x663322  // Коричневая
  ],
  NEBULA_COUNT: {
    MIN: 3,
    MAX: 5
  }
};

// Настройки космического корабля
export const SHIP_CONFIG = {
  // Секции корабля
  SECTIONS: {
    BRIDGE: 'bridge',
    ENGINE_ROOM: 'engine',
    QUARTERS: 'quarters',
    CARGO: 'cargo',
  },
  
  // Цвета для различных элементов корабля
  COLORS: {
    HULL: 0x333355,
    CABIN: 0x6666AA,
    ENGINE: 0x444466,
    ENGINE_GLOW: 0x3399FF,
  },
};

// Анимационные настройки
export const ANIMATION_CONFIG = {
  TRANSITION_DURATION: 1.5,
  ENGINE_PULSE_SPEED: 0.5,
  STAR_TWINKLE_SPEED: {
    MIN: 0.001,
    MAX: 0.005
  },
  NEBULA_ROTATION: {
    MIN: -0.1,
    MAX: 0.1
  },
  NEBULA_PULSE_DURATION: {
    MIN: 20,
    MAX: 40
  }
};

// Настройки рендеринга - избегаем прямого доступа к window
export const RENDER_CONFIG = {
  BACKGROUND_COLOR: 0x000511,
  ANTIALIAS: true,
  RESOLUTION: 1, // Фиксированное значение вместо window.devicePixelRatio
};

// Время загрузки (в мс)
export const LOADING_TIME = 1500; 