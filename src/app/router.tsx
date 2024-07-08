import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Layout from '@/app/layout'
import MnemonicGeneration from '@/app/pages/mnemonic-generation'
import QrCode from '@/app/pages/generate-qrcode'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: MnemonicGeneration,
      },
      {
        path: 'qr',
        Component: QrCode,

      },
      {
        path: 'deferred',
        Component: MnemonicGeneration,
      },
    ],
  },
])

export { router }
