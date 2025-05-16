'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './SpaceHUD.module.css';
import dynamic from 'next/dynamic';

// Импортируем GalaxyMap с отключенным SSR
const GalaxyMap = dynamic(() => import('./GalaxyMap'), { 
  ssr: false,
  loading: () => (
    <div className={styles.loadingMap}>
      <div className={styles.loadingText}>LOADING MAP...</div>
    </div>
  )
});

// Импортируем ShipInfoModal с отключенным SSR
const ShipInfoModal = dynamic(() => import('./ShipInfoModal'), { 
  ssr: false 
});

const SpaceHUD = ({ speed, maxSpeed, direction }) => {
  const [systemStatus, setSystemStatus] = useState('Initializing...');
  const [fuelLevel, setFuelLevel] = useState(100);
  const [shield, setShield] = useState(85);
  const [coordinates, setCoordinates] = useState({ x: 245, y: 873, z: 15042 });
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  const [depth, setDepth] = useState(0.004); // Начальная глубина
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модального окна
  const [waveTime, setWaveTime] = useState(0); // Время для анимации волны
  const [milliseconds, setMilliseconds] = useState(0); // Миллисекунды для плавной анимации стрелок
  
  // Хранение предыдущих значений координат для расчета только при движении
  const prevSpeedRef = useRef(0);
  const coordChangeTimerRef = useRef(null);
  const initialCoordinatesRef = useRef({ x: 245, y: 873 }); // Сохраняем начальные X и Y
  
  // Референс для звука клика
  const cliSoundRef = useRef(null);
  
  // Референс для фоновой музыки
  const backgroundMusicRef = useRef(null);
  
  // Эффект для обновления времени волны
  useEffect(() => {
    const waveTimer = setInterval(() => {
      setWaveTime(Date.now());
    }, 50); // Обновляем каждые 50мс для плавной анимации
    
    return () => clearInterval(waveTimer);
  }, []);
  
  // Функция для обновления времени и случайных показателей
  useEffect(() => {
    // Инициализация системы HUD
    const statusTimer = setTimeout(() => {
      setSystemStatus('All systems operational');
    }, 3000);
    
    // Обновление времени, топлива и щитов
    const hudTimer = setInterval(() => {
      // Обновление времени
      const now = new Date();
      setTime(now.toLocaleTimeString());
      
      // Используем год 2278 из лора ADNEXUX INDUSTRIES
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      setDate(`${day}.${month}.2278`);
      
      // Редкие случайные глитч-эффекты
      if (Math.random() > 0.95) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 1000);
      }
    }, 1000);
    
    // Более частое обновление миллисекунд для плавной анимации стрелок
    const millisecondsTimer = setInterval(() => {
      setMilliseconds(new Date().getMilliseconds());
    }, 50);
    
    return () => {
      clearTimeout(statusTimer);
      clearInterval(hudTimer);
      clearInterval(millisecondsTimer);
    };
  }, []); // Убрали зависимость от speed

  // Отдельный эффект для обновления топлива и щитов при изменении скорости
  useEffect(() => {
    if (!speed) return;
    
    const fuelShieldTimer = setInterval(() => {
      // Случайное изменение уровня топлива (медленное уменьшение)
      setFuelLevel(prev => Math.max(0, prev - (Math.random() * 0.1)));
      
      // Случайное изменение щитов при движении
      if (speed > 0.1) {
        setShield(prev => Math.max(0, Math.min(100, prev + (Math.random() * 2 - 1) * 0.5)));
      }
    }, 1000);
    
    return () => clearInterval(fuelShieldTimer);
  }, [speed]);
  
  // Отдельный эффект для обновления координат только при движении
  useEffect(() => {
    // Всегда очищаем предыдущий интервал при изменении скорости
    if (coordChangeTimerRef.current) {
      clearInterval(coordChangeTimerRef.current);
      coordChangeTimerRef.current = null;
    }
    
    // Запускаем обновление координат при любой ненулевой скорости
    if (speed > 0) {
      coordChangeTimerRef.current = setInterval(() => {
        setCoordinates(prev => ({
          x: initialCoordinatesRef.current.x, // Всегда используем статичный X
          y: initialCoordinatesRef.current.y, // Всегда используем статичный Y
          z: prev.z + (direction === 'Backward' ? -speed * 8 : speed * 8), // Z увеличивается при движении вперед и уменьшается при движении назад
        }));
        
        // Обновляем глубину в зависимости от скорости и направления
        setDepth(prev => prev + (direction === 'Backward' ? -speed * 0.0008 : speed * 0.0008));
      }, 100); // Более частое обновление для плавности
    }
    
    // Сохраняем текущую скорость для следующего сравнения
    prevSpeedRef.current = speed;
    
    // Очистка при размонтировании
    return () => {
      if (coordChangeTimerRef.current) {
        clearInterval(coordChangeTimerRef.current);
      }
    };
  }, [speed, direction]);
  
  // Инициализация звукового эффекта и фоновой музыки
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Инициализация звука клика
      cliSoundRef.current = new Audio('/assets/sounds/Cli.mp3');
      cliSoundRef.current.volume = 0.15;
      
      // Инициализация фоновой музыки
      backgroundMusicRef.current = new Audio('/assets/sounds/Mus.mp3');
      backgroundMusicRef.current.volume = 0.1;
      backgroundMusicRef.current.loop = true; // Зацикливаем музыку
      
      // Запускаем фоновую музыку
      backgroundMusicRef.current.play().catch(e => console.log('Background music play error:', e));
    }
    
    return () => {
      if (cliSoundRef.current) {
        cliSoundRef.current.pause();
        cliSoundRef.current = null;
      }
      
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);
  
  // Функция для обработки клика по кнопке с воспроизведением звука
  const handleVesselDataClick = () => {
    if (cliSoundRef.current) {
      cliSoundRef.current.currentTime = 0;
      cliSoundRef.current.play().catch(e => console.log('Audio play error:', e));
      
      // Открываем модальное окно только после окончания звука (1 секунда)
      setTimeout(() => {
        setIsModalOpen(true);
      }, 1000);
    } else {
      setIsModalOpen(true); // Если звук недоступен, открываем модальное окно сразу
    }
  };
  
  // Вычисляем процент скорости
  const speedPercent = maxSpeed ? Math.min(100, Math.round((speed / maxSpeed) * 100)) : 0;
  
  return (
    <div className={styles.hudContainer}>
      {/* Верхний элемент HUD */}
      <div className={styles.topHud}>
        <div className={styles.hudBox}>
          <div className={styles.systemHeader}>
            <div className={`${styles.hudTitle} ${isGlitching ? styles.glitchEffect : ''}`} data-text="ADNOS SYSTEM v1.0">
              ADNOS SYSTEM v1.0
            </div>
            <div className={styles.versionBadge}>
              <span className={styles.buildNumber}>BUILD 3.7.2</span>
              <div className={styles.statusLight} style={{ backgroundColor: systemStatus === 'All systems operational' ? 'var(--hud-accent)' : 'var(--hud-warning)' }}></div>
            </div>
          </div>
          
          <div className={styles.systemGrid}>
            <div className={styles.systemMetrics}>
              <div className={styles.metricRow}>
                <div className={styles.systemIndicator} style={{ 
                  color: speed > 0.1 ? 'var(--hud-accent)' : 'var(--hud-text)'
                }}>
                  <div className={styles.indicatorDot} style={{ 
                    backgroundColor: speed > 0.1 ? 'var(--hud-accent)' : 'var(--hud-danger)'
                  }}></div>
                  <span className={styles.hudLabel}>Status</span> 
                  <span className={speed > 0.1 ? styles.hudValueActive : styles.hudValue}>
                    {systemStatus}
                  </span>
                </div>
              </div>
              
              <div className={styles.metricRow}>
                <div className={styles.microProgress}>
                  <div className={styles.microProgressLabel}>CPU</div>
                  <div className={styles.microProgressBar}>
                    <div className={styles.microProgressFill} style={{ width: `${40 + speedPercent * 0.3}%` }}></div>
                  </div>
                  <div className={styles.microProgressValue}>{Math.round(40 + speedPercent * 0.3)}%</div>
                </div>
                <div className={styles.microProgress}>
                  <div className={styles.microProgressLabel}>MEM</div>
                  <div className={styles.microProgressBar}>
                    <div className={styles.microProgressFill} style={{ width: `${65 + speedPercent * 0.2}%` }}></div>
                  </div>
                  <div className={styles.microProgressValue}>{Math.round(65 + speedPercent * 0.2)}%</div>
                </div>
              </div>
            </div>
            
            <div className={styles.systemDiagnostics}>
              <div className={styles.diagnosticCircle}>
                <svg width="50" height="50" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(64, 153, 255, 0.2)" strokeWidth="1" />
                  <circle cx="25" cy="25" r="20" fill="none" stroke="var(--hud-accent)" strokeWidth="2" 
                    strokeDasharray={`${Math.min(100, 100 - speedPercent * 0.2) * 1.256} 125.6`}
                    strokeDashoffset="0" 
                    transform="rotate(-90 25 25)" />
                    
                  <circle cx="25" cy="25" r="16" fill="none" stroke="rgba(64, 153, 255, 0.2)" strokeWidth="1" />
                  <circle cx="25" cy="25" r="16" fill="none" stroke="var(--hud-accent)" strokeWidth="2"
                    strokeDasharray={`${fuelLevel * 1.005} 100.5`}
                    strokeDashoffset="0" 
                    transform="rotate(-90 25 25)" />
                    
                  <circle cx="25" cy="25" r="12" fill="none" stroke="rgba(64, 153, 255, 0.2)" strokeWidth="1" />
                  <circle cx="25" cy="25" r="12" fill="none" stroke="var(--hud-accent)" strokeWidth="2"
                    strokeDasharray={`${shield * 0.754} 75.4`}
                    strokeDashoffset="0" 
                    transform="rotate(-90 25 25)" />
                    
                  <text x="25" y="26" fill="var(--hud-text)" fontSize="8" textAnchor="middle" dominantBaseline="middle">{speedPercent}%</text>
                  
                  {/* Индикаторы состояния */}
                  {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i * 45) * Math.PI / 180;
                    const x = 25 + Math.sin(angle) * 25;
                    const y = 25 - Math.cos(angle) * 25;
                    const isActive = i < Math.ceil(speedPercent / 12.5);
                    
                    return (
                      <circle 
                        key={i} 
                        cx={x} 
                        cy={y} 
                        r="1" 
                        fill={isActive ? "var(--hud-accent)" : "rgba(64, 153, 255, 0.2)"}
                        style={{ filter: isActive ? "drop-shadow(0 0 2px var(--hud-accent))" : "none" }}
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
          
          <div className={styles.systemFooter}>
            <div className={styles.systemData}>
              <div className={styles.dataLabel}>UPTIME</div>
              <div className={styles.dataValue}>{Math.floor(waveTime / 1000)}s</div>
            </div>
            <div className={styles.pinger}>
              <div className={styles.pingDot} style={{ animationDuration: `${2 - speedPercent * 0.015}s` }}></div>
            </div>
          </div>
          
          <div className={styles.hologramEffect}></div>
        </div>
        
        {/* Новая визуальная панель в верхней части экрана */}
        <div className={styles.topSystemPanel}>
          <div className={styles.systemPanelHeader}>
            <span className={styles.systemIndicator}>QUANTUM INTERFACE</span>
            <span className={styles.systemCode}>::ADNX-7214::</span>
          </div>
          
          <div className={styles.systemPanelContent}>
            <div className={styles.quantumReadout}>
              <div className={styles.quantumWave}>
                <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(72, 255, 237, 0.7)" />
                      <stop offset="100%" stopColor="rgba(57, 137, 255, 0.7)" />
                    </linearGradient>
                  </defs>
                  
                  {/* Центральная линия */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(57, 137, 255, 0.5)" strokeWidth="0.5" />
                  
                  {/* Основная волна */}
                  <path 
                    d={`M0 20 ${Array.from({ length: 11 }, (_, i) => {
                      const x = i * 10;
                      const amplitude = speed * 3 + 3;
                      const y = 20 + Math.sin((waveTime * 0.002) + i * 0.5) * amplitude;
                      return `L${x} ${y}`;
                    }).join(' ')} L100 20`} 
                    fill="none" 
                    stroke="url(#waveGradient)" 
                    strokeWidth="1.5" 
                  />
                  
                  {/* Вторичная волна с меньшей амплитудой */}
                  <path 
                    d={`M0 20 ${Array.from({ length: 21 }, (_, i) => {
                      const x = i * 5;
                      const amplitude = speed * 1.5 + 1;
                      const y = 20 + Math.sin((waveTime * 0.003) + i * 0.7) * amplitude;
                      return `L${x} ${y}`;
                    }).join(' ')} L100 20`} 
                    fill="none" 
                    stroke="rgba(72, 255, 237, 0.3)" 
                    strokeWidth="0.7" 
                  />
                  
                  {/* Точки на волне */}
                  {Array.from({ length: 6 }, (_, i) => {
                    const x = i * 20;
                    const amplitude = speed * 3 + 3;
                    const y = 20 + Math.sin((waveTime * 0.002) + i * 0.5) * amplitude;
                    return (
                      <circle 
                        key={i} 
                        cx={x} 
                        cy={y} 
                        r="1" 
                        fill="rgba(72, 255, 237, 0.9)" 
                      />
                    );
                  })}
                </svg>
              </div>
              <div className={styles.quantumData}>
                {coordinates.z.toFixed(0).padStart(6, '0')}
                <span className={styles.quantumMetric}>PQU</span>
              </div>
            </div>
            
            <div className={styles.systemVisualizer}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i} 
                  className={styles.visualizerBar} 
                  style={{ 
                    height: `${20 + Math.sin(waveTime * 0.001 + i * 0.5) * 15}px`,
                    opacity: speed > 0 ? 0.8 : 0.4
                  }}
                ></div>
              ))}
            </div>
            
            <div className={styles.systemStats}>
              <div className={styles.statRow}>
                <span>DEPTH</span>
                <span className={styles.statValue}>{depth.toFixed(6)}</span>
              </div>
              <div className={styles.statRow}>
                <span>STABILITY</span>
                <span className={styles.statValue}>{speed > 0 ? (100 - speedPercent * 0.4).toFixed(1) : '100.0'}%</span>
              </div>
            </div>
          </div>
          
          <div className={styles.systemCorners}>
            <div className={styles.cornerTL}></div>
            <div className={styles.cornerTR}></div>
            <div className={styles.cornerBL}></div>
            <div className={styles.cornerBR}></div>
          </div>
        </div>
        
        <div className={styles.timeBox}>
          <div className={styles.timeBoxHeader}>
            <span className={styles.timeIndicator}>TEMPORAL MONITOR</span>
            <div className={styles.timeSector}>SEC-7</div>
          </div>
          <div className={styles.timeBoxContent}>
            <div className={styles.timeDigital}>
              <div className={styles.timeSegment}>
                <div className={styles.timeSegmentLabel}>HR</div>
                <div className={styles.timeDigits}>{time.split(':')[0]}</div>
              </div>
              <div className={styles.timeSeparator}>:</div>
              <div className={styles.timeSegment}>
                <div className={styles.timeSegmentLabel}>MIN</div>
                <div className={styles.timeDigits}>{time.split(':')[1]}</div>
              </div>
              <div className={styles.timeSeparator}>:</div>
              <div className={styles.timeSegment}>
                <div className={styles.timeSegmentLabel}>SEC</div>
                <div className={styles.timeDigits}>{time.split(':')[2]?.replace(/\s.*/, '') || '00'}</div>
              </div>
            </div>
            
            <div className={styles.timeAnalog}>
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="28" fill="none" stroke="rgba(64, 153, 255, 0.2)" strokeWidth="1" />
                <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(64, 153, 255, 0.2)" strokeWidth="1" />
                <circle cx="30" cy="30" r="22" fill="none" stroke="rgba(64, 153, 255, 0.15)" strokeWidth="1" />
                
                {/* Часовые деления */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30) * Math.PI / 180;
                  const x1 = 30 + 22 * Math.sin(angle);
                  const y1 = 30 - 22 * Math.cos(angle);
                  const x2 = 30 + 25 * Math.sin(angle);
                  const y2 = 30 - 25 * Math.cos(angle);
                  return (
                    <line 
                      key={i} 
                      x1={x1} 
                      y1={y1} 
                      x2={x2} 
                      y2={y2} 
                      stroke="rgba(64, 153, 255, 0.6)" 
                      strokeWidth="1"
                    />
                  );
                })}
                
                {/* Часовая стрелка */}
                {(() => {
                  const hours = parseInt(time.split(':')[0]);
                  const minutes = parseInt(time.split(':')[1]);
                  const hourAngle = ((hours % 12) * 30 + minutes * 0.5) * Math.PI / 180;
                  const hourX = 30 + 15 * Math.sin(hourAngle);
                  const hourY = 30 - 15 * Math.cos(hourAngle);
                  return (
                    <line 
                      x1="30" 
                      y1="30" 
                      x2={hourX} 
                      y2={hourY} 
                      stroke="rgba(72, 255, 237, 0.8)" 
                      strokeWidth="1.5" 
                    />
                  );
                })()}
                
                {/* Минутная стрелка */}
                {(() => {
                  const minutes = parseInt(time.split(':')[1]);
                  const seconds = parseInt(time.split(':')[2] || '0');
                  const minuteAngle = (minutes * 6 + seconds * 0.1) * Math.PI / 180;
                  const minuteX = 30 + 20 * Math.sin(minuteAngle);
                  const minuteY = 30 - 20 * Math.cos(minuteAngle);
                  return (
                    <line 
                      x1="30" 
                      y1="30" 
                      x2={minuteX} 
                      y2={minuteY} 
                      stroke="rgba(64, 153, 255, 0.9)" 
                      strokeWidth="1" 
                    />
                  );
                })()}
                
                {/* Секундная стрелка */}
                {(() => {
                  const seconds = parseInt(time.split(':')[2] || '0');
                  // Используем миллисекунды для плавного движения секундной стрелки
                  const secondAngle = (seconds * 6 + milliseconds * 0.006) * Math.PI / 180;
                  const secondX = 30 + 22 * Math.sin(secondAngle);
                  const secondY = 30 - 22 * Math.cos(secondAngle);
                  return (
                    <line 
                      x1="30" 
                      y1="30" 
                      x2={secondX} 
                      y2={secondY} 
                      stroke="rgba(255, 100, 100, 0.8)" 
                      strokeWidth="0.5" 
                    />
                  );
                })()}
                
                {/* Центральная точка */}
                <circle cx="30" cy="30" r="2" fill="rgba(72, 255, 237, 0.8)" />
              </svg>
            </div>
          </div>
          
          <div className={styles.dateDisplay}>
            <div className={styles.dateLabelNow}>CURRENT DATE</div>
            <div className={styles.dateValue}>{date}</div>
          </div>
          
          <div className={styles.timeDecoration}>
            <div className={styles.timeDecorationBar}></div>
            <div className={styles.timeDecorationBar}></div>
            <div className={styles.timeDecorationBar}></div>
          </div>
        </div>
      </div>
      
      {/* Левый элемент HUD */}
      <div className={styles.leftHud}>
        <div className={styles.hudBox}>
          <div className={styles.navHeader}>
            <div className={styles.hudTitle}>NAVIGATION</div>
            <div className={styles.navStatus}>
              <div className={styles.statusIndicator} style={{ 
                backgroundColor: speed > 0.1 ? 'var(--hud-accent)' : 'var(--hud-secondary)'
              }}></div>
              <span>{speed > 0.1 ? 'TRACKING' : 'STANDBY'}</span>
            </div>
          </div>
          
          <div className={styles.navGridContainer}>
            <div className={styles.navCoordinatesPanel}>
              <div className={styles.navPanelTitle}>
                <div className={styles.panelIcon}></div>
                <span>COORDINATES</span>
              </div>
              
              <div className={styles.coordinatesGrid}>
                <div className={styles.coordinateRow}>
                  <div className={styles.coordAxisTag}>X</div>
                  <div className={`${styles.coordValue} ${speed > 0 ? styles.coordValueActive : ''}`}>
                    <span className={styles.coordDigits}>{coordinates.x.toFixed(2)}</span>
                    <div className={styles.coordIndicator}>
                      <div className={styles.coordArrow} style={{ transform: 'rotate(0deg)' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.coordinateRow}>
                  <div className={styles.coordAxisTag}>Y</div>
                  <div className={`${styles.coordValue} ${speed > 0 ? styles.coordValueActive : ''}`}>
                    <span className={styles.coordDigits}>{coordinates.y.toFixed(2)}</span>
                    <div className={styles.coordIndicator}>
                      <div className={styles.coordArrow} style={{ transform: 'rotate(90deg)' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.coordinateRow}>
                  <div className={styles.coordAxisTag}>Z</div>
                  <div className={`${styles.coordValue} ${speed > 0 ? styles.coordValueActive : ''}`}>
                    <span className={styles.coordDigits}>{coordinates.z.toFixed(2)}</span>
                    <div className={styles.coordIndicator}>
                      <div className={styles.coordArrow} style={{ 
                        transform: `rotate(${direction === 'Forward' ? '180deg' : '0deg'})`,
                        opacity: speed > 0.1 ? 1 : 0.3
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.navDataBar}>
                <div className={styles.navDataItem}>
                  <span className={styles.navDataLabel}>SECTOR</span>
                  <span className={styles.navDataValue}>12-A</span>
                </div>
                <div className={styles.navDataItem}>
                  <span className={styles.navDataLabel}>DIST</span>
                  <span className={styles.navDataValue}>{(coordinates.z / 1000).toFixed(2)} KM</span>
                </div>
              </div>
              
              <div className={styles.systemScanStatus}>
                <div className={styles.scanTitle}>SCAN STATUS</div>
                <div className={styles.scanBar}>
                  <div 
                    className={styles.scanProgress} 
                    style={{ width: `${75 + Math.sin(waveTime * 0.002) * 15}%` }}
                  ></div>
                </div>
                <div className={styles.scanInfo}>
                  <div className={styles.scanLabel}>ANOMALIES</div>
                  <div className={styles.scanValue}>{Math.floor(Math.random() * 4)}</div>
                </div>
              </div>
            </div>
            
            <div className={styles.navMapContainer}>
              <div className={styles.navMapDecoration}>
                <div className={styles.mapCorner}></div>
                <div className={styles.mapCorner}></div>
                <div className={styles.mapCorner}></div>
                <div className={styles.mapCorner}></div>
              </div>
              
              <GalaxyMap speed={speed} direction={direction} />
              
              <div className={styles.mapOverlay}>
                <div className={styles.mapGrid}></div>
                <div className={styles.mapTargetingReticle} style={{ 
                  opacity: speed > 0.1 ? 0.8 : 0.3,
                  transform: `scale(${1 + Math.sin(waveTime * 0.002) * 0.1})` 
                }}></div>
              </div>
            </div>
          </div>
          
          <div className={styles.navFooter}>
            <div className={styles.navMode}>
              <span className={styles.navModeLabel}>MODE</span>
              <span className={styles.navModeValue}>QUANTUM</span>
            </div>
            <div className={styles.mapControlButtons}>
              <div className={styles.mapControlBtn}>-</div>
              <div className={styles.mapControlBtn}>+</div>
              <div className={styles.mapControlBtn}>□</div>
            </div>
          </div>
          
          <div className={styles.hologramEffect}></div>
          
          <div className={styles.navDecorations}>
            <div className={styles.navDecorLine}></div>
            <div className={styles.navDecorLine}></div>
            <div className={styles.navDecorLine}></div>
          </div>
        </div>
        
        {/* Кнопка для открытия информации о корабле */}
        <button 
          className={styles.shipInfoButton}
          onClick={handleVesselDataClick}
        >
          <div className={styles.buttonContent}>
            <div className={styles.buttonIcon}>
              <div className={styles.iconRing}></div>
              <div className={styles.iconCircle}></div>
            </div>
            <span className={styles.buttonText}>VESSEL DATA</span>
            <div className={styles.buttonStatus}></div>
          </div>
          <div className={styles.buttonEffect}></div>
        </button>
      </div>
      
      {/* Правый элемент HUD */}
      <div className={styles.rightHud}>
        <div className={styles.hudBox}>
          <div className={styles.hudTitle}>DRIVE SYSTEMS</div>
          
          <div className={styles.driveSystemContent}>
            <div className={styles.driveSystemHeader}>
              <div className={styles.driveSystemIndicator}>
                <div className={styles.indicatorLight} style={{ backgroundColor: speed > 0.1 ? 'var(--hud-accent)' : 'var(--hud-danger)' }}></div>
                <span>QUANTUM DRIVE {speed > 0.1 ? 'ONLINE' : 'STANDBY'}</span>
              </div>
              <div className={styles.driveSystemCode}>MK-7</div>
            </div>
            
            <div className={styles.controlsRow}>
              <div className={styles.speedInfo}>
                <div className={styles.speedDirection}>
                  <span className={styles.directionLabel}>VECTOR</span>
                  <span className={speed > 0.1 ? styles.directionActive : styles.direction}>
                    {direction}
                  </span>
                </div>
                
                <div className={styles.driveStats}>
                  <div className={styles.driveStat}>
                    <span>EFF</span>
                    <span className={styles.driveStatValue}>{(100 - speedPercent * 0.2).toFixed(1)}%</span>
                  </div>
                  <div className={styles.driveStat}>
                    <span>TEMP</span>
                    <span className={styles.driveStatValue} style={{ 
                      color: speedPercent > 80 ? 'var(--hud-warning)' : undefined 
                    }}>{(speedPercent * 0.8).toFixed(1)}°</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.gaugeRing}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={styles.gaugeNotch} 
                    style={{ 
                      transform: `rotate(${i * 45}deg) translateY(-35px)`,
                      opacity: speedPercent >= (i * 12.5) ? 1 : 0.3
                    }}
                  ></div>
                ))}
                <div 
                  className={styles.gaugeNeedle} 
                  style={{ transform: `rotate(${speedPercent * 2.7}deg)` }}
                ></div>
                <div className={styles.gaugeCenter}></div>
                <div className={styles.gaugeValue}>{speed.toFixed(1)}</div>
                <div className={styles.gaugeMax}>/ {maxSpeed.toFixed(1)}</div>
              </div>
            </div>
            
            <div className={styles.speedBarContainer}>
              <div className={styles.speedBarLabels}>
                <div className={styles.speedLabelMin}>0</div>
                <div className={styles.speedPercent}>{speedPercent.toFixed(0)}%</div>
                <div className={styles.speedLabelMax}>MAX</div>
              </div>
              <div className={styles.speedBar}>
                <div 
                  className={styles.speedFill} 
                  style={{ width: `${speedPercent}%` }}
                ></div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={styles.speedNotch} 
                    style={{ left: `${i * 25}%` }}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className={styles.driveSystemDivider}>
              <div className={styles.dividerLabel}>SYSTEMS</div>
              <div className={styles.dividerLine}></div>
            </div>
            
            <div className={styles.systemsGrid}>
              <div className={styles.progressContainer}>
                <div className={styles.progressHeader}>
                  <div className={styles.progressLabel}>Energy</div>
                  <div className={styles.progressValue} style={{ 
                    color: fuelLevel < 20 ? 'var(--hud-danger)' : fuelLevel < 50 ? 'var(--hud-warning)' : undefined 
                  }}>{Math.round(fuelLevel)}%</div>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: `${Math.round(fuelLevel)}%`, 
                      backgroundColor: fuelLevel < 20 ? 'var(--hud-danger)' : fuelLevel < 50 ? 'var(--hud-warning)' : undefined 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className={styles.progressContainer}>
                <div className={styles.progressHeader}>
                  <div className={styles.progressLabel}>Shields</div>
                  <div className={styles.progressValue} style={{ 
                    color: shield < 30 ? 'var(--hud-danger)' : undefined 
                  }}>{Math.round(shield)}%</div>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: `${Math.round(shield)}%`, 
                      backgroundColor: shield < 30 ? 'var(--hud-danger)' : undefined 
                    }}
                  ></div>
                </div>
                <div className={styles.shieldStatus}>{
                  shield < 20 ? 'CRITICAL' : 
                  shield < 50 ? 'COMPROMISED' : 
                  shield < 80 ? 'FUNCTIONAL' : 'OPTIMAL'
                }</div>
              </div>
            </div>
          </div>
          
          <div className={styles.hologramEffect}></div>
          
          <div className={styles.driveSystemCorners}>
            <div className={styles.cornerTL}></div>
            <div className={styles.cornerTR}></div>
            <div className={styles.cornerBL}></div>
            <div className={styles.cornerBR}></div>
          </div>
        </div>
      </div>
      
      {/* Нижний левый информационный блок */}
      <div className={styles.bottomLeftInfo}>
        <div className={styles.infoTag}>VESSEL-INFO</div>
        <div className={styles.infoLine}>ID: <span>ADNOS-X72</span></div>
        <div className={styles.infoLine}>CLASS: <span>EXPLORER MK-III</span></div>
        <div className={styles.infoLine}>MASS: <span>14.8K TONS</span></div>
        <div className={styles.infoLine}>STATUS: <span className={styles.statusOnline}>ONLINE</span></div>
      </div>
      
      {/* Нижний правый информационный блок */}
      <div className={styles.bottomRightInfo}>
        <div className={styles.infoTag}>SYS-METRICS</div>
        <div className={styles.microData}>
          <div className={styles.dataRow}>
            <div className={styles.dataLabel}>MEM</div>
            <div className={styles.dataBar}>
              <div style={{ width: '73%' }}></div>
            </div>
            <div className={styles.dataValue}>73%</div>
          </div>
          <div className={styles.dataRow}>
            <div className={styles.dataLabel}>CPU</div>
            <div className={styles.dataBar}>
              <div style={{ width: '42%' }}></div>
            </div>
            <div className={styles.dataValue}>42%</div>
          </div>
          <div className={styles.dataRow}>
            <div className={styles.dataLabel}>TEMP</div>
            <div className={styles.dataBar}>
              <div style={{ width: '58%' }}></div>
            </div>
            <div className={styles.dataValue}>58%</div>
          </div>
        </div>
        <div className={styles.sectorInfo}>
          SECTOR: <span>12-A</span> • SCAN: <span className={isGlitching ? styles.scanActive : ''}>ACTIVE</span>
        </div>
      </div>
      
      {/* Рамка по периметру */}
      <div className={styles.frameTopLeft}></div>
      <div className={styles.frameTopRight}></div>
      <div className={styles.frameBottomLeft}></div>
      <div className={styles.frameBottomRight}></div>
      
      {/* Нижняя граница с информацией */}
      <div className={styles.borderInfo}>
        <div className={styles.borderInfoLeft}>
          Sector 12-A | Grid: 400-720
        </div>
        <div className={styles.borderInfoRight}>
          Depth: {depth.toFixed(3)} ly | Velocity: {((speed * 0.4) || 0.2).toFixed(1)}c
        </div>
      </div>
      
      {/* Модальное окно с информацией о корабле */}
      {isModalOpen && (
        <ShipInfoModal 
          onClose={() => setIsModalOpen(false)} 
          shipData={{
            id: "ADNOS-X72",
            class: "EXPLORER MK-III",
            mass: "14.8K TONS",
            coordinates: coordinates,
            systemMetrics: {
              memory: 73,
              cpu: 42,
              temp: 58
            }
          }}
        />
      )}
    </div>
  );
};

export default SpaceHUD; 