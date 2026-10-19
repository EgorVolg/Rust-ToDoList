import { useCallback, useEffect, useState } from "react";

import { api, type Todo } from "@/lib/api";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getTodos()
      .then(setTodos)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  /** Runs a backend call, surfacing its error message instead of throwing. */
  const run = useCallback(
    async <T>(call: () => Promise<T>): Promise<T | undefined> => {
      try {
        const result = await call();
        setError(null);
        return result;
      } catch (e) {
        setError(String(e));
        return undefined;
      }
    },
    [],
  );

  const replace = (updated: Todo) =>
    setTodos((list) => list.map((t) => (t.id === updated.id ? updated : t)));

  return {
    todos,
    loading,
    error,
    dismissError: () => setError(null),

    add: async (title: string) => {
      const todo = await run(() => api.addTodo(title));
      if (todo) setTodos((list) => [...list, todo]);
      return Boolean(todo);
    },
    toggle: async (id: number) => {
      const todo = await run(() => api.toggleTodo(id));
      if (todo) replace(todo);
    },
    togglePin: async (id: number) => {
      const todo = await run(() => api.togglePin(id));
      if (todo) replace(todo);
    },
    rename: async (id: number, title: string) => {
      const todo = await run(() => api.updateTodo(id, title));
      if (todo) replace(todo);
      return Boolean(todo);
    },
    remove: async (id: number) => {
      const ok = await run(async () => {
        await api.deleteTodo(id);
        return true;
      });
      if (ok) setTodos((list) => list.filter((t) => t.id !== id));
    },
  };
}
