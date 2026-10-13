import type { EsnEvent, Venue } from '@/lib/events';

const CRLF = '\r\n';
const MAX_LINE_OCTETS = 75;
const DEFAULT_DURATION = 'PT2H';
const REFRESH = 'PT1H';

const encoder = new TextEncoder();

function escapeText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, ';').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

function fold(line: string): string {
  const chunks: string[] = [];
  let current = '';
  let octets = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    const limit = chunks.length === 0 ? MAX_LINE_OCTETS : MAX_LINE_OCTETS - 1;
    if (octets + size > limit) {
      chunks.push(current);
      current = '';
      octets = 0;
    }
    current += char;
    octets += size;
  }
  chunks.push(current);
  return chunks.join(`${CRLF} `);
}

function utcStamp(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

function formatLocation(venue: Venue | undefined, place: string | undefined): string | undefined {
  if (!venue) return place;
  const city = [venue.postalCode, venue.city].filter(Boolean).join(' ');
  const parts = [venue.name, venue.street, city].filter((part): part is string => Boolean(part));
  return parts.length > 0 ? [...new Set(parts)].join(', ') : place;
}

function eventLines(event: EsnEvent, host: string, stamp: string): string[] {
  const description = [event.description, event.url].filter(Boolean).join('\n\n');
  const location = formatLocation(event.venue, event.place);
  return [
    'BEGIN:VEVENT',
    `UID:${event.id}@${host}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${utcStamp(new Date(event.start))}`,
    event.end ? `DTEND:${utcStamp(new Date(event.end))}` : `DURATION:${DEFAULT_DURATION}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    ...(location ? [`LOCATION:${escapeText(location)}`] : []),
    `URL:${event.url}`,
    'END:VEVENT',
  ];
}

/** Builds an RFC 5545 calendar of `events`, with UIDs scoped to the host of `site`. */
export function eventsCalendar(events: EsnEvent[], options: { site: string; now: Date; name: string }): string {
  const host = new URL(options.site).host;
  const stamp = utcStamp(options.now);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ESN Lille//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(options.name)}`,
    'X-WR-TIMEZONE:Europe/Paris',
    `REFRESH-INTERVAL;VALUE=DURATION:${REFRESH}`,
    `X-PUBLISHED-TTL:${REFRESH}`,
    ...events.flatMap(event => eventLines(event, host, stamp)),
    'END:VCALENDAR',
  ];
  return lines.map(fold).join(CRLF) + CRLF;
}
