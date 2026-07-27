import { getDistance } from "geolib";

export const calculateDistance = (
  userLat: number,
  userLng: number,
  officeLat: number,
  officeLng: number
) => {
  return getDistance(
    {
      latitude: userLat,
      longitude: userLng,
    },
    {
      latitude: officeLat,
      longitude: officeLng,
    }
  );
};