import { invoke } from "@tauri-apps/api/core";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  /** Pinned todos are shown in a separate section at the top. */
  pinned: boolean;
  /** Unix timestamp in milliseconds. */
  createdAt: number;
}

/** Typed wrappers around the Rust commands in `src-tauri/src/lib.rs`. */
export const api = {
  getTodos: () => invoke<Todo[]>("get_todos"),
  addTodo: (title: string) => invoke<Todo>("add_todo", { title }),
  toggleTodo: (id: number) => invoke<Todo>("toggle_todo", { id }),
  updateTodo: (id: number, title: string) => invoke<Todo>("update_todo", { id, title }),
  deleteTodo: (id: number) => invoke<void>("delete_todo", { id }),
  togglePin: (id: number) => invoke<Todo>("toggle_pin", { id }),
};
