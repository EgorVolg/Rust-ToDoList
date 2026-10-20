mod error;

use std::{
    fs::File,
    io::{BufReader, BufWriter},
    path::{Path, PathBuf},
    sync::Mutex,
    time::{SystemTime, UNIX_EPOCH},
};

use serde::{Deserialize, Serialize};
use tauri::Manager;

use error::{Error, Result};

struct AppState {
    path: PathBuf,
    todos: Mutex<Vec<Todo>>,
}

fn load(path: &Path) -> Result<Vec<Todo>> {
    match File::open(path) {
        Ok(file) => {
            let reader = BufReader::new(file);
            let todos: Vec<Todo> = serde_json::from_reader(reader)?;
            Ok(todos)
        }
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(Vec::new()),
        Err(e) => Err(e.into()),
    }
}

fn save(path: &Path, todos: &[Todo]) -> Result<()> {
    let file = File::create(path)?;
    let writer = BufWriter::new(file);
    serde_json::to_writer_pretty(writer, todos)?;
    Ok(())
}

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
fn get_todos(app: tauri::State<AppState>) -> Result<Vec<Todo>> {
    let todos = app.todos.lock().unwrap();

    Ok(todos.clone())
}

#[tauri::command]
fn add_todo(app: tauri::State<AppState>, title: String) -> Result<Todo> {
    let title = title.trim().to_string();
    if title.is_empty() {
        return Err(Error::EmptyTitle);
    }

    let mut todos = app.todos.lock().unwrap();
    let id = todos.iter().map(|t| t.id).max().unwrap_or(0) + 1;
    let created_at = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis() as u64;

    let new_todo = Todo {
        id,
        pinned: false,
        title,
        completed: false,
        created_at,
    };

    todos.push(new_todo.clone());
    save(&app.path, &todos)?;

    Ok(new_todo)
}

#[tauri::command]
fn toggle_todo(app: tauri::State<AppState>, id: u64) -> Result<Todo> {
    let mut todos = app.todos.lock().unwrap();
    let todo = todos
        .iter_mut()
        .find(|t| t.id == id)
        .ok_or(Error::NotFound(id))?;
    todo.completed = !todo.completed;

    let toggled_todo = todo.clone();
    save(&app.path, &todos)?;

    Ok(toggled_todo)
}

#[tauri::command]
fn update_todo(app: tauri::State<AppState>, id: u64, title: String) -> Result<Todo> {
    let title = title.trim().to_string();
    if title.is_empty() {
        return Err(Error::EmptyTitle);
    }

    let mut todos = app.todos.lock().unwrap();
    let todo = todos
        .iter_mut()
        .find(|t| t.id == id)
        .ok_or(Error::NotFound(id))?;

    todo.title = title;

    let updated_todo = todo.clone();
    save(&app.path, &todos)?;

    Ok(updated_todo)
}

#[tauri::command]
fn delete_todo(app: tauri::State<AppState>, id: u64) -> Result<()> {
    let mut todos = app.todos.lock().unwrap();
    let index = todos
        .iter()
        .position(|t| t.id == id)
        .ok_or(Error::NotFound(id))?;
    todos.remove(index);
    save(&app.path, &todos)?;
    Ok(())
}

#[tauri::command]
fn toggle_pin(app: tauri::State<AppState>, id: u64) -> Result<Todo> {
    let mut todos = app.todos.lock().unwrap();
    let todo = todos
        .iter_mut()
        .find(|t| t.id == id)
        .ok_or(Error::NotFound(id))?;
    todo.pinned = !todo.pinned;

    let pinned = todo.clone();
    save(&app.path, &todos)?;

    Ok(pinned)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let dir = app.path().app_data_dir()?;
            std::fs::create_dir_all(&dir)?;
            let path = dir.join("todos.json");
            let todos = load(&path)?;
            app.manage(AppState {
                path,
                todos: Mutex::new(todos),
            });
            Ok(())
        })
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
