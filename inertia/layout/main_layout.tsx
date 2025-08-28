import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { IoProvider } from 'socket.io-react-hook'
import { ClientProvider } from '@/context/client_provider'
import SuccessToast from '@/components/toaster/success_toast'

export default function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ClientProvider>
      <IoProvider>
        <main>
          {children}
        </main>
        <Toaster />
        <SuccessToast />
      </IoProvider>
    </ClientProvider>
  )
}
