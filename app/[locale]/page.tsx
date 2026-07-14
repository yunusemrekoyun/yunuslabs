import { notFound } from "next/navigation";
import { LiquidGlassHero } from "@/components/LiquidGlassHero";
import { PortfolioSections } from "@/components/PortfolioSections";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);

  return (
    <LiquidGlassHero locale={locale} dict={dict}>
      <PortfolioSections locale={locale} dict={dict} />
    </LiquidGlassHero>
  );
}
