/**
 * Meri Katha — server-side story text checks.
 * - Blocks: clear self-harm / crisis phrasing and a small abuse pattern set.
 * - Flags (non-blocking): clinical / diagnostic wording so the UI can nudge gently.
 */

export type StoryContentFlag = 'clinical_language'

export type StoryContentCheck =
  | { ok: true; flags: StoryContentFlag[] }
  | {
      ok: false
      code: 'CRISIS_CONTENT' | 'ABUSIVE_CONTENT'
      message: string
      showResources: boolean
    }

function normalizeForMatch(input: string): string {
  return input.normalize('NFKC').toLowerCase()
}

/** English + common Nenglish — high-precision self-harm / suicide intent phrases */
const CRISIS_PHRASES: RegExp[] = [
  // Direct intent — English
  /\bkill\s+myself\b/,
  /\bkill\s+me\s+myself\b/,
  /\bkilling\s+myself\b/,
  /\bhang\s+myself\b/,
  /\bhanging\s+myself\b/,
  /\bcut\s+my\s+(wrists?|throat)\b/,
  /\bslit\s+my\s+(wrists?|throat)\b/,
  /\bend\s+my\s+life\b/,
  /\bend\s+it\s+all\b/,
  /\btake\s+my\s+(own\s+)?life\b/,
  /\bcommit\s+suicide\b/,
  /\bgoing\s+to\s+(kill\s+myself|commit\s+suicide)\b/,
  /\boverdose\s+(on\s+purpose|intentionally)\b/,
  /\bjump\s+off\s+(the\s+)?(bridge|building|roof)\b/,
  // "wanna die" / "want to die" variations
  /\b(i\s+)?(wanna|want\s+to)\s+die\b/,
  /\b(i\s+)?don'?t\s+want\s+to\s+(live|be\s+alive|exist)\b/,
  /\b(i\s+)?want\s+to\s+(disappear|not\s+exist)\b/,
  /\b(i\s+)?(wish|hope)\s+(i\s+)?(was|were)\s+dead\b/,
  /\bbetter\s+off\s+dead\b/,
  /\bnot\s+worth\s+living\b/,
  /\bno\s+(reason|point)\s+(to|in)\s+liv(e|ing)\b/,
  /\b(i\s+)?can'?t\s+(do\s+this|take\s+it|go\s+on)\s+anymore\b/,
  // Transliterated Nepali
  /\baafno\s+jaan\s+(line|linu|lina|dinchu)\b/,
  /\bmernu\s+(chahanchu|man\s+cha|paryo)\b/,
  /\batmahatya\s+gar(na|nu|ne|chu)\b/,
  /\bmarna?\s+(man\s+lagyo|chahanchu|paryo)\b/,
  /\b(bachna|baachna)\s+(man\s+chhaina|mannai\s+chhaina)\b/,
  /\bjiune\s+man\s+chhaina\b/,
]

/** Obvious targeted harassment / slur stems (ASCII + Nepali/Hindi transliterated) */
const ABUSE_PATTERNS: RegExp[] = [
  // English slurs
  /\b(n[i1]gg[ae]r|f[a@4]gg[o0]t|ch[i1]nk)\b/,
  /\b(kys|neck\s*yourself)\b/,
  // Nepali/Hindi slurs commonly used against women
  /\b(randi|raand|besya|kutti|r[a@]ndi)\b/i,
  /\b(chutiya|bhosdi|madarc\w*|bh[o0]sdi)\b/i,
  // Slurs used as insults in Nepali context
  /\b(chakke|hijr[ae])\b/i,
]

/** Clinical / diagnostic terms — flag only, do not block */
const CLINICAL_TERMS: RegExp[] = [
  /\bptsd\b/,
  /\bbipolar\b/,
  /\bschizophrenia\b/,
  /\bocd\b/,
  /\badhd\b/,
  /\bdepress(?:ion|ed|ive)\b/,
  /\bmental\s+illness\b/,
  /\bmental\s+disorder\b/,
  /\bpanic\s+disorder\b/,
  /\banxiety\s+disorder\b/,
  /\bantidepressant\b/,
  /\bself[-\s]?harm\b/,
  /\bsuicid(?:e|al)\b/,
  /\btherapy\b/,
  /\btherapist\b/,
  /\bpsychiatr(?:y|ist)\b/,
  /\btrauma\b/,
]

export function checkStoryContent(raw: string): StoryContentCheck {
  const text = normalizeForMatch(raw)

  for (const re of ABUSE_PATTERNS) {
    if (re.test(text)) {
      return {
        ok: false,
        code: 'ABUSIVE_CONTENT',
        message:
          'Yo thau maa yasto bhasa mitho laagdaina. Krupaya arko tarika le lekhnus.',
        showResources: false,
      }
    }
  }

  for (const re of CRISIS_PHRASES) {
    if (re.test(text)) {
      return {
        ok: false,
        code: 'CRISIS_CONTENT',
        message:
          'Tapaiko kura mahatwako cha. Aba yahan post garna sakidaina — tara tapaai eklo hunuhunna. Sahara maa sampark garna saknuhuncha.',
        showResources: true,
      }
    }
  }

  const flags: StoryContentFlag[] = []
  for (const re of CLINICAL_TERMS) {
    if (re.test(text)) {
      if (!flags.includes('clinical_language')) {
        flags.push('clinical_language')
      }
      break
    }
  }

  return { ok: true, flags }
}
