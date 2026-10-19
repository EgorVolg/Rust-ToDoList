use serde::{Serialize, Serializer};

/// Add your own variants here (e.g. not found, empty title).
#[derive(Debug, thiserror::Error)]
pub enum Error {
    /// Returned by command stubs until they are implemented.
    #[error("Команда `{0}` ещё не реализована")]
    NotImplemented(&'static str),
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Json(#[from] serde_json::Error),
}

/// Errors reach the frontend as plain message strings.
impl Serialize for Error {
    fn serialize<S: Serializer>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error> {
        serializer.serialize_str(&self.to_string())
    }
}

pub type Result<T> = std::result::Result<T, Error>;
