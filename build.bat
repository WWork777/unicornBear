@echo off
REM build.bat — установит зависимости с помощью bun и выполнит сборку
setlocal

echo ==========================================
echo Установка зависимостей и сборка проекта
echo ==========================================

REM Проверка наличия bun в PATH
where bun >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo Bun не найден в PATH. Пожалуйста установите Bun и добавьте в PATH: https://bun.sh/
  pause
  exit /b 1
)

echo Запуск: bun i
bun i
if %ERRORLEVEL% neq 0 (
  echo Ошибка при установке зависимостей bun i
  pause
  exit /b 1
)

echo Запуск сборки (bun run build.server)
bun run build.server
if %ERRORLEVEL% neq 0 (
  echo Сборка завершилась с ошибкой (код %ERRORLEVEL%).
  echo Вы можете посмотреть логи выше. Если нужна помощь, скопируйте вывод и пришлите мне.
  pause
  exit /b %ERRORLEVEL%
)

echo Сборка выполнена успешно.

set /p RUNSERV=Хотите запустить сервер сейчас (bun run serve)? [Y/N]: 
if /i "%RUNSERV%"=="Y" (
  echo Запуск: bun run serve
  bun run serve
) else (
  echo Готово. Вы можете запустить сервер позже: bun run serve
)

endlocal
exit /b 0
