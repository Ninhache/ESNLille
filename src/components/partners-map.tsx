'use client';

import 'leaflet/dist/leaflet.css';
import type { Map as LeafletMap } from 'leaflet';
import { useEffect, useRef } from 'react';

export type MapPin = {
  name: string;
  detail: string;
  address: string;
  lat: number;
  lng: number;
  color: string;
  link?: { href: string; label: string };
  office?: boolean;
};

type Props = { pins: MapPin[]; label: string };

const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function popupContent(pin: MapPin): HTMLElement {
  const root = document.createElement('div');
  root.className = 'partners-map-popup';
  const name = document.createElement('strong');
  name.textContent = pin.name;
  const detail = document.createElement('p');
  detail.textContent = pin.detail;
  const address = document.createElement('p');
  address.textContent = pin.address;
  root.append(name, detail, address);
  if (pin.link) {
    const link = document.createElement('a');
    link.href = pin.link.href;
    link.textContent = pin.link.label;
    root.append(link);
  }
  return root;
}

export function PartnersMap({ pins, label }: Props) {
  const container = useRef<HTMLElement>(null);

  useEffect(() => {
    let map: LeafletMap | undefined;
    let cancelled = false;

    import('leaflet').then(L => {
      if (cancelled || !container.current) return;
      map = L.map(container.current, { scrollWheelZoom: false, dragging: !L.Browser.mobile });
      map.fitBounds(L.latLngBounds(pins.map(pin => [pin.lat, pin.lng])), { padding: [48, 48], maxZoom: 15 });
      L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);

      for (const pin of pins) {
        const size = pin.office ? 40 : 26;
        const icon = L.divIcon({
          className: pin.office ? 'partners-map-pin partners-map-office' : 'partners-map-pin',
          html: pin.office ? 'ESN' : '',
          iconSize: [size, size],
          popupAnchor: [0, -size / 2],
        });
        const marker = L.marker([pin.lat, pin.lng], { icon, title: pin.name, alt: pin.name });
        marker.bindPopup(popupContent(pin)).addTo(map);
        marker.getElement()?.style.setProperty('--pin', pin.color);
      }
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [pins]);

  return (
    <section
      ref={container}
      aria-label={label}
      className="partners-map h-[26rem] overflow-hidden rounded-2xl border-2 border-ink bg-dots shadow-hard-lg sm:h-[32rem]"
    />
  );
}
