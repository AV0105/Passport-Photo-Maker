/* Photo format presets.
 *
 * IMPORTANT: Pixel targets here are print-size conversions at ~300 DPI
 * (a product-level convention), NOT official specifications. Head-position
 * guidance is paraphrased from commonly published guidance. Before enabling
 * in production, every preset must be re-verified against the linked official
 * source and the `verifiedAt` date updated. Never claim a generated photo is
 * guaranteed to be accepted by any passport authority.
 *
 * Field meanings:
 *  - physicalSize: required print size (mm)
 *  - pixelSize:    target export size in pixels (derived at PIXEL_DPI below)
 *  - headSizeMm / headSizeRatio: expected face height guidance
 *  - background:   plain-text description of background requirement
 *  - source:       official specification URL + last verification date
 */

const PIXEL_DPI = 300; // used only to derive pixel targets from mm sizes
const mmToPx = (mm) => Math.round((mm / 25.4) * PIXEL_DPI);

export const INDIAN_PRESETS = [
  {
    id: 'in-passport-35x45',
    name: 'Indian Passport — 35 × 45 mm',
    country: 'India',
    documentType: 'Passport',
    physicalWidthMm: 35,
    physicalHeightMm: 45,
    widthPx: mmToPx(35),   // 413
    heightPx: mmToPx(45),  // 531
    aspectRatio: 35 / 45,
    background: 'Plain light (white/off-white) uniform background',
    headGuidance:
      'Face centred, looking straight at camera; head (chin to crown) should occupy roughly 70–80% of the photo height.',
    source: {
      url: 'https://www.vfsglobal.com/india/usa/passport/photo-requirements.html',
      note: 'Passport Seva / VFS India photo guidance',
      verifiedAt: 'NOT-YET-VERIFIED', // TODO: verify before production enablement
    },
    dpiHint: PIXEL_DPI,
  },
  {
    id: 'in-passport-51x51',
    name: 'Indian Passport (US visa style) — 2 × 2 in',
    country: 'India',
    documentType: 'Visa (US)',
    physicalWidthMm: 51,
    physicalHeightMm: 51,
    widthPx: 600,
    heightPx: 600,
    aspectRatio: 1,
    background: 'Plain white or off-white background',
    headGuidance:
      'Head height (chin to crown) between 50% and 69% of the total photo height; eyes between 56% and 69% from the bottom edge.',
    source: {
      url: 'https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html',
      note: 'US Department of State photo requirements',
      verifiedAt: 'NOT-YET-VERIFIED',
    },
    dpiHint: 300,
  },
  {
    id: 'in-voter-id',
    name: 'Indian Voter ID — 35 × 45 mm',
    country: 'India',
    documentType: 'Voter ID Card',
    physicalWidthMm: 35,
    physicalHeightMm: 45,
    widthPx: mmToPx(35),
    heightPx: mmToPx(45),
    aspectRatio: 35 / 45,
    background: 'Plain light-coloured background',
    headGuidance: 'Face centred and clearly visible; neutral expression.',
    source: {
      url: 'https://voterhelpdesk.eci.gov.in/',
      note: 'Election Commission of India helpdesk',
      verifiedAt: 'NOT-YET-VERIFIED',
    },
    dpiHint: PIXEL_DPI,
  },
  {
    id: 'in-pan-card',
    name: 'Indian PAN Card — 35 × 25 mm',
    country: 'India',
    documentType: 'PAN Card',
    physicalWidthMm: 35,
    physicalHeightMm: 25,
    widthPx: mmToPx(35),
    heightPx: mmToPx(25),
    aspectRatio: 35 / 25,
    background: 'Plain light background',
    headGuidance:
      'Portrait occupying most of the frame; for online PAN applications many portals accept a smaller signature/photo upload.',
    source: {
      url: 'https://www.incometax.gov.in/iec/foportal/',
      note: 'Income Tax Department e-portal',
      verifiedAt: 'NOT-YET-VERIFIED',
    },
    dpiHint: PIXEL_DPI,
  },
  {
    id: 'in-aiats-student',
    name: 'School / Exam Form Photo — 25 × 35 mm',
    country: 'India',
    documentType: 'General ID / Forms',
    physicalWidthMm: 25,
    physicalHeightMm: 35,
    widthPx: mmToPx(25),
    heightPx: mmToPx(35),
    aspectRatio: 25 / 35,
    background: 'Plain light background',
    headGuidance: 'Commonly requested size for Indian school and exam forms.',
    source: {
      url: '',
      note: 'Commonly used informal size — no single official source',
      verifiedAt: 'N/A (informal preset)',
    },
    dpiHint: PIXEL_DPI,
  },
];

