import {BrowserRouter, Route, Routes} from "react-router-dom"
import HomePage from "./pages/HomePage"
import EditorPage from "./pages/EditorPage"
import "./App.css"
import { Toaster } from "react-hot-toast"

export default function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/editor/:roomId" element={<EditorPage />} />
    </Routes>
    </BrowserRouter>
    <Toaster position="top-right" />
    </>
  )
}
