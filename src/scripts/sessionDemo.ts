import { motionAllowed } from './motion'

/** Stage lengths of the session story, in milliseconds; stage 4 lasts as long as the typing takes */
const STAGE_MS = {
  laptop: 2400,
  closing: 1100,
  transfer: 1500,
  wake: 900,
  thinking: 800,
  hold: 3200,
} as const

/** Delay between typed characters */
const TYPE_MS = 32

const sleep = (ms: number, signal: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      window.clearTimeout(timer)
      reject(signal.reason)
    })
  })

/**
 * Plays the "same session on another computer" story by switching `data-stage`; CSS draws each stage
 * The story restarts from the open laptop each time the figure scrolls into view and stops once it leaves
 * With reduced motion nothing runs, and the markup's final state stays: laptop closed, conversation continued
 */
export const initSessionDemo = (): void => {
  if (!motionAllowed()) return

  document.querySelectorAll<HTMLElement>('[data-session-demo]').forEach((root) => {
    const target = root.querySelector<HTMLElement>('[data-type-target]')
    const typed = target?.querySelector<HTMLElement>('.typed')
    const fullText = target?.dataset.text ?? ''
    if (typed === undefined || typed === null) return

    let controller: AbortController | undefined

    const setStage = (stage: number): void => {
      root.dataset.stage = String(stage)
    }

    const play = async (signal: AbortSignal): Promise<void> => {
      for (;;) {
        root.classList.remove('is-waiting')
        typed.textContent = ''
        setStage(0)
        await sleep(STAGE_MS.laptop, signal)
        setStage(1)
        await sleep(STAGE_MS.closing, signal)
        setStage(2)
        await sleep(STAGE_MS.transfer, signal)
        setStage(3)
        await sleep(STAGE_MS.wake, signal)
        root.classList.add('is-waiting')
        setStage(4)
        await sleep(STAGE_MS.thinking, signal)
        root.classList.remove('is-waiting')
        for (let i = 1; i <= fullText.length; i += 1) {
          typed.textContent = fullText.slice(0, i)
          await sleep(TYPE_MS, signal)
        }
        setStage(5)
        await sleep(STAGE_MS.hold, signal)
      }
    }

    // Stage 0 before the figure is reached, so the story starts from its beginning
    typed.textContent = ''
    setStage(0)

    root.addEventListener('playchange', (event) => {
      const visible = (event as CustomEvent<boolean>).detail
      controller?.abort()
      controller = undefined
      if (!visible) return
      controller = new AbortController()
      play(controller.signal).catch(() => {
        // Aborted: the figure left the screen
      })
    })
  })
}
