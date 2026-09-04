import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const STORAGE_KEY = "topoffer:language";

/** Display languages a visitor can pick for the board. */
export const LANGUAGES = [
  "English",
  "Español",
  "Français",
  "Deutsch",
  "Italiano",
  "Português",
  "Português (BR)",
  "Nederlands",
  "Svenska",
  "Norsk",
  "Dansk",
  "Suomi",
  "Íslenska",
  "Polski",
  "Čeština",
  "Slovenčina",
  "Magyar",
  "Română",
  "Български",
  "Hrvatski",
  "Srpski",
  "Slovenščina",
  "Ελληνικά",
  "Türkçe",
  "Русский",
  "Українська",
  "Беларуская",
  "עברית",
  "العربية",
  "فارسی",
  "اردو",
  "हिन्दी",
  "বাংলা",
  "தமிழ்",
  "తెలుగు",
  "मराठी",
  "ગુજરાતી",
  "ಕನ್ನಡ",
  "മലയാളം",
  "සිංහල",
  "ไทย",
  "Tiếng Việt",
  "Bahasa Indonesia",
  "Bahasa Melayu",
  "Filipino",
  "中文 (简体)",
  "中文 (繁體)",
  "日本語",
  "한국어",
  "Kiswahili",
  "Afrikaans",
  "Hausa",
  "Yorùbá",
  "አማርኛ",
];

/** Language picker; remembers the visitor's choice in this browser. */
export function LanguageSelect() {
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGES.includes(stored)) setLanguage(stored);
  }, []);

  return (
    <div className="relative">
      <select
        aria-label="Language"
        value={language}
        onChange={(e) => {
          setLanguage(e.target.value);
          window.localStorage.setItem(STORAGE_KEY, e.target.value);
        }}
        className="h-10 appearance-none rounded-full border border-border bg-card pl-4 pr-9 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring/40"
      >
        {LANGUAGES.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
