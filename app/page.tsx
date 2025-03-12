import type { Metadata } from "next";
import SalesGoalCalculator from "@/components/sales-goal-calculator";

export const metadata: Metadata = {
  title: "Asistente de Metas Mensuales | Sinergia Creativa",
  description:
    "Calculadora exclusiva de metas de ventas y plan de acción personalizado",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4 md:py-12">
      <div className="container mx-auto max-w-4xl">
        <SalesGoalCalculator />
      </div>
    </main>
  );
}
