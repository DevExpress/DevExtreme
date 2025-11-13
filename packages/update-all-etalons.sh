#!/bin/bash

# Скрипт для обновления всех эталонов из папок compared-screenshots

cd "$(dirname "$0")/.."

DOWNLOADS_DIR=~/Downloads
TARGET_DIR=./e2e/testcafe-devextreme

echo "🔄 Начинаем обновление эталонов из всех папок compared-screenshots"
echo ""

# Массив с папками для обработки
folders=(
  "compared-screenshots-chat"
  "compared-screenshots-chat - fluent"
  "compared-screenshots-chat - material"
  "compared-screenshots-common (1)"
  "compared-screenshots-common - fluent (1)"
  "compared-screenshots-common - material (1)"
  "compared-screenshots-dataGrid - common (1-5)"
  "compared-screenshots-dataGrid - common (2-5)"
  "compared-screenshots-dataGrid - common (5-5)"
  "compared-screenshots-editors - fluent (1-3)"
  "compared-screenshots-editors - material (1-3)"
  "compared-screenshots-editors (1-3)"
  "compared-screenshots-fileManager"
  "compared-screenshots-filterBuilder - material"
  "compared-screenshots-form - fluent (2-2)"
  "compared-screenshots-form - fluent (2-2) 2"
  "compared-screenshots-form - material (2-2)"
  "compared-screenshots-form (2-2)"
  "compared-screenshots-gantt"
  "compared-screenshots-htmlEditor"
  "compared-screenshots-htmlEditor - fluent"
  "compared-screenshots-htmlEditor - material"
  "compared-screenshots-pivotGrid - material"
  "compared-screenshots-scheduler - common (4-6)"
  "compared-screenshots-scheduler - common (5-6)"
  "compared-screenshots-scheduler - common (6-6)"
  "compared-screenshots-scheduler - timezones (America-Los_Angeles)"
  "compared-screenshots-scheduler - timezones (Europe-Berlin)"
)

total_updated=0
total_skipped=0
total_errors=0
processed_folders=0
skipped_folders=0

for folder in "${folders[@]}"; do
  folder_path="$DOWNLOADS_DIR/$folder"
  
  if [ ! -d "$folder_path" ]; then
    echo "⚠️  Папка не найдена: $folder"
    echo ""
    ((skipped_folders++))
    continue
  fi
  
  file_count=$(find "$folder_path" -type f -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
  
  if [ "$file_count" -eq 0 ]; then
    echo "⏭️  Пропускаем пустую папку: $folder"
    echo ""
    ((skipped_folders++))
    continue
  fi
  
  echo "📁 Обрабатываем: $folder ($file_count файлов)"
  
  # Запускаем скрипт обновления
  node packages/update-etalons.js "$folder_path" "$TARGET_DIR" > /tmp/update-etalons-output.txt 2>&1
  
  # Извлекаем статистику из вывода
  updated=$(grep "Обновлено:" /tmp/update-etalons-output.txt | grep -o '[0-9]\+' | head -1)
  skipped=$(grep "Пропущено:" /tmp/update-etalons-output.txt | grep -o '[0-9]\+' | head -1)
  errors=$(grep "Ошибок:" /tmp/update-etalons-output.txt | grep -o '[0-9]\+' | head -1)
  
  # Если не удалось извлечь значения, устанавливаем 0
  updated=${updated:-0}
  skipped=${skipped:-0}
  errors=${errors:-0}
  
  echo "   ✅ Обновлено: $updated"
  echo "   ⚠️  Пропущено: $skipped"
  echo "   ❌ Ошибок: $errors"
  echo ""
  
  ((total_updated += updated))
  ((total_skipped += skipped))
  ((total_errors += errors))
  ((processed_folders++))
done

echo "═══════════════════════════════════════════════════"
echo "📊 ИТОГОВАЯ СТАТИСТИКА"
echo "═══════════════════════════════════════════════════"
echo "Обработано папок: $processed_folders"
echo "Пропущено папок: $skipped_folders"
echo ""
echo "Всего обновлено файлов: $total_updated"
echo "Всего пропущено файлов: $total_skipped"
echo "Всего ошибок: $total_errors"
echo ""
echo "🎉 Обновление завершено!"
echo ""
echo "💡 Не забудьте проверить изменения и сделать коммит:"
echo "   git add $TARGET_DIR"
echo "   git commit -m \"Update screenshot etalons from all compared-screenshots folders\""
