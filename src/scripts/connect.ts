/** How long the copy button says the command is copied */
const COPIED_MS = 1800

/**
 * Connect step: the agent picker rewrites the `--agent` value of the command, and the copy button copies the command
 * Button captions come from data attributes filled from the catalog, so no interface string lives here
 */
export const initConnect = (): void => {
  document.querySelectorAll<HTMLElement>('[data-connect]').forEach((root) => {
    const command = root.querySelector<HTMLElement>('[data-connect-command]')
    const agent = root.querySelector<HTMLElement>('[data-connect-agent]')
    const copy = root.querySelector<HTMLButtonElement>('[data-connect-copy]')
    const pickers = root.querySelectorAll<HTMLButtonElement>('[data-agent-id]')
    if (command === null || agent === null || copy === null) return

    pickers.forEach((picker) => {
      picker.addEventListener('click', () => {
        const id = picker.dataset.agentId
        if (id === undefined) return
        agent.textContent = id
        pickers.forEach((other) => other.setAttribute('aria-pressed', String(other === picker)))
      })
    })

    let timer: number | undefined
    copy.addEventListener('click', async () => {
      const text = command.textContent ?? ''
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        // Clipboard can be denied: select the command so the visitor copies it by hand
        const range = document.createRange()
        range.selectNodeContents(command)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
        return
      }
      copy.textContent = copy.dataset.copied ?? ''
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        copy.textContent = copy.dataset.copy ?? ''
      }, COPIED_MS)
    })
  })
}
