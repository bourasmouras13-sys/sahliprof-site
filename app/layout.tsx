import type { Metadata, Viewport } from "next";
import { Cairo, Reem_Kufi } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDict, getLang } from "@/lib/i18n";
import "./globals.css";

const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic", "latin"] });
const reem = Reem_Kufi({ variable: "--font-reem", subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: {
    default: "Mouradsahli – Taalim | Enseignement explicite & cartes mentales",
    template: "%s | Mouradsahli – Taalim",
  },
  description:
    "Cours de l'enseignement explicite (PDF/PPT) et cartes mentales pour le primaire, de la 1AEP à la 6AEP : arabe, français, mathématiques et éveil scientifique.",
};

export const viewport: Viewport = {
  themeColor: "#b07a4a",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const lang = await getLang();
  const t = getDict(lang);

  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`${cairo.variable} ${reem.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col p-3 sm:p-6">
          <div className="wood-frame flex flex-1 flex-col overflow-hidden rounded-3xl border-4 border-wood-dark/40 bg-paper">
            <SiteHeader lang={lang} t={t} />
            <main className="flex-1 px-4 py-8 sm:px-10">{children}</main>
            <SiteFooter t={t} />
          </div>
        </div>
      </body>
    </html>
  );
}
