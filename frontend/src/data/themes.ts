export const THEMES = [
  { value: 'harassment', ne: 'यौन उत्पीडन', en: 'Sexual Harassment' },
  { value: 'postpartum', ne: 'सुत्केरी मन',  en: 'Postpartum' },
  { value: 'domestic',   ne: 'घरायसी कुरा',  en: 'Domestic' },
  { value: 'career',     ne: 'करियर दबाब',  en: 'Career Pressure' },
  { value: 'diaspora',   ne: 'परदेश जीवन',  en: 'Diaspora Life' },
  { value: 'general',    ne: 'मनको कुरा',   en: 'General' },
] as const

export type ThemeValue = typeof THEMES[number]['value']
