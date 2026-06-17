import { Routes, Route, Navigate } from 'react-router-dom'
import { TotemApp } from './totem/TotemApp'
import { Validador } from './validador/Validador'

export default function App() {
  return (
    <Routes>
      {/* O sistema da TV (máquina de estados, sem URL interna) vive em /play */}
      <Route path="/play" element={<TotemApp />} />
      {/* Validador de QR com câmera */}
      <Route path="/validador" element={<Validador />} />
      {/* Raiz redireciona para o totem */}
      <Route path="/" element={<Navigate to="/play" replace />} />
      <Route path="*" element={<Navigate to="/play" replace />} />
    </Routes>
  )
}
