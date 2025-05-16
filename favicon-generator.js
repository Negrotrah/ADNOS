const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');

async function generateIco() {
  try {
    // Определяем пути к файлам - используем изображение с большим разрешением
    const pngFile = path.join(__dirname, 'public', 'Ico', 'favicon_192x192.png');
    const outputFile = path.join(__dirname, 'public', 'favicon.ico');

    // Создаем буфер иконки из PNG-файла
    const icoBuffer = await pngToIco([pngFile]);
    
    // Записываем ICO файл
    fs.writeFileSync(outputFile, icoBuffer);
    
    console.log(`Файл favicon.ico успешно создан в: ${outputFile}`);
  } catch (error) {
    console.error('Ошибка при создании иконки:', error);
  }
}

// Запускаем генерацию
generateIco(); 