import type { Circle, Flair, Story } from '../types/feed'

export const circles: Circle[] = [
  { id: 'NayaAama',     name: 'नया आमा',     enName: 'New Mothers',    initial: 'न', color: 'bg-himalayan', slug: 'naya-aama'     },
  { id: 'Pardesh',      name: 'परदेश',        enName: 'Diaspora',        initial: 'प', color: 'bg-maroon',    slug: 'pardesh'       },
  { id: 'SathiCircle',  name: 'साथी',         enName: 'Sathi Circle',    initial: 'स', color: 'bg-marigold',  slug: 'sathi'         },
  { id: 'PadhneBahini', name: 'पढ्ने बहिनी', enName: 'Career Sisters',  initial: 'ब', color: 'bg-sindoor',   slug: 'padhne-bahini' },
]

export const flairs: Record<string, Flair> = {
  newMother:    { label: 'New mother',    bg: '#F4D9C6', text: '#7B3F2B' },
  career:       { label: 'Career',        bg: '#EDE8DC', text: '#1A1410' },
  diaspora:     { label: 'Diaspora',      bg: '#E8F4F0', text: '#2D6A4F' },
  family:       { label: 'Family',        bg: '#FFF3CD', text: '#7B5E00' },
  loneliness:   { label: 'Loneliness',    bg: '#F0EAE0', text: '#5C4A35' },
  streetSafety: { label: 'Street safety', bg: '#FEF0EE', text: '#9B2C2C' },
}

function hoursAgo(h: number): Date {
  return new Date(Date.now() - h * 3600_000)
}

export const mockStories: Story[] = [
  {
    id: '1',
    circleId: 'SathiCircle',
    title: 'Ghar bhitra ko kura kasailai bhannu garo',
    body: 'Sasurali maa sab kuch thik dekhaucha outta face but ghar bhitra chain chaina. Koi sunidaina lagcha.',
    tags: ['ghar', 'sasurali'],
    flair: flairs.family,
    votes: 248,
    comments: 14,
    createdAt: hoursAgo(2),
    theme: 'domestic',
  },
  {
    id: '2',
    circleId: 'PadhneBahini',
    title: 'Office maa appreciate bhayo tara...',
    body: 'Office maa presentation gareko din — boss le appreciate gare. Tara ghar aayepachi feri eklai feel garyo.',
    tags: ['career', 'eklai'],
    flair: flairs.career,
    votes: 186,
    comments: 9,
    createdAt: hoursAgo(5),
    theme: 'career',
  },
  {
    id: '3',
    circleId: 'NayaAama',
    title: 'Aama sangha argue garyo aaja',
    body: 'Aama sangha argue garyo aaja. Dukha lagyo. Tara bhannu pani garo cha.',
    tags: ['aama', 'family'],
    flair: flairs.family,
    votes: 134,
    comments: 21,
    createdAt: hoursAgo(8),
    theme: 'domestic',
  },
  {
    id: '4',
    circleId: 'Pardesh',
    title: 'Visa process le frustrated banayo',
    body: 'Visa process stress le frustrated lagyo. Sab kuch uncertain feel hunchha.',
    tags: ['visa', 'pardesh'],
    flair: flairs.diaspora,
    votes: 97,
    comments: 7,
    createdAt: hoursAgo(12),
    theme: 'diaspora',
  },
  {
    id: '5',
    circleId: 'NayaAama',
    title: 'Naani ko school pressure le mero stress',
    body: 'Naani ko school pressure le afai stressed hunchu. Ko herna aucha mero stress?',
    tags: ['school', 'naani'],
    flair: flairs.newMother,
    votes: 312,
    comments: 28,
    createdAt: hoursAgo(18),
    theme: 'postpartum',
  },
  {
    id: '6',
    circleId: 'Pardesh',
    title: 'Nepali food ko smell miss garchhu',
    body: 'Ghar bata tadha bhayera sometimes Nepali food ko smell miss garchhu. Bisaune kura ho tara man lagcha.',
    tags: ['pardesh', 'home'],
    flair: flairs.diaspora,
    votes: 421,
    comments: 35,
    createdAt: hoursAgo(24),
    theme: 'diaspora',
  },
]

export const wisdomCards = [
  { nepali: '"आँधी आउनु भनेको टुट्नु होइन।"', english: 'A storm does not mean you are broken.' },
  { nepali: '"आफ्नो मनको कुरा सुन्नु पनि एउटा हिम्मत हो।"', english: 'Listening to your own heart is also a kind of courage.' },
  { nepali: '"एक्लै भएर पनि आफ्नो लागि उभिनु सक्नु शक्ति हो।"', english: 'Standing up for yourself, even alone, is strength.' },
  { nepali: '"थकान महसुस गर्नु कमजोरी होइन, मानवता हो।"', english: 'Feeling tired is not weakness. It is being human.' },
]

export function relativeTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return 'ahile bharkhar'
  if (diff < 3600) return `${Math.floor(diff / 60)} min aghi`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs aghi`
  return `${Math.floor(diff / 86400)} din aghi`
}
