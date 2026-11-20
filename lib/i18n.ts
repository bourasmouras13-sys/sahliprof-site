import { cookies } from "next/headers";

export type Lang = "fr" | "ar";

export const SUBJECTS = ["arabe", "francais", "maths", "eveil"] as const;
export type Subject = (typeof SUBJECTS)[number];
export const LEVELS = [1, 2, 3, 4, 5, 6] as const;

export function isSubject(value: string): value is Subject {
  return (SUBJECTS as readonly string[]).includes(value);
}

export function parseLevel(value: string) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 6 ? n : null;
}

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  return store.get("lang")?.value === "ar" ? "ar" : "fr";
}

const fr = {
  siteName: "Mouradsahli – Taalim",
  tagline: "Cours de l'enseignement explicite et cartes mentales pour l'école primaire",
  heroText:
    "Retrouvez chaque semaine les cours prêts à projeter (PDF / PPT) et les cartes mentales pour toutes les classes, de la 1ère à la 6ème année du primaire.",
  chooseLevel: "Choisissez votre niveau",
  chooseSubject: "Choisissez la matière",
  levelShort: (n: number) => `${n}AEP`,
  levelLong: (n: number) => (n === 1 ? "1ère année primaire" : `${n}ème année primaire`),
  subjects: {
    arabe: "Langue arabe",
    francais: "Langue française",
    maths: "Mathématiques",
    eveil: "Éveil scientifique",
  } as Record<Subject, string>,
  week: (n: number) => `Semaine ${n}`,
  weeks: "Semaines",
  downloadLesson: "Télécharger le cours",
  mindMap: "Carte mentale",
  openMap: "Agrandir la carte",
  noLessons: "Aucun cours publié pour le moment. Revenez bientôt !",
  comments: "Commentaires",
  noComments: "Soyez le premier à commenter.",
  yourName: "Votre nom",
  yourComment: "Votre commentaire",
  send: "Envoyer",
  sending: "Envoi…",
  commentError: "Veuillez remplir votre nom et votre commentaire.",
  back: "Retour",
  home: "Accueil",
  admin: "Espace professeur",
  signIn: "Connexion",
  signOut: "Se déconnecter",
  email: "E-mail",
  password: "Mot de passe",
  name: "Nom",
  createAccount: "Créer le compte professeur",
  setupHint:
    "Première visite : créez votre compte professeur. Après cela, l'inscription sera fermée et vous seul pourrez gérer le contenu.",
  signInHint: "Connectez-vous pour ajouter ou modifier les cours et les cartes mentales.",
  authError: "E-mail ou mot de passe incorrect.",
  footer: "Fait avec soin pour les élèves et les enseignants du primaire.",
  langSwitch: "العربية",
  lessonsCount: (n: number) => (n === 0 ? "Bientôt" : n === 1 ? "1 semaine" : `${n} semaines`),
  remove: "Supprimer",
};

const ar: typeof fr = {
  siteName: "مراد السهلي – تعليم",
  tagline: "دروس التدريس الصريح والخرائط الذهنية للتعليم الابتدائي",
  heroText:
    "تجدون كل أسبوع دروسا جاهزة للعرض (PDF / PPT) وخرائط ذهنية لجميع المستويات، من السنة الأولى إلى السنة السادسة ابتدائي.",
  chooseLevel: "اختر المستوى",
  chooseSubject: "اختر المادة",
  levelShort: (n: number) => `${n}AEP`,
  levelLong: (n: number) =>
    ["", "السنة الأولى", "السنة الثانية", "السنة الثالثة", "السنة الرابعة", "السنة الخامسة", "السنة السادسة"][n] +
    " ابتدائي",
  subjects: {
    arabe: "اللغة العربية",
    francais: "اللغة الفرنسية",
    maths: "الرياضيات",
    eveil: "النشاط العلمي",
  },
  week: (n: number) => `الأسبوع ${n}`,
  weeks: "الأسابيع",
  downloadLesson: "تحميل الدرس",
  mindMap: "الخريطة الذهنية",
  openMap: "تكبير الخريطة",
  noLessons: "لا توجد دروس منشورة حاليا. عودوا قريبا!",
  comments: "التعليقات",
  noComments: "كن أول من يعلق.",
  yourName: "اسمك",
  yourComment: "تعليقك",
  send: "إرسال",
  sending: "جار الإرسال…",
  commentError: "المرجو إدخال الاسم والتعليق.",
  back: "رجوع",
  home: "الرئيسية",
  admin: "فضاء الأستاذ",
  signIn: "تسجيل الدخول",
  signOut: "تسجيل الخروج",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  name: "الاسم",
  createAccount: "إنشاء حساب الأستاذ",
  setupHint:
    "أول زيارة: أنشئ حساب الأستاذ. بعد ذلك سيغلق التسجيل وستكون وحدك من يدير المحتوى.",
  signInHint: "سجل الدخول لإضافة أو تعديل الدروس والخرائط الذهنية.",
  authError: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  footer: "صنع بعناية لتلاميذ وأساتذة التعليم الابتدائي.",
  langSwitch: "Français",
  lessonsCount: (n: number) => (n === 0 ? "قريبا" : `${n} أسابيع`),
  remove: "حذف",
};

export type Dict = typeof fr;

export function getDict(lang: Lang): Dict {
  return lang === "ar" ? ar : fr;
}
