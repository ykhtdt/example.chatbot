"use client"

import {
  memo,
  useState,
  useRef,
} from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ResultAsync } from "neverthrow"
import { toast } from "sonner"
import {
  SquareIcon,
  SendIcon,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"

const FormSchema = z.object({
  message: z.string().min(1, {
    message: "메시지를 입력해주세요.",
  }),
})

interface MessageFormProps {
  onSubmit: (message: string) => Promise<void>
  onCancel: () => void
}

export const MessageForm = memo(({
  onSubmit,
  onCancel,
}: MessageFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
    },
  })

  const handleCancel = () => {
    onCancel()
    setIsLoading(false)
  }

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    const isMessageEmpty = !data.message.trim()

    if (isMessageEmpty || isLoading) {
      return
    }

    setIsLoading(true)
    form.reset({ message: "" })

    const result = await ResultAsync.fromPromise(
      onSubmit(data.message),
      (error) => error as Error
    )

    if (result.isErr()) {
      if (result.error.name !== "AbortError") {
        toast.error(result.error.message)
      }
    }

    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex gap-2">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="sr-only">
                Message
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="메시지를 입력하세요."
                  disabled={isLoading}
                  ref={(node) => {
                    field.ref(node)
                    inputRef.current = node
                    inputRef.current?.focus()
                  }}
                  data-testid="message-input"
                />
              </FormControl>
              <FormDescription className="sr-only">
                메시지를 입력하세요.
              </FormDescription>
              <FormMessage className="sr-only" />
            </FormItem>
          )}
        />
        <MessageFormButton isLoading={isLoading} onCancel={handleCancel} />
      </form>
    </Form>
  )
})

MessageForm.displayName = "MessageForm"

interface MessageFormButtonProps {
  isLoading: boolean
  onCancel: () => void
}

const MessageFormButton = ({
  isLoading,
  onCancel,
}: MessageFormButtonProps) => {
  return isLoading ? <CancelButton onCancel={onCancel} /> : <SubmitButton />
}

interface CancelButtonProps {
  onCancel: () => void
}

const CancelButton = ({
  onCancel,
}: CancelButtonProps) => {
  return (
    <Button type="button" onClick={onCancel} data-testid="cancel-button">
      <SquareIcon />
    </Button>
  )
}

const SubmitButton = () => {
  return (
    <Button type="submit" className="text-foreground bg-blue-600 hover:bg-blue-500" data-testid="submit-button">
      <SendIcon />
    </Button>
  )
}
