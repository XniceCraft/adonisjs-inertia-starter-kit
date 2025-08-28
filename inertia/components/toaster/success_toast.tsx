import { usePage } from '@inertiajs/react'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

type PageProps = { success?: string }

export default function SuccessToast() {
  const { success } = usePage<PageProps>().props
  const requestCountRef = useRef(0)

  useEffect(() => {
    if (success) {
      toast.success(success)
      requestCountRef.current += 1
    }
  }, [success, requestCountRef.current])

  return null
}
