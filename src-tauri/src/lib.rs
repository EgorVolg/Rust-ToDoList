mod error;

use serde::{Deserialize, Serialize};

use error::Result;

/// Shape the frontend expects (see `src/lib/api.ts`).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Todo {
    pub id: u64,
    pub title: String,
    pub completed: bool,
    /// Unix timestamp in milliseconds.
    pub created_at: u64,
}

#[tauri::command]
fn get_todos() -> Result<Vec<Todo>> {
    todo!("return all todos")
}

#[tauri::command]
fn add_todo(title: String) -> Result<Todo> {
    todo!("create a todo with {title:?} and return it")
}

#[tauri::command]
fn toggle_todo(id: u64) -> Result<Todo> {
    todo!("flip `completed` of todo #{id} and return it")
}

#[tauri::command]
fn update_todo(id: u64, title: String) -> Result<Todo> {
    todo!("rename todo #{id} to {title:?} and return it")
}

#[tauri::command]
fn delete_todo(id: u64) -> Result<()> {
    todo!("delete todo #{id}")
}

#[tauri::command]
fn clear_completed() -> Result<usize> {
    todo!("remove completed todos and return how many were removed")
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
            clear_completed
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
