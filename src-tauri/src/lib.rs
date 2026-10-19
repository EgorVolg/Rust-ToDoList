mod error;

use serde::{Deserialize, Serialize};

use error::{Error, Result};

/// Shape the frontend expects (see `src/lib/api.ts`).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Todo {
    pub id: u64,
    pub title: String,
    pub completed: bool,
    /// Pinned todos are shown in a separate section at the top.
    pub pinned: bool,
    /// Unix timestamp in milliseconds.
    pub created_at: u64,
}

// Stubs return `Error::NotImplemented` instead of `todo!()`:
// a panic inside a Tauri command aborts the whole app.

#[tauri::command]
fn get_todos() -> Result<Vec<Todo>> {
    // TODO: return all todos
    Err(Error::NotImplemented("get_todos"))
}

#[tauri::command]
fn add_todo(_title: String) -> Result<Todo> {
    // TODO: create a todo with `title` and return it
    Err(Error::NotImplemented("add_todo"))
}

#[tauri::command]
fn toggle_todo(_id: u64) -> Result<Todo> {
    // TODO: flip `completed` of todo `id` and return it
    Err(Error::NotImplemented("toggle_todo"))
}

#[tauri::command]
fn update_todo(_id: u64, _title: String) -> Result<Todo> {
    // TODO: rename todo `id` to `title` and return it
    Err(Error::NotImplemented("update_todo"))
}

#[tauri::command]
fn delete_todo(_id: u64) -> Result<()> {
    // TODO: delete todo `id`
    Err(Error::NotImplemented("delete_todo"))
}

#[tauri::command]
fn toggle_pin(_id: u64) -> Result<Todo> {
    // TODO: flip `pinned` of todo `id` and return it
    Err(Error::NotImplemented("toggle_pin"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_todos,
            add_todo,
            toggle_todo,
            update_todo,
            delete_todo,
            toggle_pin
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
