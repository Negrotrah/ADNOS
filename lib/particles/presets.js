/**
 * Предустановленные конфигурации для систем частиц
 */

// Эффект двигателя космического корабля
export const ENGINE_EXHAUST = {
  texture: 'engine_particle',
  settings: {
    alpha: {
      start: 0.8,
      end: 0
    },
    scale: {
      start: 0.2,
      end: 0.1,
      minimumScaleMultiplier: 1
    },
    color: {
      start: "#3498db",
      end: "#1a5276"
    },
    speed: {
      start: 200,
      end: 100,
      minimumSpeedMultiplier: 1
    },
    acceleration: {
      x: 0,
      y: 0
    },
    maxSpeed: 0,
    startRotation: {
      min: 265,
      max: 275
    },
    noRotation: false,
    rotationSpeed: {
      min: 0,
      max: 0
    },
    lifetime: {
      min: 0.2,
      max: 0.8
    },
    blendMode: "add",
    frequency: 0.005,
    emitterLifetime: -1,
    maxParticles: 200,
    pos: {
      x: 0,
      y: 0
    },
    addAtBack: false,
    spawnType: "circle",
    spawnCircle: {
      x: 0,
      y: 0,
      r: 5
    }
  }
};

// Эффект звездного поля (для варп-ускорения)
export const STAR_FIELD = {
  texture: 'star_particle',
  settings: {
    alpha: {
      start: 1,
      end: 0
    },
    scale: {
      start: 0.5,
      end: 0.1,
      minimumScaleMultiplier: 1
    },
    color: {
      start: "#ffffff",
      end: "#ffffff"
    },
    speed: {
      start: 300,
      end: 200,
      minimumSpeedMultiplier: 1
    },
    acceleration: {
      x: 0,
      y: 0
    },
    maxSpeed: 0,
    startRotation: {
      min: 0,
      max: 360
    },
    noRotation: true,
    rotationSpeed: {
      min: 0,
      max: 0
    },
    lifetime: {
      min: 1,
      max: 2
    },
    blendMode: "normal",
    frequency: 0.1,
    emitterLifetime: -1,
    maxParticles: 100,
    pos: {
      x: 0,
      y: 0
    },
    addAtBack: true,
    spawnType: "rect",
    spawnRect: {
      x: -500,
      y: -300,
      w: 1000,
      h: 600
    }
  }
};

// Эффект энергетического поля
export const ENERGY_FIELD = {
  texture: 'energy_particle',
  settings: {
    alpha: {
      start: 0.6,
      end: 0
    },
    scale: {
      start: 0.2,
      end: 0.5,
      minimumScaleMultiplier: 1
    },
    color: {
      start: "#88ff99",
      end: "#00aa33"
    },
    speed: {
      start: 50,
      end: 20,
      minimumSpeedMultiplier: 1
    },
    acceleration: {
      x: 0,
      y: 0
    },
    maxSpeed: 0,
    startRotation: {
      min: 0,
      max: 360
    },
    noRotation: false,
    rotationSpeed: {
      min: 0,
      max: 50
    },
    lifetime: {
      min: 0.5,
      max: 1.5
    },
    blendMode: "add",
    frequency: 0.02,
    emitterLifetime: -1,
    maxParticles: 100,
    pos: {
      x: 0,
      y: 0
    },
    addAtBack: false,
    spawnType: "circle",
    spawnCircle: {
      x: 0,
      y: 0,
      r: 30
    }
  }
}; 