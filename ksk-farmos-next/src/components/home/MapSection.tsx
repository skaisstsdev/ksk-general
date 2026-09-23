import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { HesseMap } from "@/components/ui/HesseMap";
import { StickyCol } from "@/components/ui/StickyCol";
import { map } from "@/content/home";
import { contact, locations } from "@/content/site";

/**
 * Карта зоны обслуживания.
 *
 * Отвечает на второй вопрос семьи — «вы работаете в моём районе» —
 * и впервые показывает адрес в Касселе: на старом сайте
 * Sommerbergstraße не встречалась ни на одной странице.
 */
export function MapSection() {
  return (
    <section id="standorte" className="pt-turn">
      <Grid>
        <Col span="text">
          <StickyCol>
            <Eyebrow className="text-ink-muted">{map.eyebrow}</Eyebrow>
            <h2 className="mt-2xs text-h1 text-ink">{map.title}</h2>
            <p className="mt-md max-w-[34ch] text-body text-ink-soft">
              {map.coverage}
            </p>
          </StickyCol>
        </Col>

        <Col span="aside">
          <HesseMap
            ownLabels={{
              [locations.headquarters.city]: {
                role: map.headquartersRole,
                street: `${locations.headquarters.street}, ${locations.headquarters.postalCode} ${locations.headquarters.city}`,
                phone: contact.phone.display,
              },
              [locations.residence.city]: {
                role: map.residenceRole,
                street: `${locations.residence.street}, ${locations.residence.postalCode} ${locations.residence.city}`,
                phone: contact.mobile.display,
              },
            }}
          />
        </Col>
      </Grid>
    </section>
  );
}
