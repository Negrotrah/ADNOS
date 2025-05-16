'use client';

import { useState, useEffect } from 'react';
import SimpleSpace from './components/SimpleSpace';
import LoadingScreen from './components/LoadingScreen';
import styles from './page.module.css';

export default function Home() {
  const [showTitle, setShowTitle] = useState(true);
  const [loading, setLoading] = useState(true);

  // Отображаем заголовок только после завершения загрузки и только на 3 секунды
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowTitle(false);
      }, 3000);
      
      // Очистка таймера при размонтировании
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Обработчик завершения загрузки
  const handleLoadingComplete = () => {
    setLoading(false);
  };

  return (
    <main className={styles.main}>
      {loading ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <>
          <SimpleSpace />
          
          {showTitle && (
            <div className={styles.titleContainer}>
              <h1 className={styles.title}>ADNOS</h1>
              <p className={styles.subtitle}>MISSION: &quot;Cold Vector&quot;</p>
            </div>
          )}
        </>
      )}
    </main>
  );
} 