import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, MapPin } from "lucide-react";

// Fix for default marker icons in React-Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Game {
  id: number;
  sport: string;
  emoji: string;
  location: string;
  address: string;
  date: string;
  time: string;
  distance: string;
  players: { current: number; max: number };
  skillLevel: string;
  hostName: string;
  hostRating: number;
  price: string;
  lat: number;
  lng: number;
}

interface GameMapProps {
  games: Game[];
  center?: LatLngExpression;
  zoom?: number;
}

// Component to handle map centering
const MapController = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

// Custom colored marker icons
const createCustomIcon = (emoji: string) => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="20" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
        <text x="24" y="30" font-size="20" text-anchor="middle" fill="white">${emoji}</text>
      </svg>
    `)}`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

export const GameMap = ({ games, center = [40.7128, -74.0060], zoom = 12 }: GameMapProps) => {
  const mapRef = useRef<any>(null);

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden border-2 border-border shadow-elevated">
      <MapContainer
        ref={mapRef}
        // @ts-ignore - react-leaflet typing issue
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          // @ts-ignore - react-leaflet typing issue
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={center} />

        {games.map((game) => (
          <Marker
            key={game.id}
            position={[game.lat, game.lng]}
            // @ts-ignore - react-leaflet typing issue
            icon={createCustomIcon(game.emoji)}
          >
            <Popup 
              // @ts-ignore - react-leaflet typing issue
              maxWidth={320} 
              className="custom-popup"
            >
              <div className="p-2">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{game.sport}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="text-xs">{game.location}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {game.distance}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium">{game.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium">{game.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium">
                      {game.players.current}/{game.players.max}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs w-fit">
                    {game.skillLevel}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm font-bold text-primary">
                    {game.price}
                  </div>
                  <Button size="sm" className="h-7 text-xs gradient-primary text-white">
                    Join Game
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Locate Me Button */}
      <button
        className="absolute bottom-4 right-4 z-[1000] w-10 h-10 rounded-full bg-white shadow-elevated border-2 border-border flex items-center justify-center hover:bg-muted transition-smooth"
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                mapRef.current?.setView([latitude, longitude], 13);
              },
              (error) => {
                console.error("Error getting location:", error);
              }
            );
          }
        }}
        title="Locate Me"
      >
        <MapPin className="w-5 h-5 text-primary" />
      </button>
    </div>
  );
};
