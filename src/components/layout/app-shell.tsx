"use client";

import Link from "next/link";
import { Coffee, DoorOpen, Presentation, Rows3, ShipWheel } from "lucide-react";
import { useTranslations } from "use-intl";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

const navItems = [
  { href: "/", label: "floor", icon: Rows3 },
  { href: "/ship-wall", label: "community", icon: ShipWheel },
  { href: "/coffee-corner", label: "coffee", icon: Coffee },
  { href: "/elevator", label: "elevator", icon: Presentation },
  { href: "/clock-out", label: "clockOut", icon: DoorOpen },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");

  return (
    <div className="min-h-screen">
      <header className="border-b border-floor-line bg-floor-paper/90">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="text-base font-semibold text-floor-ink">
            Founders&apos; Floor
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm text-floor-muted transition hover:bg-white hover:text-floor-ink"
                >
                  <Icon size={16} aria-hidden="true" />
                  <span className="hidden sm:inline">{t(item.label)}</span>
                </Link>
              );
            })}
            <LanguageSwitcher />
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}
