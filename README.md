# Rust ToDoList

Десктопный список задач на **Rust + Tauri 2**, интерфейс — **React + TypeScript + Tailwind CSS v4 + shadcn/ui + Lucide**.

## Возможности

- добавление, редактирование (кнопка ✏️ или двойной клик), удаление задач
- отметка выполнения, фильтры «Все / Активные / Готово» со счётчиками
- очистка выполненных задач
- светлая и тёмная темы

> Бэкенд — заготовка: команды в `src-tauri/src/lib.rs` объявлены, но тела — `todo!()`. Пока они не реализованы, вызов любой команды из UI приведёт к панике.

## Требования

- [Rust](https://rustup.rs/) (stable)
- Node.js 20+
- [зависимости Tauri](https://tauri.app/start/prerequisites/) для вашей ОС (на Windows — WebView2 и MSVC Build Tools)

## Запуск

```bash
npm install
npm run tauri dev      # режим разработки
npm run tauri build    # релизная сборка + установщик
```

## Структура

```
src/                      фронтенд (React)
  App.tsx                 главный экран
  components/todo-item.tsx
  components/ui/          компоненты shadcn/ui
  hooks/use-todos.ts      состояние списка + вызовы бэкенда
  hooks/use-theme.ts      светлая/тёмная тема
  lib/api.ts              типизированные обёртки над Tauri-командами
src-tauri/                бэкенд (Rust)
  src/lib.rs              модель Todo + Tauri-команды (заготовки todo!())
  src/error.rs            тип ошибок, сериализуемый для фронтенда
```

Добавить компонент shadcn: `npx shadcn@latest add <component>`.
