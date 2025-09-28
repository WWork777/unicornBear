@echo off
REM delete.bat — удаляет временные файлы и папки сборки
REM Не удаляет node_modules, package-lock.json и т.п.
setlocal
echo ==========================================
echo Удаление временных файлов и папок проекта
echo ==========================================

REM Helper: удаляет каталог, если он существует
:rm_dir
if exist "%~1" (
  rd /s /q "%~1" && echo Удалена папка %~1 || echo Не удалось удалить %~1
) else (
  echo Папка %~1 не найдена
)
goto :eof

call :rm_dir "tmp"
call :rm_dir "server"
call :rm_dir "dist"
call :rm_dir "build"
call :rm_dir ".vite"
call :rm_dir "node_modules\.vite"

REM Удаляем временные вспомогательные файлы
if exist "tsconfig.tsbuildinfo" (
  del /f /q "tsconfig.tsbuildinfo" && echo Удалён tsconfig.tsbuildinfo
) else echo tsconfig.tsbuildinfo не найден

if exist "tmp\tsconfig.tsbuildinfo" (
  del /f /q "tmp\tsconfig.tsbuildinfo" && echo Удалён tmp\tsconfig.tsbuildinfo
)

echo Очистка завершена.
echo Если хотите удалить другие артефакты, отредактируйте этот скрипт.
endlocal
exit /b 0
