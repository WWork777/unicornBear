#!/bin/sh

# build.sh — установит зависимости с помощью bun и выполнит сборку

echo "=========================================="
echo "Установка зависимостей и сборка проекта"
echo "=========================================="

# Проверка наличия bun в PATH
if ! command -v bun >/dev/null 2>&1; then
  echo "Bun не найден в PATH. Пожалуйста, установите Bun: https://bun.sh/"
  exit 1
fi

echo "Запуск: bun i"
if ! bun i; then
  echo "Ошибка при установке зависимостей (bun i)"
  exit 1
fi

echo "Запуск сборки (bun run build.server)"
if ! bun run build.server; then
  echo "Сборка завершилась с ошибкой."
  echo "Вы можете посмотреть логи выше. Если нужна помощь, скопируйте вывод и пришлите мне."
  exit 1
fi

echo "Сборка выполнена успешно."

# Запрос на запуск сервера
printf "Хотите запустить сервер сейчас (bun run serve)? [Y/n]: "
read -r RUNSERV

case "$RUNSERV" in
  [Yy]*|"")
    echo "Запуск: bun run serve"
    exec bun run serve
    ;;
  *)
    echo "Готово. Вы можете запустить сервер позже: bun run serve"
    ;;
esac