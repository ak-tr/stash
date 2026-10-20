import type { Extension } from "@codemirror/state"
import { StreamLanguage } from "@codemirror/language"
import { json } from "@codemirror/lang-json"
import { typescript, javascript } from "@codemirror/legacy-modes/mode/javascript"
import { go } from "@codemirror/legacy-modes/mode/go"
import { python } from "@codemirror/legacy-modes/mode/python"
import { java, kotlin, c, cpp, csharp, scala } from "@codemirror/legacy-modes/mode/clike"

const stream = (mode: unknown) => StreamLanguage.define(mode as any)

// Syntax key -> editor language. Keys are what's stored with each stash.
export const languages: Record<string, Extension> = {
  typescript: stream(typescript),
  javascript: stream(javascript),
  // lang-json tells keys from values; the legacy mode only sees strings
  json: json(),
  python: stream(python),
  go: stream(go),
  java: stream(java),
  kotlin: stream(kotlin),
  c: stream(c),
  cpp: stream(cpp),
  csharp: stream(csharp),
  scala: stream(scala),
}

const names: Record<string, string> = { typescript: "TypeScript", javascript: "JavaScript", json: "JSON", cpp: "C++", csharp: "C#" }
export const syntaxName = (key: string) => names[key] ?? (key ? key[0].toUpperCase() + key.slice(1) : "Plain text")
