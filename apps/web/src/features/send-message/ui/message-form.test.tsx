import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest"
import {
  render,
  screen,
  cleanup,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { MessageForm } from "./message-form"

// @ts-expect-error: Testing Library v14와 Vitest 간의 호환성 문제 해결
// 참고: https://github.com/testing-library/react-testing-library/issues/1197
globalThis.jest = vi

/**
 * 사용자 인터랙션에 의한 핵심에 대해 렌더링 테스트를 진행한다.
 * MessageForm은
 *   1. 전송할 메시지를 작성할 수 있는 Input
 *   2. 작성한 메시지를 제출할 수 있는 Button
 *   3. 제출한 메시지를 취소할 수 있는 Button
 * 이 사용자 인터랙션에 의한 핵심 렌더링 요소이다.
 *
 * 부가적인 피드백 요소는 렌더링 테스트를 진행하지 않는다.
 * 예를들면, 메시지 전송 후 예기치 못한 에러가 발생하여 에러 메시지를 보여주는 Toast가 있다.
 *
 */
describe("MessageForm이 정상적으로 렌더링 되어야 한다.", () => {
  const handleSubmit = vi.fn().mockImplementation(
    () => new Promise(resolve => {
      setTimeout(() => resolve("응답 완료"), 100)
    })
  )

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    cleanup()
  })

  it("메시지를 입력할 수 있는 Input이 렌더링 되어야 한다.", () => {
    render(<MessageForm onSubmit={handleSubmit} />)

    const messageInput = screen.getByTestId("message-input")

    expect(messageInput).toBeDefined()
    expect(messageInput).toBeInstanceOf(HTMLInputElement)
  })

  it("입력한 메시지를 제출할 수 있는 Button이 렌더링 되어야 한다.", () => {
    render(<MessageForm onSubmit={handleSubmit} />)

    const submitButton = screen.getByTestId("submit-button")

    expect(submitButton).toBeDefined()
    expect(submitButton).toBeInstanceOf(HTMLButtonElement)
  })

  it("제출한 메시지를 취소할 수 있는 Button이 렌더링 되어야 한다.", async () => {
    render(<MessageForm onSubmit={handleSubmit} />)

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

    const messageInput = screen.getByTestId("message-input")
    const submitButton = screen.getByTestId("submit-button")

    await user.type(messageInput, "테스트 메시지")
    await user.click(submitButton)

    const cancelButton = await screen.findByTestId("cancel-button")

    expect(cancelButton).toBeDefined()
    expect(cancelButton).toBeInstanceOf(HTMLButtonElement)
  })

  it("응답 완료 후 다시 제출 버튼이 렌더링되어야 한다.", async () => {
    render(<MessageForm onSubmit={handleSubmit} />)

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

    const messageInput = screen.getByTestId("message-input")
    const submitButton = screen.getByTestId("submit-button")

    await user.type(messageInput, "테스트 메시지")
    await user.click(submitButton)

    vi.advanceTimersByTime(150)

    vi.runAllTicks()

    const newSubmitButton = await screen.findByTestId("submit-button")
    expect(newSubmitButton).toBeDefined()
    expect(newSubmitButton).toBeInstanceOf(HTMLButtonElement)
  })
})

/**
 * 사용자 인터랙션에 의한 핵심에 대해 기능 테스트를 진행한다.
 */
