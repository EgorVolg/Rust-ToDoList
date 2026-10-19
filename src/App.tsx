import { useState } from "react";
import { CircleAlert, ClipboardList, ListTodo, Moon, Plus, Sun, X } from "lucide-react";

import { TodoItem } from "@/components/todo-item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/use-theme";
import { useTodos } from "@/hooks/use-todos";

type Filter = "all" | "active" | "completed";

const EMPTY_TEXT: Record<Filter, string> = {
  all: "Список пуст — добавьте первую задачу",
  active: "Все задачи выполнены 🎉",
  completed: "Пока нет выполненных задач",
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { todos, loading, error, dismissError, add, toggle, rename, remove, clearCompleted } =
    useTodos();
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.length - activeCount;
  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.completed : t.completed,
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await add(title)) setTitle("");
  };

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
        <Card className="mx-auto w-full max-w-xl">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ListTodo className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Rust ToDoList</CardTitle>
                <CardDescription>
                  {activeCount > 0 ? `Осталось задач: ${activeCount}` : "Нет активных задач"}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label="Переключить тему"
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleAdd} className="flex gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Что нужно сделать?"
                aria-label="Новая задача"
                autoFocus
              />
              <Button type="submit" disabled={!title.trim()}>
                <Plus data-icon="inline-start" />
                Добавить
              </Button>
            </form>

            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
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

            <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
              <TabsList className="w-full">
                <TabsTrigger value="all">
                  Все <Badge variant="secondary">{todos.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="active">
                  Активные <Badge variant="secondary">{activeCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Готово <Badge variant="secondary">{completedCount}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {loading ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Загрузка…</p>
            ) : visible.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
                <ClipboardList className="size-10 opacity-50" />
                <p className="text-sm">{EMPTY_TEXT[filter]}</p>
              </div>
            ) : (
              <ul className="-mx-3 space-y-0.5">
                {visible.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggle}
                    onRename={rename}
                    onDelete={remove}
                  />
                ))}
              </ul>
            )}

            {completedCount > 0 && (
              <>
                <Separator />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Выполнено {completedCount} из {todos.length}
                  </span>
                  <Button variant="ghost" size="sm" onClick={clearCompleted}>
                    Очистить выполненные
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </TooltipProvider>
  );
}
