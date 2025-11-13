#!/bin/bash

# Скрипт для обновления эталонных скриншотов
# Использование: ./update-etalons.sh <source_folder> <target_folder>

set -e

SOURCE_FOLDER="${1:-./new-screenshots}"
TARGET_FOLDER="${2:-./apps/demos/testing/etalons}"

echo "🔄 Обновление эталонных скриншотов"
echo "📂 Источник: $SOURCE_FOLDER"
echo "📂 Назначение: $TARGET_FOLDER"
echo ""

# Проверяем существование папок
if [ ! -d "$SOURCE_FOLDER" ]; then
    echo "❌ Папка с новыми скриншотами не найдена: $SOURCE_FOLDER"
    exit 1
fi

if [ ! -d "$TARGET_FOLDER" ]; then
    echo "❌ Папка с эталонами не найдена: $TARGET_FOLDER"
    exit 1
fi

# Подсчитываем файлы
SOURCE_COUNT=$(find "$SOURCE_FOLDER" -name "*.png" | wc -l)
TARGET_COUNT=$(find "$TARGET_FOLDER" -name "*.png" | wc -l)

echo "📊 Статистика:"
echo "   Новых скриншотов: $SOURCE_COUNT"
echo "   Текущих эталонов: $TARGET_COUNT"
echo ""

# Счетчики
UPDATED=0
SKIPPED=0
ERRORS=0

echo "🔍 Поиск совпадающих файлов..."
echo ""

# Проходим по всем PNG файлам в папке источника
find "$SOURCE_FOLDER" -name "*.png" -type f | while read -r source_file; do
    # Получаем имя файла без пути
    filename=$(basename "$source_file")
    
    # Ищем соответствующий файл в папке назначения
    target_file="$TARGET_FOLDER/$filename"
    
    if [ -f "$target_file" ]; then
        echo "✅ Обновляем: $filename"
        cp "$source_file" "$target_file"
        UPDATED=$((UPDATED + 1))
    else
        echo "⚠️  Пропускаем: $filename (эталон не найден)"
        SKIPPED=$((SKIPPED + 1))
    fi
done

echo ""
echo "📈 Результат:"
echo "   Обновлено: $UPDATED файлов"
echo "   Пропущено: $SKIPPED файлов"
echo "   Ошибок: $ERRORS"
echo ""

if [ $UPDATED -gt 0 ]; then
    echo "🎉 Эталоны успешно обновлены!"
    echo "💡 Не забудьте проверить изменения и сделать коммит:"
    echo "   git add $TARGET_FOLDER"
    echo "   git commit -m 'Update screenshot etalons'"
else
    echo "😔 Ни один эталон не был обновлен"
fi