'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { InertiaFormProps } from '@inertiajs/react'

// From inertia defs
type FormDataConvertible =
  | Array<FormDataConvertible>
  | {
      [key: string]: FormDataConvertible
    }
  | Blob
  | FormDataEntryValue
  | Date
  | boolean
  | number
  | null
  | undefined

type FormDataType = Record<string, FormDataConvertible>

const FormContext = React.createContext<InertiaFormProps<FormDataType> | undefined>(undefined)

function Form<TForm extends FormDataType>({
  children,
  form,
}: Readonly<{
  children: React.ReactNode
  form: InertiaFormProps<TForm>
}>) {
  return (
    <FormContext.Provider
      value={form as unknown as InertiaFormProps<FormDataType>}
    >
      {children}
    </FormContext.Provider>
  )
}

type ChangeEventType = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

type FormFieldContextValue<TFieldName extends string = string> = {
  name: TFieldName
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

const FormField = <TFieldName extends string = string>({
  name,
  render,
  children,
}: {
  name: TFieldName
  render?: (props: {
    field: {
      name: TFieldName
      value: any
      onChange: (event: ChangeEventType | FormDataConvertible) => void
    }
    fieldState: {
      invalid: boolean
      error?: { message?: string }
    }
    formState: {
      isSubmitting: boolean
    }
  }) => React.ReactNode
  children?: React.ReactNode
}) => {
  const contextValue = React.useMemo(() => ({ name }), [name])
  const form = React.useContext(FormContext)

  if (!form) {
    throw new Error('FormField must be used within <Form>')
  }

  if (render) {
    const value = form.data[name]
    const error = form.errors[name]

    const field = {
      name,
      value: value ?? '',
      onChange: (event: ChangeEventType | FormDataConvertible) => {
        const formEvent = event as ChangeEventType
        if (formEvent?.target) form.setData(name as string, formEvent.target.value)
        else form.setData(name as string, event as FormDataConvertible)
      },
    }

    const fieldState = {
      invalid: !!error,
      error: error ? { message: error } : undefined,
    }

    const formState = {
      isSubmitting: form.processing,
    }

    return (
      <FormFieldContext.Provider value={contextValue}>
        {render({ field, fieldState, formState })}
      </FormFieldContext.Provider>
    )
  }

  return <FormFieldContext.Provider value={contextValue}>{children}</FormFieldContext.Provider>
}

type FormItemContextValue = { id: string }

const FormItemContext = React.createContext<FormItemContextValue | null>(null)

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const form = React.useContext(FormContext)

  if (!fieldContext || !itemContext) {
    throw new Error('useFormField must be used within <FormField> and <FormItem>')
  }

  if (!form) {
    throw new Error('useFormField must be used within <Form>')
  }

  const { name } = fieldContext
  const { id } = itemContext

  const value = form.data[name]
  const error = form.errors[name]

  return {
    id,
    name,
    value,
    setData: (value: FormDataConvertible) => {
      form.setData(name, value)
    },
    clearError: () => {
      form.clearErrors?.(name)
    },
    error,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
  }
}

const FormItem = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const id = React.useId()
  const contextValue = React.useMemo(() => ({ id }), [id])

  return (
    <FormItemContext.Provider value={contextValue}>
      <div className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  )
}

const FormLabel = ({
  className,
  required,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean }) => {
  const { formItemId, error } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    >
      {props.children}
      {required && <span className="text-destructive ml-1">*</span>}
    </Label>
  )
}

const FormControl = ({ ...props }: React.ComponentProps<typeof Slot>) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  )
}

const FormDescription = ({ className, ...props }: React.ComponentProps<'p'>) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

const FormMessage = ({ className, children, ...props }: React.ComponentProps<'p'>) => {
  const { error, formMessageId } = useFormField()
  const body = error ?? children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
  useFormField,
}
