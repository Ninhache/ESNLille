import { ORGANIZATION } from './site';

export type Place = { lat: number; lng: number; address: string };

export const LILLE_BOUNDS = { south: 50.6, west: 3.0, north: 50.66, east: 3.12 };

export const ESN_OFFICE: Place = {
  lat: 50.6280717,
  lng: 3.0656847,
  address: `${ORGANIZATION.address.name}, ${ORGANIZATION.address.street}, ${ORGANIZATION.address.postalCode} ${ORGANIZATION.address.city}`,
};

/** Whether `place` lies inside `LILLE_BOUNDS`. */
export function inLille(place: Place): boolean {
  const { south, west, north, east } = LILLE_BOUNDS;
  return place.lat > south && place.lat < north && place.lng > west && place.lng < east;
}
