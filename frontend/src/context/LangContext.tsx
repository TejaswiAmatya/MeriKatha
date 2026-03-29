import { createContext, useContext, useState, type ReactNode } from 'react'

type Lang = 'ne' | 'en'

interface LangContextType {
  lang: Lang
  toggle: () => void
}

const LangContext = createContext<LangContextType | null>(null)

// Module-level cache so translations survive re-renders and component unmounts
export const translationCache = new Map<string, string>()

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ne')
  return (
    <LangContext.Provider value={{ lang, toggle: () => setLang((l) => (l === 'ne' ? 'en' : 'ne')) }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
