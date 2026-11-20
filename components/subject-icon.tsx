import { Calculator, FlaskConical, Languages, PenLine } from "lucide-react";
import type { Subject } from "@/lib/i18n";

const ICONS = { arabe: PenLine, francais: Languages, maths: Calculator, eveil: FlaskConical };

export function SubjectIcon({ subject, className }: { subject: Subject; className?: string }) {
  const Icon = ICONS[subject];
  return <Icon className={className} aria-hidden="true" />;
}
