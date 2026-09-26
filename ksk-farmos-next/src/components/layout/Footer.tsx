import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { legalNav, mainNav } from "@/content/navigation";
import { company, contact, locations, social } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Rule } from "@/components/ui/Rule";

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-sm text-eyebrow uppercase text-paper/50">{children}</h2>
  );
}

export async function Footer() {
  const t = await getTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer data-tone="dark" className="mt-auto bg-night text-paper">
      <Container>
        <div className="grid gap-xl py-3xl sm:grid-cols-2 lg:grid-cols-4 lg:gap-lg">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-xs">
              <Image
                src="/logo-icon.png"
                alt=""
                width={32}
                height={32}
                className="size-8 w-auto"
              />
              <span className="text-ui text-paper">
                {company.legalName}
              </span>
            </Link>
            <p className="mt-sm max-w-[34ch] text-meta text-paper/50">
              {t("footer.desc", { year: company.foundedYear })}
            </p>
          </div>

          <nav aria-label={t("footer.navAria")}>
            <ColumnTitle>{t("footer.navTitle")}</ColumnTitle>
            <ul className="flex flex-col gap-xs">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ui text-paper/70 transition-colors hover:text-paper"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <ColumnTitle>{t("footer.kontaktTitle")}</ColumnTitle>
            <ul className="flex flex-col gap-xs text-ui text-paper/70">
              <li>
                <a
                  href={contact.phone.href}
                  className="tabular-nums transition-colors hover:text-paper"
                >
                  {contact.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={contact.mobile.href}
                  className="tabular-nums transition-colors hover:text-paper"
                >
                  {contact.mobile.display}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="transition-colors hover:text-paper"
                >
                  {contact.email}
                </a>
              </li>
            </ul>

            <div className="mt-md flex gap-sm">
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-meta text-paper/50 transition-colors hover:text-paper"
              >
                Facebook
              </a>
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-meta text-paper/50 transition-colors hover:text-paper"
              >
                Instagram
              </a>
            </div>
          </div>

          <div>
            <ColumnTitle>{t("footer.standortenTitle")}</ColumnTitle>
            <ul className="flex flex-col gap-sm text-ui text-paper/70">
              {[
                { ...locations.headquarters, label: t("locations.headquartersLabel") },
                { ...locations.residence, label: t("locations.residenceLabel") },
              ].map((loc) => (
                <li key={loc.id}>
                  <span className="block text-meta text-paper/50">
                    {loc.label}
                  </span>
                  <address className="not-italic">
                    {loc.street}
                    <br />
                    {loc.postalCode} {loc.city}
                  </address>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Rule tone="paper" />
        <div className="flex flex-col gap-sm py-md sm:flex-row sm:items-center sm:justify-between">
          <p className="text-meta text-paper/50">
            © {year} {company.legalName} — {t("footer.rights")}
          </p>
          <ul className="flex gap-md">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-meta text-paper/50 transition-colors hover:text-paper"
                >
                  {t(`legalNav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
