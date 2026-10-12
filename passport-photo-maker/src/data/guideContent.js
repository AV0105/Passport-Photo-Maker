import homeTheSpot     from '../assets/guides/home/0001.webp';
import homeBackdrop    from '../assets/guides/home/0003.webp';
import homeTheShot     from '../assets/guides/home/0002.webp';
import homeMistakes    from '../assets/guides/home/0004.webp';

import mobileSettings     from '../assets/guides/mobile/0001.webp';
import mobileHolding      from '../assets/guides/mobile/0002.webp';
import mobileFraming      from '../assets/guides/mobile/0003.webp';

import tipsLighting     from '../assets/guides/Checklist/0001.webp';
import tipsBackground   from '../assets/guides/Checklist/0002.webp';
import tipsExpression   from '../assets/guides/Checklist/0003.webp';
import tipsHead         from '../assets/guides/Checklist/0004.webp';
import tipsAccessories  from '../assets/guides/Checklist/0005.webp';
import tipsClothing     from '../assets/guides/Checklist/0006.webp';

export const guides = {
  home: {
    slug: 'home',
    title: 'How to make a passport-size photo at home',
    subtitle: 'No studio, no photographer, just a window and 5 minutes.',
    blocks: [
      { type: 'p', text: 'Most passport photos rejected at the counter fail because of bad lighting or a busy background, not because they weren\'t taken by a professional. With a window, a plain wall and a phone, you can produce a photo that passes every technical check.' },

      { type: 'h2', id: 'what-you-need', text: 'What you need' },
      { type: 'ul', items: [
        'A smartphone or any camera',
        'A window with indirect daylight not direct sun',
        'A plain wall (white, off-white or light grey)',
        'A friend, a tripod, or a flat surface to rest the camera on',
      ]},

      { type: 'h2', id: 'the-spot', image: homeTheSpot, text: 'Choosing the right spot' },
      { type: 'p', text: 'Light quality matters more than the camera. Stand about 1–2 metres from a large window on a bright but overcast day, or in the shade on a sunny day. Direct sunlight creates harsh shadows on the face and background, both grounds for rejection.' },
      { type: 'p', text: 'Face the window so the light falls evenly on your face. If the light is too strong, tape a thin white sheet over the window to diffuse it.' },
      { type: 'callout', kind: 'tip', text: 'The "golden hour" (first hour after sunrise or before sunset) is warm and directional, great for portraits, bad for passports. Aim for flat, neutral light instead.' },

      { type: 'h2', id: 'backdrop', image: homeBackdrop, text: 'Setting up the backdrop' },
      { type: 'p', text: 'Most countries require a plain white or light-coloured background. A freshly painted wall works best. If your walls are textured or coloured, hang a plain white bedsheet taut behind you wrinkles and folds will show up as shadows.' },
      { type: 'p', text: 'Stand at least 50 cm away from the wall so your shadow falls behind you rather than on it.' },

      { type: 'h2', id: 'the-shot', image: homeTheShot, text: 'Taking the photo' },
      { type: 'ol', items: [
        'Position the camera at eye level, about 1.5 m away.',
        'Frame from mid-chest up, leaving space above your head.',
        'Look directly at the lens — not at the screen.',
        'Relax your face: mouth closed, neutral expression, both eyes open.',
        'Use a 2-second timer or have a friend press the shutter.',
      ]},

      { type: 'h2', id: 'mistakes', image: homeMistakes, text: 'Common mistakes' },
      { type: 'ul', items: [
        'Shadows on one side of the face (move closer to the window or add a reflector — a white poster board works)',
        'Busy backgrounds (patterns, shelves, other people)',
        'Glasses glare (tilt the head very slightly down, or take them off if permitted)',
        'Hair covering the eyes or eyebrows',
        'Red-eye from a flash (turn the flash off — it\'s not allowed anyway)',
      ]},

      { type: 'callout', kind: 'warn', text: 'Selfies with the front camera are the single biggest cause of poor passport photos — the lens distorts facial proportions. Use the rear camera and a timer, or ask someone to help.' },

      { type: 'h2', id: 'checklist', text: 'Final checklist' },
      { type: 'ul', items: [
        'Plain, even background — no shadows',
        'Face fully visible, centred, looking at the lens',
        'Neutral expression, both eyes open',
        'No flash, no filters, no beauty mode',
        'High enough resolution (the tool will warn you if not)',
      ]},
    ],
  },

  mobile: {
    slug: 'mobile',
    title: 'How to make a passport photo with any mobile phone',
    subtitle: 'Works on any phone made, no special app required.',
    blocks: [
      { type: 'p', text: 'You don\'t need a flagship phone. A mid-range device is more than sharp enough. What matters is using the right camera and turning off the "helpful" processing that phones apply by default.' },

      { type: 'h2', id: 'which-camera', text: 'Which camera to use' },
      { type: 'p', text: 'Always use the rear main camera (recommended), the selfie camera can also be used but for better results use the rear camera. Front cameras have smaller sensors, wider lenses, and aggressive skin-smoothing that blurs facial detail, all of which hurt passport compliance.' },
      
      { type: 'h2', id: 'settings', image: mobileSettings, text: 'Camera settings to get right' },
      { type: 'ul', items: [
        'Turn off Beauty / Portrait / AI-enhance modes',
        'Turn off filters, vignettes and scene optimisers',
        'Disable the flash - it\'s not allowed in passport photos',
        'Disable any on-screen watermark',
      ]},

      { type: 'h2', id: 'holding', image: mobileHolding, text: 'Holding the phone steady' },
      { type: 'p', text: 'Even slight motion blur is one of the most common rejection reasons. Brace your elbows against your ribs, hold the phone with both hands, and use the volume button or a 2-second timer to fire the shutter. On a tripod or a stack of books is even better.' },

      { type: 'h2', id: 'framing', image: mobileFraming, text: 'Framing the shot' },
      { type: 'p', text: 'Frame from mid-chest up, with space above the head. Don\'t try to match passport dimensions in-camera, leave extra room and let our tool do the exact crop. Zoom is not your friend: digital zoom crops pixels and degrades quality. Step back instead.' },

      { type: 'h2', id: 'transferring', text: 'Getting the photo into the tool' },
      { type: 'p', text: 'Upload the original file straight from the camera roll, don\'t share via WhatsApp, Messenger or email, which all recompress and shrink the image. AirDrop, USB cable, Google Photos (original quality) or iCloud Photos all preserve the full resolution.' },

      { type: 'callout', kind: 'warn', text: 'If the only copy of your photo is a screenshot of a messaging app, take the photo again. Screenshots are low-resolution and will not produce a sharp result.' },
    ],
  },

  android: {
    slug: 'android',
    title: 'How to take a passport photo with Android',
    subtitle: 'Turn off the "helpful" features that quietly ruin passport photos.',
    blocks: [
      { type: 'p', text: 'Most Android phones ship with aggressive AI processing enabled by default beauty smoothing, scene detection, automatic HDR, and brand watermarks. All of these can cause a passport photo to be rejected. Here is how to take a clean, compliant shot.' },

      { type: 'h2', id: 'camera-app', text: 'Which camera app' },
      { type: 'p', text: 'Use the stock camera app that came with your phone. Third-party "passport photo" apps typically apply heavy processing and add borders — avoid them.' },

      { type: 'h2', id: 'disable', text: 'Settings to disable' },
      { type: 'ol', items: [
        'Beauty / Face smoothing - off. Passport authorities want to see your real face.',
        'Filters - off. No black-and-white, vintage, or dramatic presets.',
        'Portrait / bokeh mode - off. Blurred backgrounds are not accepted.',
        'Scene optimiser / AI enhance - off if possible.',
        'Watermark - off (usually under Settings → Watermark or Shot on…)',
        'Flash - off. It creates red-eye and harsh shadows.',
      ]},

      { type: 'h2', id: 'timer', text: 'Using the timer' },
      { type: 'p', text: 'A 2- or 3-second self-timer is the simplest way to avoid camera shake. Tap the clock icon in the camera app, choose 2 seconds, and brace the phone against something stable.' },

      { type: 'h2', id: 'grid', text: 'Grid lines and alignment' },
      { type: 'p', text: 'Turn on the 3×3 grid (Settings → Grid lines) and place the subject\'s eyes on the top horizontal line. This gives you good headroom and makes the crop tool\'s job easier.' },

      { type: 'h2', id: 'files', text: 'Where the file ends up' },
      { type: 'p', text: 'Photos are saved to DCIM/Camera on the phone\'s internal storage. Use Files or Gallery to locate the latest photo and upload it directly. Don\'t share via WhatsApp, it recompresses to ~700 px wide.' },

      { type: 'callout', kind: 'tip', text: 'Samsung users: check Settings → Save options → HEIF pictures. If enabled, your photos save as .heic files. This tool accepts them, but JPEG is more universally compatible if you plan to email the result.' },
    ],
  },

  iphone: {
    slug: 'iphone',
    title: 'How to take a passport photo with iPhone',
    subtitle: 'The default Camera app is the right choice, here is how to use it properly.',
    blocks: [
      { type: 'p', text: 'iPhones produce excellent passport photos out of the box, provided you resist the temptation to use Portrait mode or Photographic Styles. The default Photo mode at 1× is all you need.' },

      { type: 'h2', id: 'why-not-portrait', text: 'Why not Portrait mode' },
      { type: 'p', text: 'Portrait mode artificially blurs the background. Passport authorities require a plain, unblurred background and the edge detection around hair often fails, leaving a visible halo. Always use standard Photo mode.' },

      { type: 'h2', id: '1x-lens', text: 'Use the 1× lens' },
      { type: 'p', text: 'On iPhones with multiple lenses, 1× is the main wide-angle camera and the sharpest. The 0.5× ultra-wide distorts faces; the 2×+ telephoto works but requires more space. Stick to 1×.' },

      { type: 'h2', id: 'ae-lock', text: 'AE/AF Lock — the tap-and-hold trick' },
      { type: 'p', text: 'Before the shot, tap and hold on the subject\'s face until you see "AE/AF LOCK" appear. This locks focus and exposure so the phone doesn\'t refocus or change brightness at the moment you press the shutter.' },

      { type: 'h2', id: 'live-photo', text: 'Live Photo: on or off?' },
      { type: 'p', text: 'Live Photo is fine, the still frame it captures is the same quality as a regular photo. But if the subject moves during the 1.5-second capture window, the key frame can be slightly soft. Turn it off for the sharpest result.' },

      { type: 'h2', id: 'heic-jpeg', text: 'HEIC vs JPEG' },
      { type: 'p', text: 'iPhones save photos as HEIC by default (Settings → Camera → Formats → High Efficiency). This tool accepts HEIC, but if you plan to upload the photo elsewhere later, switch to "Most Compatible" for JPEG.' },

      { type: 'h2', id: 'styles', text: 'Photographic Styles' },
      { type: 'p', text: 'On iPhone 13 and later, Photographic Styles apply a colour tone to every photo. For passport photos, use the default "Standard" style, richer or warmer styles change skin tones in ways that can cause rejection.' },

      { type: 'callout', kind: 'warn', text: 'Never use filters from the Photos app (Vivid, Dramatic, Mono, etc.) before uploading. Passport photos must be unprocessed and true-to-life.' },
    ],
  },

  'photo-tips': {
    slug: 'photo-tips',
    title: 'The passport photo checklist',
    subtitle: 'The rules every passport and ID photo must follow worldwide.',
    blocks: [
      { type: 'p', text: 'Passport and ID photo standards come from ICAO Doc 9303, and nearly every country derives its rules from it. If your photo follows the points below, it will pass technical checks in most jurisdictions.' },

      { type: 'h2', id: 'lighting', image: tipsLighting, text: '1. Lighting' },
      { type: 'p', text: 'Even, diffused lighting with no shadows on the face or background. Avoid direct sunlight, overhead lighting that creates eye-socket shadows, and a single light source from one side.' },

      { type: 'h2', id: 'background', image: tipsBackground, text: '2. Background' },
      { type: 'p', text: 'Plain, light-coloured and uniform. White or off-white is the safest choice. No patterns, no objects, no other people, no shadows.' },

      { type: 'h2', id: 'expression', image: tipsExpression, text: '3. Expression and eyes' },
      { type: 'ul', items: [
        'Neutral expression, no smiling, no frowning',
        'Mouth closed',
        'Both eyes open and clearly visible',
        'Looking directly at the camera',
      ]},

      { type: 'h2', image: tipsHead, id: 'head', text: '4. Head position' },
      { type: 'p', text: 'Head centred, facing forward, not tilted. The full face from the bottom of the chin to the top of the head (including hair) must be visible. Most authorities want the head to occupy 70–80% of the frame height.' },

      { type: 'h2', image: tipsAccessories, id: 'accessories', text: '5. Glasses and accessories' },
      { type: 'ul', items: [
        'Glasses: most countries now ban them in passport photos because of glare. If yours are allowed, there must be no tint, no reflection, and the frames must not cover the eyes.',
        'Hats and head coverings: only permitted for religious or medical reasons, and the full face from hairline to chin must still be visible.',
        'Hair must not cover the eyes or eyebrows.',
      ]},

      { type: 'h2', image: tipsClothing, id: 'clothing', text: '6. Clothing' },
      { type: 'p', text: 'Wear what you would to the passport office. Avoid white tops against a white background (you can disappear) and overly casual clothing like hoodies with the hood up.' },

      { type: 'h2', id: 'rejection', text: '7. Common rejection reasons' },
      { type: 'ol', items: [
        'Shadows on the face or background',
        'Red-eye, flash reflection or glasses glare',
        'Smiling or open mouth',
        'Head tilted or turned',
        'Hair covering the eyes or eyebrows',
        'Patterned or non-plain background',
        'Image too low-resolution or visibly pixelated',
        'Visible retouching, filters or beauty smoothing',
      ]},

    ],
  },
};

export const guideIndex = [
  { slug: 'home', title: 'Make it at home', desc: 'No studio needed.' },
  { slug: 'mobile', title: 'With a mobile phone', desc: 'Works on any modern phone.' },
  { slug: 'android', title: 'With Android', desc: 'Settings to turn off.' },
  { slug: 'iphone', title: 'With iPhone', desc: 'The right Camera app settings.' },
  { slug: 'photo-tips', title: 'The checklist', desc: 'Rules every photo must follow.' },
];