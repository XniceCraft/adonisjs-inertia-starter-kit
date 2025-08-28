import MainLayout from '@/layout/main_layout'

export default function NotFound() {
  return (
    <MainLayout>
      <main className="max-w-96 w-full mt-16 text-center">
        <h1 className="font-semibold">Page not found</h1>
        <p className='mt-5'>This page does not exist.</p>
      </main>
    </MainLayout>
  )
}
