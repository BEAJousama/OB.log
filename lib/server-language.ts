import { cookies } from "next/headers"
import { translations, type Language } from "@/lib/translations"

export async function getServerLanguage(): Promise<Language> {
  const store = await cookies()
  const lang = store.get("language")?.value
  return lang === "fr" || lang === "en" ? lang : "en"
}

export async function getServerTranslations() {
  const lang = await getServerLanguage()
  return translations[lang]
}
