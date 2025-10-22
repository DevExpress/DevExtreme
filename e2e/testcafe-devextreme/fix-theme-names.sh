#!/bin/bash

# Скрипт для исправления названий тем в скриншотах
# Заменяет дефисы на точки в названиях тем: generic-light -> generic.light

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для показа помощи
show_help() {
    echo "Использование: $0 [ОПЦИИ] [ДИРЕКТОРИЯ]"
    echo ""
    echo "Опции:"
    echo "  -h, --help     Показать эту справку"
    echo "  -d, --dry-run  Показать что будет переименовано без выполнения"
    echo "  -v, --verbose  Подробный вывод"
    echo ""
    echo "Директория:"
    echo "  По умолчанию: ./tests/common"
    echo ""
    echo "Примеры:"
    echo "  $0                           # DRY RUN для ./tests/common"
    echo "  $0 --dry-run                 # То же самое"
    echo "  $0 ./tests/accessibility     # DRY RUN для указанной папки"
    echo "  $0 --execute                 # РЕАЛЬНОЕ переименование"
    echo "  $0 --execute ./tests/editors # РЕАЛЬНОЕ переименование в указанной папке"
}

# Функция для исправления названий тем
fix_theme_names() {
    local dir="$1"
    local dry_run="$2"
    local verbose="$3"
    local counter=0
    
    if [ ! -d "$dir" ]; then
        echo -e "${RED}Ошибка: Директория '$dir' не существует${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Обрабатываем директорию: $dir${NC}"
    echo ""
    
    # Рекурсивно ищем все PNG файлы
    while IFS= read -r -d '' file; do
        # Применяем замены для названий тем
        newname=$(echo "$file" | sed -E '
            s/\(generic-light\)/\(generic\.light\)/g
            s/\(fluent-blue-light\)/\(fluent\.blue\.light\)/g
            s/\(material-blue-light\)/\(material\.blue\.light\)/g
            s/\(generic-dark\)/\(generic\.dark\)/g
            s/\(fluent-blue-dark\)/\(fluent\.blue\.dark\)/g
            s/\(material-blue-dark\)/\(material\.blue\.dark\)/g
            s/\(generic-contrast\)/\(generic\.contrast\)/g
            s/\(generic-greenmist\)/\(generic\.greenmist\)/g
            s/\(fluent-saas-light\)/\(fluent\.saas\.light\)/g
            s/\(fluent-saas-dark\)/\(fluent\.saas\.dark\)/g
        ')
        
        if [ "$file" != "$newname" ]; then
            counter=$((counter + 1))
            
            if [ "$dry_run" = true ]; then
                echo -e "${YELLOW}[DRY RUN]${NC} $file"
                echo -e "${GREEN}    ->   ${NC} $newname"
            else
                if [ "$verbose" = true ]; then
                    echo -e "${GREEN}[RENAME]${NC} $(basename "$file")"
                    echo -e "${GREEN}    ->   ${NC} $(basename "$newname")"
                fi
                
                mv "$file" "$newname"
                
                if [ $? -eq 0 ]; then
                    if [ "$verbose" = false ]; then
                        echo -e "${GREEN}✓${NC} $(basename "$newname")"
                    fi
                else
                    echo -e "${RED}✗ Ошибка переименования: $file${NC}"
                fi
            fi
            echo ""
        fi
    done < <(find "$dir" -name "*.png" -type f -print0)
    
    if [ $counter -eq 0 ]; then
        echo -e "${GREEN}Файлы для переименования не найдены${NC}"
    else
        if [ "$dry_run" = true ]; then
            echo -e "${YELLOW}Найдено $counter файл(ов) для переименования${NC}"
            echo -e "${YELLOW}Для выполнения используйте: $0 --execute${NC}"
        else
            echo -e "${GREEN}Переименовано $counter файл(ов)${NC}"
        fi
    fi
}

# Парсинг аргументов
DRY_RUN=true
VERBOSE=false
DIRECTORY="./tests/common"

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        --execute)
            DRY_RUN=false
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -*)
            echo -e "${RED}Неизвестная опция: $1${NC}"
            show_help
            exit 1
            ;;
        *)
            DIRECTORY="$1"
            shift
            ;;
    esac
done

# Главная логика
echo -e "${BLUE}=== Исправление названий тем в скриншотах ===${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}Режим: DRY RUN (предварительный просмотр)${NC}"
else
    echo -e "${GREEN}Режим: ВЫПОЛНЕНИЕ (реальное переименование)${NC}"
    echo -e "${RED}Внимание: Файлы будут переименованы!${NC}"
    echo -n "Продолжить? (y/N): "
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Отменено пользователем"
        exit 0
    fi
fi

echo ""
fix_theme_names "$DIRECTORY" "$DRY_RUN" "$VERBOSE"
echo ""
echo -e "${BLUE}Готово!${NC}"