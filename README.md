# Rust ToDoList

Десктопный список задач на **Rust + Tauri 2**, интерфейс — **React + TypeScript + Tailwind CSS v4 + shadcn/ui + Lucide**.

## Возможности

- добавление, редактирование (кнопка ✏️ или двойной клик, Enter — сохранить, Esc — отменить), удаление задач
- отметка выполнения и прогресс «Выполнено N из M»
- закрепление задач — отдельная секция «Закреплённые» сверху
- тёмная «стеклянная» тема по макетам, шрифты Onest и Unbounded

> Бэкенд — заготовка: команды в `src-tauri/src/lib.rs` объявлены, но пока возвращают ошибку `Error::NotImplemented` (её видно в интерфейсе). Замените тела на свою логику. `todo!()` в командах не используйте: паника в Tauri-команде роняет всё приложение.

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
  lib/api.ts              типизированные обёртки над Tauri-командами
src-tauri/                бэкенд (Rust)
  src/lib.rs              модель Todo + Tauri-команды (заготовки)
  src/error.rs            тип ошибок, сериализуемый для фронтенда
```

Добавить компонент shadcn: `npx shadcn@latest add <component>`.
