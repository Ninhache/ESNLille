import { describe, expect, it } from 'vitest';
import type { EsnEvent } from '@/lib/events';
import { eventsCalendar } from './ics';

const options = { site: 'https://lille.test', now: new Date('2026-10-13T12:00:00Z'), name: 'ESN Lille' };

const quiz: EsnEvent = {
  id: 'quiz',
  title: 'Quiz night',
  start: '2026-11-02T19:00:00+01:00',
  end: '2026-11-02T22:30:00+01:00',
  currency: 'EUR',
  url: 'https://tickets.test/quiz',
};

const unfolded = (ics: string) => ics.replace(/\r\n /g, '');

describe('eventsCalendar', () => {
  it('should wrap events in a calendar with CRLF line ends', () => {
    const ics = eventsCalendar([], options);
    expect(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics.replace(/\r\n/g, '')).not.toContain('\n');
  });

  it('should give each event a stable UID and UTC times', () => {
    const ics = eventsCalendar([quiz], options);
    expect(ics).toContain('UID:quiz@lille.test\r\n');
    expect(ics).toContain('DTSTAMP:20261013T120000Z\r\n');
    expect(ics).toContain('DTSTART:20261102T180000Z\r\n');
    expect(ics).toContain('DTEND:20261102T213000Z\r\n');
  });

  it('should default to two hours when the event has no end', () => {
    const ics = eventsCalendar([{ ...quiz, end: undefined }], options);
    expect(ics).toContain('DURATION:PT2H\r\n');
    expect(ics).not.toContain('DTEND');
  });

  it('should escape text and append the ticket link to the description', () => {
    const ics = unfolded(
      eventsCalendar([{ ...quiz, title: 'Crêpes, jeux; fun', description: 'Line 1\nLine 2' }], options),
    );
    expect(ics).toContain('SUMMARY:Crêpes\\, jeux; fun\r\n');
    expect(ics).toContain('DESCRIPTION:Line 1\\nLine 2\\n\\nhttps://tickets.test/quiz\r\n');
  });

  it('should build the location from the venue, else the place', () => {
    const venue = {
      name: "Maison de l'Étudiant",
      street: 'Cité Scientifique',
      postalCode: '59650',
      city: 'Villeneuve',
    };
    expect(unfolded(eventsCalendar([{ ...quiz, venue }], options))).toContain(
      "LOCATION:Maison de l'Étudiant\\, Cité Scientifique\\, 59650 Villeneuve\r\n",
    );
    expect(eventsCalendar([{ ...quiz, place: 'Lille' }], options)).toContain('LOCATION:Lille\r\n');
    expect(eventsCalendar([quiz], options)).not.toContain('LOCATION');
  });

  it('should fold lines at 75 octets without splitting multibyte characters', () => {
    const ics = eventsCalendar([{ ...quiz, title: 'é'.repeat(100) }], options);
    const encoder = new TextEncoder();
    for (const line of ics.split('\r\n')) {
      expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
    }
    expect(unfolded(ics)).toContain(`SUMMARY:${'é'.repeat(100)}\r\n`);
  });
});