export const INTERNATIONAL_PRESETS = [
  {
    id: 'us-passport-2x2',
    name: 'US Passport — 2 × 2 in',
    country: 'United States',
    documentType: 'Passport',
    physicalWidthMm: 51,
    physicalHeightMm: 51,
    widthPx: 600,
    heightPx: 600,
    aspectRatio: 1,
    background: 'Plain white or off-white background',
    headGuidance:
      'Head (hair to chin) between 50% and 69% of image height; eyes between 56% and 69% from the bottom edge.',
    source: {
      url: 'https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html',
      note: 'US Department of State',
      verifiedAt: 'NOT-YET-VERIFIED',
    },
    dpiHint: 300,
  },
  {
    id: 'uk-passport-35x45',
    name: 'UK Passport — 35 × 45 mm',
    country: 'United Kingdom',
    documentType: 'Passport',
    physicalWidthMm: 35,
    physicalHeightMm: 45,
    widthPx: mmToPx(35),
    heightPx: mmToPx(45),
    aspectRatio: 35 / 45,
    background: 'Light grey or cream, plain, no pattern',
    headGuidance:
      'Face uncovered and looking straight ahead; chin to crown 29–34 mm on a 45 mm photo.',
    source: {
      url: 'https://www.gov.uk/passport-photo-rules',
      note: 'GOV.UK passport photo rules',
      verifiedAt: 'NOT-YET-VERIFIED',
    },
    dpiHint: PIXEL_DPI,
  },
  {
    id: 'eu-schengen-35x45',
    name: 'Schengen Visa — 35 × 45 mm',
    country: 'European Union',
    documentType: 'Visa (Schengen)',
    physicalWidthMm: 35,
    physicalHeightMm: 45,
    widthPx: mmToPx(35),
    heightPx: mmToPx(45),
    aspectRatio: 35 / 45,
    background: 'Plain light background',
    headGuidance:
      'Face centred, occupying 70–80% of photo height (ICAO-style guidance).',
    source: {
      url: 'https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy/common-visa-policy_en',
      note: 'EU common visa policy / ICAO Doc 9303 guidance',
      verifiedAt: 'NOT-YET-VERIFIED',
    },
    dpiHint: PIXEL_DPI,
  },
  {
    id: 'ca-passport-50x70',
    name: 'Canadian Passport — 50 × 70 mm',
    country: 'Canada',
    documentType: 'Passport',
    physicalWidthMm: 50,
    physicalHeightMm: 70,
    widthPx: mmToPx(50),
    heightPx: mmToPx(70),
    aspectRatio: 50 / 70,
    background: 'Plain white or light-coloured background',
    headGuidance:
      'Face size (chin to crown) between 32 mm and 36 mm, centred.',
    source: {
      url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html',
      note: 'IRCC photo requirements',
      verifiedAt: 'NOT-YET-VERIFIED',
    },
    dpiHint: PIXEL_DPI,
  },
  {
    id: 'au-passport-35x45',
    name: 'Australian Passport — 35 × 45 mm',
    country: 'Australia',
    documentType: 'Passport',
    physicalWidthMm: 35,
    physicalHeightMm: 45,
    widthPx: mmToPx(35),
    heightPx: mmToPx(45),
    aspectRatio: 35 / 45,
    background: 'Plain light-coloured background',
    headGuidance: 'Face occupies 70–80% of the frame height.',
    source: {
      url: 'https://passports.gov.au/photo-requirements',
      note: 'Australian Passport Office',
      verifiedAt: 'NOT-YET-VERIFIED',
    },
    dpiHint: PIXEL_DPI,
  },
];

export const PHOTO_PRESETS = [...INDIAN_PRESETS, ...INTERNATIONAL_PRESETS];

export function getPresetsByCountry() {
  const map = {};
  for (const p of PHOTO_PRESETS) {
    (map[p.country] ||= []).push(p);
  }
  return map;
}

export function findPreset(id) {
  return PHOTO_PRESETS.find((p) => p.id === id) || null;
}
