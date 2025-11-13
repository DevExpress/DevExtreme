#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Скрипт для обновления эталонных скриншотов
 * Использование: node update-etalons.js <source_folder> [target_folder]
 */

const sourceFolder = process.argv[2] || './new-screenshots';
const targetFolder = process.argv[3] || './apps/demos/testing/etalons';

console.log('🔄 Обновление эталонных скриншотов');
console.log(`📂 Источник: ${sourceFolder}`);
console.log(`📂 Назначение: ${targetFolder}`);
console.log('');

// Проверяем существование папок
if (!fs.existsSync(sourceFolder)) {
    console.error(`❌ Папка с новыми скриншотами не найдена: ${sourceFolder}`);
    process.exit(1);
}

if (!fs.existsSync(targetFolder)) {
    console.error(`❌ Папка с эталонами не найдена: ${targetFolder}`);
    process.exit(1);
}

// Получаем список файлов
function getPngFiles(dir) {
    const files = [];
    
    function walkDir(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                walkDir(fullPath);
            } else if (path.extname(item).toLowerCase() === '.png') {
                files.push(fullPath);
            }
        }
    }
    
    walkDir(dir);
    return files;
}

const sourceFiles = getPngFiles(sourceFolder);
const targetFiles = getPngFiles(targetFolder);

// Создаем карту имен файлов для быстрого поиска
const targetMap = new Map();
targetFiles.forEach(file => {
    const filename = path.basename(file);
    targetMap.set(filename, file);
});

console.log('📊 Статистика:');
console.log(`   Новых скриншотов: ${sourceFiles.length}`);
console.log(`   Текущих эталонов: ${targetFiles.length}`);
console.log('');

let updated = 0;
let skipped = 0;
let errors = 0;

console.log('🔍 Поиск совпадающих файлов...');
console.log('');

// Обновляем файлы
for (const sourceFile of sourceFiles) {
    const filename = path.basename(sourceFile);
    const targetFile = targetMap.get(filename);
    
    if (targetFile) {
        try {
            fs.copyFileSync(sourceFile, targetFile);
            console.log(`✅ Обновлен: ${filename}`);
            updated++;
        } catch (error) {
            console.error(`❌ Ошибка при копировании ${filename}:`, error.message);
            errors++;
        }
    } else {
        console.log(`⚠️  Пропущен: ${filename} (эталон не найден)`);
        skipped++;
    }
}

console.log('');
console.log('📈 Результат:');
console.log(`   Обновлено: ${updated} файлов`);
console.log(`   Пропущено: ${skipped} файлов`);
console.log(`   Ошибок: ${errors}`);
console.log('');

if (updated > 0) {
    console.log('🎉 Эталоны успешно обновлены!');
    console.log('💡 Не забудьте проверить изменения и сделать коммит:');
    console.log(`   git add ${targetFolder}`);
    console.log(`   git commit -m "Update screenshot etalons"`);
} else {
    console.log('😔 Ни один эталон не был обновлен');
}

// Показываем примеры файлов, которые не найдены (первые 10)
if (skipped > 0) {
    console.log('');
    console.log('🔍 Примеры файлов без соответствующих эталонов:');
    let count = 0;
    for (const sourceFile of sourceFiles) {
        const filename = path.basename(sourceFile);
        if (!targetMap.has(filename)) {
            console.log(`   ${filename}`);
            count++;
            if (count >= 10) {
                if (skipped > 10) {
                    console.log(`   ... и еще ${skipped - 10} файлов`);
                }
                break;
            }
        }
    }
}