'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import styles from './LoadingScreen.module.css';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showLaunchButton, setShowLaunchButton] = useState(false);
  const [logEntries, setLogEntries] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);
  const [shipId] = useState('ADNOS-X72');
  const [repairStarted, setRepairStarted] = useState(false);
  const [diagnosticSystems, setDiagnosticSystems] = useState({
    power: 0,
    navigation: 0,
    lifeSupport: 0,
    quantum: 0
  });
  
  // Ссылка на аудио объект
  const capsuleSoundRef = useRef(null);
  const launchSoundRef = useRef(null);
  const cliSoundRef = useRef(null);
  const soundPlayedRef = useRef(false);

  // Расширенная система логов - используем useMemo для мемоизации массива
  const logs = useMemo(() => [
    "INITIALIZING CORE SYSTEMS...",
    "RUNNING DIAGNOSTICS...",
    "CHECKING POWER SYSTEMS...",
    "SEARCHING FOR NAVIGATION DATA...",
    "RESTORING SHIP SYSTEMS...",
    "INTEGRITY CHECK: 42%...",
    "MEMORY BANKS RECOVERY: PARTIAL",
    `SHIP IDENTIFICATION: ${shipId}`,
    "DETECTING AVAILABLE SECTORS...",
    "CALCULATING CURRENT POSITION...",
    "LOADING STAR CHARTS...",
    "RECOVERING MISSION DATA: CORRUPTED",
    "ANOMALY DETECTED IN SECTOR 12-A",
    "CALIBRATING NAVIGATION SENSORS...",
    "QUANTUM FIELD STABILIZED",
    "REACTIVATING SHIP NAVIGATION..."
  ], [shipId]);

  // Инициализация аудио
  useEffect(() => {
    // Проверяем, что мы в браузере
    if (typeof window === 'undefined') return;
    
    // Инициализируем звук капсулы
    capsuleSoundRef.current = new Audio('/assets/sounds/Capsule.mp3');
    capsuleSoundRef.current.volume = 0.2;
    
    // Инициализируем звук запуска
    launchSoundRef.current = new Audio('/assets/sounds/A2.mp3');
    launchSoundRef.current.volume = 0.7;
    
    // Инициализируем звук клика
    cliSoundRef.current = new Audio('/assets/sounds/Cli.mp3');
    cliSoundRef.current.volume = 0.15;
    
    // Предзагрузка звуков
    capsuleSoundRef.current.load();
    launchSoundRef.current.load();
    cliSoundRef.current.load();
    
    // Очистка при размонтировании
    return () => {
      if (capsuleSoundRef.current) {
        capsuleSoundRef.current.pause();
        capsuleSoundRef.current.currentTime = 0;
      }
      if (launchSoundRef.current) {
        launchSoundRef.current.pause();
        launchSoundRef.current.currentTime = 0;
      }
      if (cliSoundRef.current) {
        cliSoundRef.current.pause();
        cliSoundRef.current.currentTime = 0;
      }
    };
  }, []);

  // Обновление диагностических данных
  useEffect(() => {
    if (!repairStarted) return;
    
    const updateInterval = setInterval(() => {
      setDiagnosticSystems(prev => {
        const newValues = {...prev};
        
        // Расчет скорости прогресса для каждой системы относительно основного
        // Когда приближаемся к концу, скорость увеличивается для каждой системы
        
        // Power начинает заполняться сразу и должна быть немного впереди остальных
        const powerBoost = Math.max(1, Math.floor((95 - progress) / 20)); // Ускорение к концу
        const powerIncrement = Math.min(
          10, // Максимальное увеличение за раз
          Math.max(1, Math.floor(Math.random() * 4) + powerBoost)
        );
        newValues.power = Math.min(100, newValues.power + powerIncrement);
        
        // Navigation - создаем плавный целевой уровень на основе прогресса
        const navTarget = progress < 20 ? 0 : Math.min(100, ((progress - 15) * 1.2));
        const navDiff = navTarget - newValues.navigation;
        if (navDiff > 0) {
          const navBoost = Math.max(1, Math.floor((95 - progress) / 25)); // Ускорение к концу
          const navIncrement = Math.min(
            navDiff, 
            Math.max(1, Math.floor(Math.random() * 3) + navBoost)
          );
          newValues.navigation = Math.min(100, newValues.navigation + navIncrement);
        }
        
        // Life Support - создаем плавный целевой уровень на основе прогресса
        const lifeTarget = progress < 40 ? 0 : Math.min(100, ((progress - 35) * 1.5));
        const lifeDiff = lifeTarget - newValues.lifeSupport;
        if (lifeDiff > 0) {
          const lifeBoost = Math.max(1, Math.floor((95 - progress) / 30)); // Ускорение к концу
          const lifeIncrement = Math.min(
            lifeDiff, 
            Math.max(1, Math.floor(Math.random() * 2) + lifeBoost)
          );
          newValues.lifeSupport = Math.min(100, newValues.lifeSupport + lifeIncrement);
        }
        
        // Quantum Core - создаем плавный целевой уровень на основе прогресса
        const quantumTarget = progress < 60 ? 0 : Math.min(100, ((progress - 55) * 2.2));
        const quantumDiff = quantumTarget - newValues.quantum;
        if (quantumDiff > 0) {
          const quantumBoost = Math.max(1, Math.floor((95 - progress) / 15)); // Более быстрое ускорение к концу
          const quantumIncrement = Math.min(
            quantumDiff, 
            Math.max(1, Math.floor(Math.random() * 5) + quantumBoost)
          );
          newValues.quantum = Math.min(100, newValues.quantum + quantumIncrement);
        }
        
        // Когда основной прогресс на 99-100%, все системы должны стремиться к завершению
        // Но делаем это плавно, увеличивая скорость, а не мгновенно
        if (progress >= 99) {
          // Ускоряем все системы, чтобы они догнали основной прогресс
          if (newValues.power < 100) newValues.power = Math.min(100, newValues.power + 3);
          if (newValues.navigation < 100) newValues.navigation = Math.min(100, newValues.navigation + 4);
          if (newValues.lifeSupport < 100) newValues.lifeSupport = Math.min(100, newValues.lifeSupport + 5);
          if (newValues.quantum < 100) newValues.quantum = Math.min(100, newValues.quantum + 6);
        }
        
        return newValues;
      });
    }, 200);
    
    return () => clearInterval(updateInterval);
  }, [repairStarted, progress]);
  
  // Начать процесс восстановления
  const startRepairProcess = () => {
    // Сначала воспроизводим звук клика
    if (cliSoundRef.current) {
      cliSoundRef.current.currentTime = 0;
      cliSoundRef.current.play().catch(e => console.log('Cli sound error:', e));
    }
    
    setRepairStarted(true);
    
    // Воспроизводим звук через 1.7 секунды после клика пользователя
    setTimeout(() => {
      if (capsuleSoundRef.current) {
        capsuleSoundRef.current.play().catch(e => console.log('Audio play error:', e));
        soundPlayedRef.current = true;
      }
    }, 1700);
  };

  // Симуляция загрузки и вывода логов - запускается только после нажатия кнопки
  useEffect(() => {
    if (!repairStarted) return;
    
    // Рассчитываем прирост прогресса для каждого лога
    const progressPerLog = 100 / logs.length;
    
    // Добавление новых логов каждые 300мс
    const logsInterval = setInterval(() => {
      if (logs.length > logEntries.length) {
        // Добавляем новый лог
        setLogEntries(prev => [...prev, logs[prev.length]]);
        
        // Обновляем прогресс на основе количества показанных логов
        const newProgress = Math.min(Math.ceil((logEntries.length + 1) * progressPerLog), 99);
        setProgress(newProgress);
        
        // Если это последний лог, устанавливаем 100% и показываем кнопку
        if (logEntries.length + 1 >= logs.length) {
          setTimeout(() => {
            setProgress(100);
            setShowLaunchButton(true);
          }, 500); // Небольшая задержка для плавности
        }
      }
    }, 300);

    // Гарантия завершения загрузки через 6 секунд
    const maxLoadingTime = setTimeout(() => {
      setProgress(100);
      setShowLaunchButton(true);
      clearInterval(logsInterval);
    }, 6000);

    return () => {
      clearInterval(logsInterval);
      clearTimeout(maxLoadingTime);
    };
  }, [logEntries.length, logs, logs.length, repairStarted]);

  // Запуск системы
  const handleLaunch = () => {
    setFadeOut(true);
    
    // Останавливаем звук капсулы при закрытии экрана загрузки
    if (capsuleSoundRef.current) {
      capsuleSoundRef.current.pause();
      capsuleSoundRef.current.currentTime = 0;
    }
    
    // Воспроизводим звук запуска
    if (launchSoundRef.current) {
      launchSoundRef.current.play().catch(e => console.log('Launch audio play error:', e));
    }
    
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1500);
  };

  return (
    <div className={`${styles.loadingScreen} ${fadeOut ? styles.fadeOut : ''}`}>
      {/* Левая боковая панель - показываем только когда repairStarted = true */}
      {repairStarted && (
        <div className={styles.sidePanelLeft}>
          <div className={styles.sideHeader}>SYSTEM METRICS</div>
          <div className={styles.sideSection}>
            <div className={styles.metricItem}>
              <div className={styles.metricLabel}>CORE TEMP</div>
              <div className={styles.metricValue}>
                {Math.floor(40 + (progress * 0.3))}°C
                <div className={styles.metricGraph}>
                  <div 
                    className={styles.metricGraphFill} 
                    style={{ height: `${Math.min(progress * 0.8, 70)}%` }} 
                  />
                </div>
              </div>
            </div>
            <div className={styles.metricItem}>
              <div className={styles.metricLabel}>MEMORY</div>
              <div className={styles.metricValue}>
                {Math.floor(20 + (progress * 0.6))}%
                <div className={styles.metricGraph}>
                  <div 
                    className={styles.metricGraphFill} 
                    style={{ height: `${Math.min(20 + (progress * 0.6), 80)}%` }} 
                  />
                </div>
              </div>
            </div>
            <div className={styles.metricItem}>
              <div className={styles.metricLabel}>DATA RESTORED</div>
              <div className={styles.metricValue}>
                {Math.floor(progress * 0.9)}%
              </div>
            </div>
          </div>
          <div className={styles.blueprintContainer}>
            <div className={styles.blueprint}>
              <div className={styles.blueprintScanLine} style={{ opacity: progress < 100 ? 1 : 0.3 }}></div>
            </div>
            <div className={styles.blueprintLabel}>SHIP SCHEMATICS</div>
          </div>
          <div className={styles.statusLights}>
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className={`${styles.statusLight} ${progress > (i * 12) ? styles.statusLightActive : ''}`} 
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Основной контент */}
      <div className={styles.content}>
        <div className={styles.shipId}>
          <span>{shipId}</span>
        </div>
        
        {!repairStarted ? (
          <div className={styles.initialScreen}>
            <div className={styles.systemError}>
              <h2>SYSTEM ERROR DETECTED</h2>
              <p>Critical system failure occurred during deep space exploration.</p>
              <p>Manual recovery procedure required.</p>
            </div>
            <button 
              className={styles.repairButton}
              onClick={startRepairProcess}
            >
              REPAIR SYSTEM
            </button>
          </div>
        ) : (
          <>
            <div className={styles.scanLines}></div>
            
            <div className={styles.diagnosticPanels}>
              <div className={styles.diagnosticPanel}>
                <div className={styles.diagnosticTitle}>POWER SYSTEMS</div>
                <div className={styles.diagnosticBar}>
                  <div 
                    className={styles.diagnosticFill} 
                    style={{ width: `${diagnosticSystems.power}%` }}
                  ></div>
                </div>
                <div className={styles.diagnosticValue}>{diagnosticSystems.power}%</div>
              </div>
              
              <div className={styles.diagnosticPanel}>
                <div className={styles.diagnosticTitle}>NAVIGATION</div>
                <div className={styles.diagnosticBar}>
                  <div 
                    className={styles.diagnosticFill} 
                    style={{ width: `${diagnosticSystems.navigation}%` }}
                  ></div>
                </div>
                <div className={styles.diagnosticValue}>{diagnosticSystems.navigation}%</div>
              </div>
              
              <div className={styles.diagnosticPanel}>
                <div className={styles.diagnosticTitle}>LIFE SUPPORT</div>
                <div className={styles.diagnosticBar}>
                  <div 
                    className={styles.diagnosticFill} 
                    style={{ width: `${diagnosticSystems.lifeSupport}%` }}
                  ></div>
                </div>
                <div className={styles.diagnosticValue}>{diagnosticSystems.lifeSupport}%</div>
              </div>
              
              <div className={styles.diagnosticPanel}>
                <div className={styles.diagnosticTitle}>QUANTUM CORE</div>
                <div className={styles.diagnosticBar}>
                  <div 
                    className={styles.diagnosticFill} 
                    style={{ width: `${diagnosticSystems.quantum}%` }}
                  ></div>
                </div>
                <div className={styles.diagnosticValue}>{diagnosticSystems.quantum}%</div>
              </div>
            </div>
            
            <div className={styles.terminal}>
              <div className={styles.scanningEffect}></div>
              <div className={styles.logs}>
                {logEntries.map((log, index) => (
                  <div 
                    key={index} 
                    className={styles.logEntry}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className={styles.timestamp}>
                      {`[${String(Math.floor(index * 1.5)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}]`}
                    </span>
                    <span className={styles.logText}>{log}</span>
                  </div>
                ))}
                {progress < 100 && <div className={styles.cursor}></div>}
              </div>
            </div>
            
            <div className={styles.systemScanContainer}>
              <div className={styles.systemScanTitle}>
                SYSTEM SCAN IN PROGRESS
                <span className={styles.systemScanStatus}>
                  {progress < 30 ? "CRITICAL AREAS" : 
                  progress < 60 ? "MAIN COMPONENTS" : 
                  progress < 90 ? "OPTIMIZING" : "COMPLETED"}
                </span>
              </div>
              <div className={styles.systemScanVisual}>
                <div className={styles.scanTarget}></div>
                <div className={styles.scanBeam} style={{opacity: progress < 100 ? 1 : 0}}></div>
                <div className={styles.scanGrid}></div>
              </div>
            </div>

            <div className={styles.progressContainer}>
              <div className={styles.progressHeader}>
                <span>SYSTEM RECOVERY</span>
                <span className={styles.progressPercent}>{progress}%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className={styles.progressStatus}>
                {progress < 30 ? "CRITICAL" : 
                 progress < 70 ? "UNSTABLE" : 
                 progress < 90 ? "NORMALIZING" : "READY"}
              </div>
            </div>

            {showLaunchButton && (
              <button 
                className={styles.launchButton}
                onClick={handleLaunch}
              >
                <span className={styles.buttonIcon}></span>
                LAUNCH ADNOS SYSTEMS
              </button>
            )}
          </>
        )}
      </div>

      {/* Правая боковая панель - показываем только когда repairStarted = true */}
      {repairStarted && (
        <div className={styles.sidePanelRight}>
          <div className={styles.sideHeader}>DIAGNOSTIC</div>
          <div className={styles.circuitContainer}>
            <div className={`${styles.circuit} ${progress > 30 ? styles.circuitActive : ''}`}></div>
            <div className={`${styles.circuit} ${progress > 50 ? styles.circuitActive : ''}`}></div>
            <div className={`${styles.circuit} ${progress > 70 ? styles.circuitActive : ''}`}></div>
            <div className={`${styles.circuit} ${progress > 90 ? styles.circuitActive : ''}`}></div>
          </div>
          <div className={styles.sideSection}>
            <div className={styles.dataReadout}>
              <div className={styles.dataHeader}>SYSTEM DEBUG:</div>
              <div className={styles.dataRows}>
                {progress >= 25 && (
                  <div className={styles.dataRow}>
                    <span>KERNEL</span>
                    <span className={styles.dataStatus}>ONLINE</span>
                  </div>
                )}
                {progress >= 45 && (
                  <div className={styles.dataRow}>
                    <span>MEMORY</span>
                    <span className={styles.dataStatus}>RESTORING</span>
                  </div>
                )}
                {progress >= 65 && (
                  <div className={styles.dataRow}>
                    <span>NAVIGATION</span>
                    <span className={styles.dataStatus}>CALIBRATING</span>
                  </div>
                )}
                {progress >= 85 && (
                  <div className={styles.dataRow}>
                    <span>NETWORK</span>
                    <span className={styles.dataStatus}>SECURED</span>
                  </div>
                )}
                {progress >= 100 && (
                  <div className={styles.dataRow}>
                    <span>ALL SYSTEMS</span>
                    <span className={styles.dataStatus}>READY</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.oscilloscopeContainer}>
            <div className={styles.oscilloscope}>
              <div className={styles.oscilloscopeLine} style={{ 
                height: `${30 + Math.sin(Date.now() * 0.01) * 20}px`,
                opacity: progress < 100 ? 1 : 0.7
              }}></div>
            </div>
            <div className={styles.oscilloscopeLabel}>SIGNAL INTEGRITY</div>
          </div>
          <div className={styles.hexCode}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={styles.hexRow}>
                {Array.from({ length: 4 }, (_, j) => {
                  const shouldShow = (i * 4 + j) * 3 < progress;
                  return shouldShow ? (
                    <span key={j} className={styles.hexDigit}>
                      {Math.floor(Math.random() * 16).toString(16).toUpperCase()}
                    </span>
                  ) : (
                    <span key={j} className={styles.hexEmpty}>0</span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen; 