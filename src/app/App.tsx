import Layout from '@/app/layout'
import { Home } from 'lucide-react'
import { Routes, Route } from 'react-router-dom'
import MnemonicGeneration from '@/app/pages/mnemonic-generation'
import QrCode from '@/app/pages/generate-qrcode'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MnemonicGeneration />} />
          <Route path="qr" element={<QrCode />} />
          <Route path="*" element={<MnemonicGeneration />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
