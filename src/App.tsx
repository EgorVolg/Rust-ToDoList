import { useState, type ReactNode } from "react";
import { Check, CircleAlert, List, Pin, Plus, X } from "lucide-react";

import { TodoItem } from "@/components/todo-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTodos } from "@/hooks/use-todos";
import type { Todo } from "@/lib/api";
import { cn } from "@/lib/utils";

const glass = "rounded-3xl border border-white/12 bg-white/6 backdrop-blur-xl";

function todayLabel() {
  const text = new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Unfinished first, then by creation time. */
function byStatus(a: Todo, b: Todo) {
  return Number(a.completed) - Number(b.completed) || a.createdAt - b.createdAt;
}

export default function App() {
  const {
    todos,
    loading,
    error,
    dismissError,
    add,
    toggle,
    togglePin,
    rename,
    remove,
  } = useTodos();
  const [title, setTitle] = useState("");

  const completedCount = todos.filter((t) => t.completed).length;
  const progress = todos.length ? (completedCount / todos.length) * 100 : 0;
  const pinned = todos.filter((t) => t.pinned).sort(byStatus);
  const others = todos.filter((t) => !t.pinned).sort(byStatus);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await add(title)) setTitle("");
  };

  const renderItems = (list: Todo[]) => (
    <ul className="mt-2">
      {list.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggle}
          onTogglePin={togglePin}
          onRename={rename}
          onDelete={remove}
        />
      ))}
    </ul>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        {todos.length > 0 && (
          <div className="absolute -top-[220px] -left-[160px] size-[620px] rounded-full bg-[#6d28d9] opacity-55 blur-[110px]" />
        )}
        <div className="absolute top-[260px] -right-[140px] size-[520px] rounded-full bg-[#a21caf] opacity-35 blur-[120px]" />
        <div className="absolute -bottom-[340px] left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-[#4338ca] opacity-45 blur-[120px]" />
      </div>

      <main className="relative mx-auto flex w-full max-w-[792px] flex-col gap-7 px-4 pt-16 pb-10">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm tracking-[0.04em] text-muted-foreground">
              {todayLabel()}
            </p>
            <h1 className="mt-2 font-heading text-[44px] leading-none font-semibold tracking-[-0.01em]">
              Мои задачи
            </h1>
          </div>
          {todos.length > 0 && (
            <div className="w-[237px] rounded-[18px] border border-white/12 bg-white/6 px-[18px] py-3.5 backdrop-blur-xl">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-[#c2b3e6]">Выполнено</span>
                <span className="text-[15px] font-semibold">
                  {completedCount} из {todos.length}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </header>

        <form
          onSubmit={handleAdd}
          className={cn(glass, "flex gap-2.5 rounded-[22px] p-[11px]")}
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Что нужно сделать?"
            aria-label="Новая задача"
            autoFocus
            className="h-[51px] flex-1 rounded-[14px] border-white/10 bg-[#0c0616]/40 px-[18px] text-base placeholder:text-[#9a8bc2] md:text-base dark:bg-[#0c0616]/40"
          />
          <Button
            type="submit"
            disabled={!title.trim()}
            className="h-[52px] rounded-[14px] px-[18px] text-[15px] font-semibold disabled:opacity-45 [&_svg:not([class*='size-'])]:size-[18px]"
          >
            <Plus data-icon="inline-start" />
            Добавить
          </Button>
        </form>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive backdrop-blur-xl"
          >
            <CircleAlert className="size-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={dismissError}
              aria-label="Скрыть ошибку"
            >
              <X />
            </Button>
          </div>
        )}

        {loading ? (
          <div className={cn(glass, "py-16 text-center text-muted-foreground")}>
            Загрузка…
          </div>
        ) : todos.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {pinned.length > 0 && (
              <Section
                icon={<Pin className="size-4" fill="currentColor" />}
                label="Закреплённые"
                count={pinned.length}
                className="border-[#c4b5fd]/28 bg-[#a78bfa]/10 [&_[data-slot=section-icon]]:text-primary"
              >
                {renderItems(pinned)}
              </Section>
            )}
            {others.length > 0 && (
              <Section
                icon={<List className="size-4" />}
                label="Остальные"
                count={others.length}
              >
                {renderItems(others)}
              </Section>
            )}
          </>
        )}

        <footer className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[13px] text-[#a898cf]">
          <span className="flex items-center gap-2">
            <Kbd>Enter</Kbd> добавить или сохранить
          </span>
          <span className="flex items-center gap-2">
            <Kbd>Esc</Kbd> отменить правку
          </span>
        </footer>
      </main>
    </div>
  );
}

function Section({
  icon,
  label,
  count,
  className,
  children,
}: {
  icon: ReactNode;
  label: string;
  count: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn(glass, "px-3 pt-5 pb-2", className)}>
      <h2 className="flex items-center gap-2.5 px-3 text-[13px] font-semibold tracking-[0.08em] text-[#c9bbea] uppercase">
        <span data-slot="section-icon">{icon}</span>
        {label}
        <span className="flex h-5 min-w-[22px] items-center justify-center rounded-full bg-white/8 px-2 text-xs tracking-normal text-[#dcd2f7]">
          {count}
        </span>
      </h2>
      {children}
    </section>
  );
}

function EmptyState() {
  return (
    <div
      className={cn(glass, "flex flex-col items-center px-6 py-16 text-center")}
    >
      <div className="flex size-[65px] items-center justify-center rounded-[20px] border border-primary/25 bg-primary/12 text-primary">
        <Check className="size-7" />
      </div>
      <h2 className="mt-8 font-heading text-xl font-medium">Список пуст</h2>
      <p className="mt-4 max-w-[330px] text-[15px] leading-[1.5] text-muted-foreground">
        Добавьте первую задачу в поле выше — она появится здесь.
      </p>
    </div>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-md border border-white/14 bg-white/8 px-2 py-0.5 font-sans text-xs text-[#e4dbff]">
      {children}
    </kbd>
  );
}
