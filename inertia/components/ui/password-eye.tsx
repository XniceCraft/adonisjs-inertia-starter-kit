import { JSX, useState } from 'react'
import { Eye, EyeClosed } from 'lucide-react'
import { Button } from './button'

interface PasswordEyeProps {
  render: (type: 'password' | 'text') => JSX.Element
}

export function PasswordEye({ render }: Readonly<PasswordEyeProps>) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      {render(show ? 'text' : 'password')}
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={() => setShow(!show)}
        className="hover:bg-transparent absolute right-2 top-1/2 -translate-y-1/2"
      >
        {show ? <EyeClosed /> : <Eye />}
      </Button>
    </div>
  )
}
