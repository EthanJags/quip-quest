// 12 fun, colorful, distinct cartoon avatars
// Each has a paired background color chosen to complement the character

const AVATARS: { id: string; label: string; bg: string; svg: string }[] = [
  {
    id: "cat",
    label: "Cool Cat",
    bg: "#FFE0B2",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><polygon points="22,20 18,45 36,36" fill="#E8983E"/><polygon points="78,20 82,45 64,36" fill="#E8983E"/><polygon points="22,20 20,40 34,34" fill="#FFB347"/><polygon points="78,20 80,40 66,34" fill="#FFB347"/><circle cx="36" cy="46" r="8" fill="white"/><circle cx="64" cy="46" r="8" fill="white"/><circle cx="38" cy="45" r="5" fill="#2D3748"/><circle cx="66" cy="45" r="5" fill="#2D3748"/><circle cx="40" cy="43" r="2" fill="white"/><circle cx="68" cy="43" r="2" fill="white"/><ellipse cx="50" cy="56" rx="4" ry="2.5" fill="#FF6B8A"/><path d="M46 60 Q50 66 54 60" stroke="#2D3748" stroke-width="2" stroke-linecap="round"/><line x1="18" y1="50" x2="33" y2="48" stroke="#2D3748" stroke-width="1.5"/><line x1="18" y1="55" x2="33" y2="54" stroke="#2D3748" stroke-width="1.5"/><line x1="67" y1="48" x2="82" y2="50" stroke="#2D3748" stroke-width="1.5"/><line x1="67" y1="54" x2="82" y2="55" stroke="#2D3748" stroke-width="1.5"/></svg>`,
  },
  {
    id: "alien",
    label: "Funky Alien",
    bg: "#D1FAE5",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><ellipse cx="50" cy="22" rx="12" ry="6" fill="#6EE7B7"/><circle cx="43" cy="20" r="3.5" fill="#34D399"/><circle cx="57" cy="20" r="3.5" fill="#34D399"/><circle cx="36" cy="48" r="11" fill="white"/><circle cx="64" cy="48" r="11" fill="white"/><circle cx="36" cy="48" r="6.5" fill="#1a1a2e"/><circle cx="64" cy="48" r="6.5" fill="#1a1a2e"/><circle cx="39" cy="45" r="2.5" fill="#6EE7B7"/><circle cx="67" cy="45" r="2.5" fill="#6EE7B7"/><path d="M43 68 Q50 74 57 68" stroke="#065F46" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  },
  {
    id: "robot",
    label: "Robo Buddy",
    bg: "#E0E7FF",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><line x1="50" y1="14" x2="50" y2="28" stroke="#94A3B8" stroke-width="3"/><circle cx="50" cy="12" r="4.5" fill="#F59E0B"/><rect x="22" y="28" width="56" height="50" rx="10" fill="#CBD5E1"/><rect x="18" y="32" width="64" height="42" rx="8" fill="#94A3B8"/><rect x="32" y="42" width="13" height="11" rx="3" fill="#3B82F6"/><rect x="55" y="42" width="13" height="11" rx="3" fill="#3B82F6"/><circle cx="38" cy="47" r="3" fill="white"/><circle cx="62" cy="47" r="3" fill="white"/><rect x="37" y="62" width="26" height="5" rx="2.5" fill="#3B82F6"/><rect x="12" y="48" width="7" height="16" rx="3.5" fill="#94A3B8"/><rect x="81" y="48" width="7" height="16" rx="3.5" fill="#94A3B8"/></svg>`,
  },
  {
    id: "ghost",
    label: "Boo Ghost",
    bg: "#EDE9FE",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><path d="M24 52 C24 28 76 28 76 52 L76 78 L68 70 L60 78 L50 70 L40 78 L32 70 L24 78 Z" fill="white" stroke="#E2E8F0" stroke-width="1.5"/><circle cx="40" cy="46" r="6" fill="#1a1a2e"/><circle cx="60" cy="46" r="6" fill="#1a1a2e"/><circle cx="42" cy="44" r="2.5" fill="white"/><circle cx="62" cy="44" r="2.5" fill="white"/><ellipse cx="50" cy="58" rx="5" ry="4" fill="#FDA4AF"/><circle cx="30" cy="52" r="5" fill="#FECDD3" opacity="0.4"/><circle cx="70" cy="52" r="5" fill="#FECDD3" opacity="0.4"/></svg>`,
  },
  {
    id: "dino",
    label: "Party Dino",
    bg: "#DCFCE7",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><polygon points="32,18 36,26 28,26" fill="#4ADE80"/><polygon points="44,14 48,22 40,22" fill="#4ADE80"/><polygon points="56,14 60,22 52,22" fill="#4ADE80"/><polygon points="68,18 72,26 64,26" fill="#4ADE80"/><circle cx="36" cy="44" r="8" fill="white"/><circle cx="64" cy="44" r="8" fill="white"/><circle cx="38" cy="43" r="5" fill="#1a1a2e"/><circle cx="66" cy="43" r="5" fill="#1a1a2e"/><path d="M38 62 Q50 74 62 62" stroke="#166534" stroke-width="3" stroke-linecap="round"/><circle cx="26" cy="54" r="5" fill="#BBF7D0" opacity="0.5"/><circle cx="74" cy="54" r="5" fill="#BBF7D0" opacity="0.5"/></svg>`,
  },
  {
    id: "penguin",
    label: "Chill Penguin",
    bg: "#BFDBFE",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><ellipse cx="50" cy="52" rx="30" ry="34" fill="#1E293B"/><ellipse cx="50" cy="56" rx="18" ry="24" fill="white"/><circle cx="40" cy="42" r="6" fill="white"/><circle cx="60" cy="42" r="6" fill="white"/><circle cx="41" cy="42" r="3.5" fill="#1a1a2e"/><circle cx="61" cy="42" r="3.5" fill="#1a1a2e"/><polygon points="50,50 45,57 55,57" fill="#F59E0B"/><path d="M22 52 Q18 64 26 72" fill="#1E293B" stroke="#0F172A" stroke-width="1.5"/><path d="M78 52 Q82 64 74 72" fill="#1E293B" stroke="#0F172A" stroke-width="1.5"/></svg>`,
  },
  {
    id: "unicorn",
    label: "Magic Unicorn",
    bg: "#FCE7F3",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><polygon points="50,8 46,30 54,30" fill="#FBBF24"/><circle cx="50" cy="52" r="28" fill="white"/><circle cx="40" cy="48" r="5" fill="#1a1a2e"/><circle cx="60" cy="48" r="5" fill="#1a1a2e"/><circle cx="42" cy="46" r="2" fill="white"/><circle cx="62" cy="46" r="2" fill="white"/><path d="M44 62 Q50 68 56 62" stroke="#EC4899" stroke-width="2.5" stroke-linecap="round"/><circle cx="32" cy="56" r="4" fill="#FBCFE8" opacity="0.6"/><circle cx="68" cy="56" r="4" fill="#FBCFE8" opacity="0.6"/><path d="M70 34 Q82 30 84 40 Q80 36 76 38 Q84 42 80 50" fill="#EC4899" opacity="0.5"/><path d="M74 36 Q84 34 82 44" fill="#A78BFA" opacity="0.4"/></svg>`,
  },
  {
    id: "pumpkin",
    label: "Spooky Pumpkin",
    bg: "#FED7AA",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><ellipse cx="50" cy="54" rx="32" ry="28" fill="#FB923C"/><ellipse cx="36" cy="54" rx="14" ry="28" fill="#FDBA74" opacity="0.35"/><ellipse cx="64" cy="54" rx="14" ry="28" fill="#EA580C" opacity="0.25"/><polygon points="42,42 47,47 37,47" fill="#1a1a2e"/><polygon points="58,42 63,47 53,47" fill="#1a1a2e"/><path d="M38 62 L43 58 L50 64 L57 58 L62 62" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="46" y="22" width="8" height="10" rx="3" fill="#16A34A"/></svg>`,
  },
  {
    id: "bear",
    label: "Honey Bear",
    bg: "#FDE68A",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="28" cy="26" r="12" fill="#92400E"/><circle cx="72" cy="26" r="12" fill="#92400E"/><circle cx="28" cy="26" r="7" fill="#D97706"/><circle cx="72" cy="26" r="7" fill="#D97706"/><circle cx="50" cy="52" r="30" fill="#B45309"/><ellipse cx="50" cy="58" rx="16" ry="12" fill="#D97706"/><circle cx="40" cy="46" r="4.5" fill="#1a1a2e"/><circle cx="60" cy="46" r="4.5" fill="#1a1a2e"/><circle cx="42" cy="44" r="1.5" fill="white"/><circle cx="62" cy="44" r="1.5" fill="white"/><ellipse cx="50" cy="55" rx="5" ry="3" fill="#1a1a2e"/><path d="M45 60 Q50 66 55 60" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  {
    id: "octopus",
    label: "Disco Octopus",
    bg: "#F3E8FF",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><ellipse cx="50" cy="38" rx="28" ry="24" fill="#C084FC"/><circle cx="40" cy="35" r="7" fill="white"/><circle cx="60" cy="35" r="7" fill="white"/><circle cx="42" cy="34" r="4" fill="#1a1a2e"/><circle cx="62" cy="34" r="4" fill="#1a1a2e"/><circle cx="44" cy="32" r="1.5" fill="white"/><circle cx="64" cy="32" r="1.5" fill="white"/><path d="M44 48 Q50 54 56 48" stroke="#6B21A8" stroke-width="2.5" stroke-linecap="round"/><path d="M24 58 Q18 76 26 82" stroke="#C084FC" stroke-width="5" stroke-linecap="round"/><path d="M36 62 Q32 78 38 84" stroke="#C084FC" stroke-width="5" stroke-linecap="round"/><path d="M50 64 Q50 80 50 86" stroke="#C084FC" stroke-width="5" stroke-linecap="round"/><path d="M64 62 Q68 78 62 84" stroke="#C084FC" stroke-width="5" stroke-linecap="round"/><path d="M76 58 Q82 76 74 82" stroke="#C084FC" stroke-width="5" stroke-linecap="round"/></svg>`,
  },
  {
    id: "fox",
    label: "Sly Fox",
    bg: "#FFEDD5",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><polygon points="20,22 24,48 36,38" fill="#EA580C"/><polygon points="80,22 76,48 64,38" fill="#EA580C"/><polygon points="20,22 28,42 34,32" fill="#FED7AA"/><polygon points="80,22 72,42 66,32" fill="#FED7AA"/><circle cx="50" cy="52" r="26" fill="#F97316"/><path d="M30 52 Q50 76 70 52 Q62 66 50 66 Q38 66 30 52" fill="white"/><path d="M38 46 L33 42 L43 42 Z" fill="#1a1a2e"/><path d="M62 46 L57 42 L67 42 Z" fill="#1a1a2e"/><ellipse cx="50" cy="54" rx="4" ry="2.5" fill="#1a1a2e"/><path d="M46 54 L50 57 L54 54" stroke="#1a1a2e" stroke-width="1.5"/></svg>`,
  },
  {
    id: "cloud",
    label: "Happy Cloud",
    bg: "#DBEAFE",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="38" cy="48" r="20" fill="white"/><circle cx="62" cy="48" r="20" fill="white"/><circle cx="50" cy="40" r="22" fill="white"/><circle cx="28" cy="52" r="14" fill="white"/><circle cx="72" cy="52" r="14" fill="white"/><circle cx="42" cy="44" r="4.5" fill="#1a1a2e"/><circle cx="58" cy="44" r="4.5" fill="#1a1a2e"/><circle cx="44" cy="42" r="1.5" fill="white"/><circle cx="60" cy="42" r="1.5" fill="white"/><path d="M44 54 Q50 60 56 54" stroke="#F472B6" stroke-width="2.5" stroke-linecap="round"/><circle cx="34" cy="52" r="4" fill="#FECDD3" opacity="0.4"/><circle cx="66" cy="52" r="4" fill="#FECDD3" opacity="0.4"/></svg>`,
  },
];

export default AVATARS;

export function getAvatarById(id: string) {
  return AVATARS.find((a) => a.id === id);
}

export function avatarToDataUri(avatarId: string) {
  const avatar = getAvatarById(avatarId);
  if (!avatar) return "";
  const inner = avatar.svg.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "");
  // Compose: circular clip via clipPath + character shifted down so they peek up from below
  const clipId = `clip-${avatar.id}`;
  const composed = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><clipPath id="${clipId}"><circle cx="50" cy="50" r="49"/></clipPath></defs><g clip-path="url(%23${clipId})"><circle cx="50" cy="50" r="50" fill="${avatar.bg}"/><g transform="translate(0,30) scale(1.15)">${inner}</g></g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(composed)}`;
}
