import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import { EditorPage } from '../pages/EditorPage'
import { NoteListPage } from '../pages/NoteListPage'
import { SettingsPage } from '../pages/SettingsPage'
import '../App.css'

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <p className="app-title">Note Taker</p>
          <nav className="app-nav" aria-label="Main">
            <NavLink className="nav-link" to="/" end>
              Note list
            </NavLink>
            <NavLink className="nav-link" to="/editor">
              Editor
            </NavLink>
            <NavLink className="nav-link" to="/settings">
              Settings
            </NavLink>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<NoteListPage />} />
            <Route path="/editor/:id?" element={<EditorPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
