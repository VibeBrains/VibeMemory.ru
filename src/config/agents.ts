/**
 * Agents the landing names
 * Names are product names and stay the same in every language, so they live here and not in the catalogs
 * `id` is the value the cabinet accepts in `--agent`; entries without it are MCP clients shown in the list only
 */
export interface Agent {
  readonly name: string
  readonly id?: string
}

export const agents: readonly Agent[] = [
  { name: 'Claude Code', id: 'claude-code' },
  { name: 'Codex', id: 'codex' },
  { name: 'Cursor', id: 'cursor' },
  { name: 'Zed', id: 'zed' },
  { name: 'Cline', id: 'cline' },
  { name: 'VibeIDE', id: 'vibeide' },
  { name: 'VibeIDEA', id: 'vibeidea' },
  { name: 'Gemini CLI' },
]

/** Agents the cabinet can issue a token for */
export const connectableAgents = agents.filter((agent): agent is Required<Agent> => agent.id !== undefined)

/** Agent picked in the connect command before the visitor chooses another */
export const DEFAULT_CONNECT_AGENT = 'claude-code'
