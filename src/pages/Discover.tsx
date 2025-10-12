import { useState, useEffect } from "react";

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
  center?: [number, number];
  zoom?: number;
}

export default function GameMap({ games, center = [37.7749, -122.4194], zoom = 12 }: GameMapProps) {
  const [map, setMap] = useState<any>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.onload = () => setLeafletLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !window.L || map) return;

    const L = window.L;

    // Fix default marker icon
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    // Initialize map
    const mapInstance = L.map("map", {
      center: center,
      zoom: zoom,
      zoomControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstance);

    // Add markers for each game
    games.forEach((game) => {
      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ${game.emoji}
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      const marker = L.marker([game.lat, game.lng], { icon }).addTo(mapInstance);

      // Create popup content
      const popupContent = `
        <div style="padding: 8px; min-width: 200px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <div>
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 700;">${game.sport}</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">${game.location}</p>
            </div>
            <span style="padding: 2px 8px; background: #e5e7eb; border-radius: 12px; font-size: 11px; white-space: nowrap;">${game.distance}</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 12px 0; font-size: 12px;">
            <div>📅 ${game.date}</div>
            <div>🕒 ${game.time}</div>
            <div>👥 ${game.players.current}/${game.players.max}</div>
            <div style="padding: 2px 6px; background: #f3f4f6; border-radius: 8px; text-align: center;">${game.skillLevel}</div>
          </div>
          <div style="padding-top: 12px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 18px; font-weight: 700; color: #667eea;">${game.price}</span>
            <button onclick="alert('Join game feature coming soon!')" style="padding: 6px 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;">Join Game</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300 });

      marker.on("click", () => {
        setSelectedGame(game);
      });
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, [leafletLoaded, games, center, zoom]);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          if (map && window.L) {
            map.setView([latitude, longitude], 14);

            // Add user location marker
            const L = window.L;
            L.marker([latitude, longitude], {
              icon: L.divIcon({
                className: "user-marker",
                html: `
                  <div style="
                    width: 20px;
                    height: 20px;
                    background: #ef4444;
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  "></div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              }),
            })
              .addTo(map)
              .bindPopup("You are here");
          }
        },
        (error) => {
          alert("Unable to get your location. Please enable location services.");
        },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  if (!leafletLoaded) {
    return (
      <div className="w-full h-96 rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
      <div id="map" className="w-full h-full"></div>

      {/* Locate Me Button */}
      <button
        onClick={handleLocateMe}
        className="absolute bottom-4 right-4 z-[1000] w-12 h-12 rounded-full bg-white shadow-lg border-2 border-blue-500 flex items-center justify-center hover:bg-blue-50 transition-all hover:scale-110"
        title="Locate Me"
      >
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  );
}
