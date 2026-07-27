import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { OFFICE_LOCATION } from "../../utils/officeLocation";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  latitude: number;
  longitude: number;
}

export default function AttendanceMap({ latitude, longitude }: Props) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      style={{
        height: "450px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[latitude, longitude]}>
        <Popup>Your Location</Popup>
      </Marker>

      <Marker position={[OFFICE_LOCATION.latitude, OFFICE_LOCATION.longitude]}>
        <Popup>Office</Popup>
      </Marker>
    </MapContainer>
  );
}
