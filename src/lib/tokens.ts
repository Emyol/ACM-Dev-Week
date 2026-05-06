export const CT_PALETTES = {
  cream: {
    bg:        '#FAEEDA',  // warm cream — Sunday morning
    bgSoft:    '#F5E2C5',
    bgCard:    '#FFF8EC',
    ink:       '#2A1F12',  // warm black, never pure
    inkSoft:   '#6B5640',
    inkMuted:  '#9C8870',
    line:      '#E8D4B0',
  },
  sage: {
    bg:        '#E8EFE5',
    bgSoft:    '#D8E3D2',
    bgCard:    '#F4F8F1',
    ink:       '#1F2A1A',
    inkSoft:   '#506049',
    inkMuted:  '#8C9A85',
    line:      '#C8D4C0',
  },
  rose: {
    bg:        '#F8E5DC',
    bgSoft:    '#F0D2C5',
    bgCard:    '#FFF1EA',
    ink:       '#2A1814',
    inkSoft:   '#6B4A40',
    inkMuted:  '#9C7A6E',
    line:      '#E8C8B8',
  },
  midnight: { // dark mode
    bg:        '#1C1812',
    bgSoft:    '#26211A',
    bgCard:    '#2E2820',
    ink:       '#FAEEDA',
    inkSoft:   '#C8B89E',
    inkMuted:  '#8C7E68',
    line:      '#3D352A',
  },
};

export type Palette = typeof CT_PALETTES.cream;
export type PaletteName = keyof typeof CT_PALETTES;

export const CT_SEMANTIC = {
  // semantic, not decorative
  win:      '#22A06B',  // teal/green — savings, wins
  winSoft:  '#C5E8D5',
  danger:   '#E54B3C',  // coral — overspending
  dangerSoft:'#FBD3CD',
  dream:    '#7C4DFF',  // purple — aspirations
  dreamSoft:'#DCD0FF',
  amber:    '#C9854A',  // chico's fur tone
  amberSoft:'#F2D4B0',
};

// Format peso amount with thousands separators
export function peso(n: number, opts: { suffix?: string } = {}) {
  const sign = n < 0 ? '-' : '';
  const v = Math.abs(Math.round(n));
  const s = v.toLocaleString('en-PH');
  return `${sign}₱${s}${opts.suffix || ''}`;
}
