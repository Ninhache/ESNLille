import type { EsnEvent, EventsResult, Price } from '../events';
import { HELLOASSO_URL } from '../links';
import { ORGANIZATION } from '../site';

const TIME_ZONE = 'Europe/Paris';

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function formatPrice(price: Price | undefined, currency: string): string | undefined {
  if (!price) return undefined;
  if (price.kind === 'free') return 'free';
  const amount = new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(price.cents / 100);
  return price.kind === 'from' ? `from ${amount}` : amount;
}

function eventLine(event: EsnEvent): string {
  const details = [event.place, formatPrice(event.price, event.currency)].filter(Boolean).join(', ');
  const when = dateFormat.format(new Date(event.start));
  return `- ${when}: [${event.title}](${event.url})${details ? ` (${details})` : ''}`;
}

function eventsSection(result: EventsResult): string[] {
  if (result.status === 'unavailable') return [`Events can't be listed right now. See ${HELLOASSO_URL}`];
  if (result.events.length === 0) return [`No events scheduled right now. New ones are announced on ${HELLOASSO_URL}`];
  return result.events.map(eventLine);
}

/** The `/llms.txt` summary of ESN Lille for AI assistants, with absolute links rooted at `site`. */
export function llmsText(site: string, events: EventsResult): string {
  const { address } = ORGANIZATION;
  return [
    `# ${ORGANIZATION.name}`,
    '',
    `> ${ORGANIZATION.legalName} is a volunteer-run non-profit that welcomes international and exchange students in Lille, France, since ${ORGANIZATION.foundingDate}: parties, trips, cultural outings, sports and help settling in. It is part of ${ORGANIZATION.parent.name} (${ORGANIZATION.parent.url}) and the Erasmus Student Network.`,
    '',
    `- Email: ${ORGANIZATION.email}`,
    `- Office: ${address.name}, ${address.street}, ${address.postalCode} ${address.city}, France`,
    `- Event tickets: ${HELLOASSO_URL}`,
    `- Instagram: ${ORGANIZATION.socials.instagram}`,
    `- TikTok: ${ORGANIZATION.socials.tiktok}`,
    '',
    '## Pages',
    '',
    `- [Home (English)](${site}/en): who ESN Lille is and the next events`,
    `- [Accueil (français)](${site}/fr): la même page en français`,
    `- [Upcoming events (English)](${site}/en/events): every upcoming event with prices and ticket links`,
    `- [Événements à venir (français)](${site}/fr/events): la liste des événements en français`,
    '',
    '## Upcoming events',
    '',
    `Times are in Paris time (${TIME_ZONE}).`,
    '',
    ...eventsSection(events),
    '',
  ].join('\n');
}
