import MainLayout from '@/layout/main_layout'

export default function ServerError(props: Readonly<{ error: any }>) {
  return (
    <MainLayout>
      <main className="max-w-96 w-full mt-16 text-center">
        <h1 className="font-semibold">Server Error</h1>
        <p className="mt-5">{props.error.message}</p>
      </main>
    </MainLayout>
  )
}
