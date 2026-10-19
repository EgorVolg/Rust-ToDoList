import { useEffect, useRef, useState } from "react";
import { Pencil, Pin, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { Todo } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onTogglePin: (id: number) => void;
  onRename: (id: number, title: string) => Promise<boolean>;
  onDelete: (id: number) => void;
}

const actionClass =
  "size-9 rounded-xl text-[#c9bbea] opacity-50 hover:bg-white/8 hover:text-[#f6f2ff] hover:opacity-100 focus-visible:opacity-100 [&_svg:not([class*='size-'])]:size-[18px]";

export function TodoItem({ todo, onToggle, onTogglePin, onRename, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const startEdit = () => {
    setDraft(todo.title);
    setEditing(true);
  };

  const save = async () => {
    if (draft.trim() === todo.title) return setEditing(false);
    if (await onRename(todo.id, draft)) setEditing(false);
  };

  return (
    <li className="group flex h-[70px] items-center gap-4 rounded-2xl px-3 transition-colors hover:bg-white/[0.04]">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label={todo.completed ? "Отметить как невыполненную" : "Отметить как выполненную"}
        className="size-6 rounded-full border-[#ddd6fe]/50 dark:bg-transparent data-checked:border-primary [&_svg]:stroke-3"
      />

      {editing ? (
        <form
          className="flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <Input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
            onBlur={() => setEditing(false)}
            className="h-10 rounded-xl border-white/10 bg-[#0c0616]/40 text-base md:text-base"
            aria-label="Новое название"
          />
        </form>
      ) : (
        <p
          onDoubleClick={startEdit}
          title={todo.title}
          className={cn(
            "min-w-0 flex-1 truncate text-base text-[#f1ebff] transition-colors",
            todo.completed && "text-[#9d8fc2] line-through",
          )}
        >
          {todo.title}
        </p>
      )}

      <div className="flex gap-2.5">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onTogglePin(todo.id)}
          aria-label={todo.pinned ? "Открепить" : "Закрепить"}
          aria-pressed={todo.pinned}
          className={cn(actionClass, todo.pinned && "text-primary opacity-100")}
        >
          <Pin fill={todo.pinned ? "currentColor" : "none"} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={startEdit}
          aria-label="Изменить"
          className={actionClass}
        >
          <Pencil />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDelete(todo.id)}
          aria-label="Удалить"
          className={cn(actionClass, "hover:text-destructive")}
        >
          <Trash2 />
        </Button>
      </div>
    </li>
  );
}
