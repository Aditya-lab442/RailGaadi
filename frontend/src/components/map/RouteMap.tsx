import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { LiveTrainData } from '../../types/train';
import { MAP_CONFIG } from '../../constants/config';
import { MapControls } from './MapControls';
import { Maximize2, Minimize2 } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

interface RouteMapProps {
  data: LiveTrainData;
  height?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  data,
  height = '440px',
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const trainMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current) return;

    const initialCenter: [number, number] = data?.position
      ? [data.position.lng, data.position.lat]
      : MAP_CONFIG.defaultCenter;

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_CONFIG.style,
      center: initialCenter,
      zoom: data?.position ? 7 : MAP_CONFIG.defaultZoom,
      pitch: MAP_CONFIG.pitch,
      bearing: MAP_CONFIG.bearing,
      attributionControl: false,
    });

    mapInstance.on('load', () => {
      setIsLoaded(true);

      // Add polyline source and layers if polyline exists
      if (data?.route?.polyline && data.route.polyline.length > 0) {
        const polylineCoords = data.route.polyline;

        // Fit map bounds to polyline
        try {
          const bounds = polylineCoords.reduce(
            (acc, coord) => acc.extend(coord as [number, number]),
            new maplibregl.LngLatBounds(polylineCoords[0] as [number, number], polylineCoords[0] as [number, number])
          );
          mapInstance.fitBounds(bounds, { padding: 40, maxZoom: 10 });
        } catch (e) {}

        // Passed vs Remaining polyline split calculation
        const passedCoords = polylineCoords.slice(0, Math.ceil(polylineCoords.length * (data.journeyCompletionPercent / 100)));
        const remainingCoords = polylineCoords.slice(Math.max(0, passedCoords.length - 1));

        // Source: Passed Route
        mapInstance.addSource('route-passed', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: passedCoords.length > 0 ? passedCoords : [polylineCoords[0]],
            },
          },
        });

        // Layer: Passed Route Glow
        mapInstance.addLayer({
          id: 'route-passed-glow',
          type: 'line',
          source: 'route-passed',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#34C759',
            'line-width': 8,
            'line-opacity': 0.3,
          },
        });

        // Layer: Passed Route Core
        mapInstance.addLayer({
          id: 'route-passed-core',
          type: 'line',
          source: 'route-passed',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#34C759',
            'line-width': 4,
          },
        });

        // Source: Remaining Route
        mapInstance.addSource('route-remaining', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: remainingCoords.length > 0 ? remainingCoords : polylineCoords,
            },
          },
        });

        // Layer: Remaining Route
        mapInstance.addLayer({
          id: 'route-remaining-core',
          type: 'line',
          source: 'route-remaining',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#007AFF',
            'line-width': 3,
            'line-dasharray': [2, 2],
          },
        });
      }

      // Filter station markers: only show halting stations with valid lat/lng
      const haltingStations = (data?.route?.stations || []).filter(
        (st) => st.isHalt !== false && st.lat && st.lng
      );

      haltingStations.forEach((station) => {
        const el = document.createElement('div');
        el.className = 'station-marker';
        el.style.width = station.status === 'current' ? '14px' : '9px';
        el.style.height = station.status === 'current' ? '14px' : '9px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = station.status === 'passed' ? '#34C759' : station.status === 'current' ? '#007AFF' : '#8E8E93';
        el.style.border = '2px solid #FFFFFF';
        el.style.boxShadow = station.status === 'current' ? '0 0 12px rgba(0, 122, 255, 0.8)' : '0 1px 3px rgba(0,0,0,0.2)';
        el.style.cursor = 'pointer';

        const timeStr = formatTime(station.scheduledArrival || station.scheduledDeparture);

        const popup = new maplibregl.Popup({ offset: 12 }).setHTML(`
          <div style="font-weight: 700; font-size: 0.875rem; color: #1C1C1E;">${station.name} (${station.code})</div>
          <div style="font-size: 0.781rem; color: #636366; margin-top: 2px;">Scheduled: ${timeStr}</div>
          <div style="font-size: 0.781rem; color: ${station.delayMinutes > 0 ? '#FF9500' : '#34C759'}; font-weight: 600; margin-top: 2px;">
            ${station.delayMinutes > 0 ? `Delayed ${station.delayMinutes} min` : 'On Time'}
          </div>
        `);

        new maplibregl.Marker({ element: el })
          .setLngLat([station.lng, station.lat])
          .setPopup(popup)
          .addTo(mapInstance);
      });

      // ── Current Station Train Indicator ──────────────────────────────────
      // Show a vivid animated train icon pinned exactly at the current station
      const cur = data?.currentStation;
      if (cur && cur.lat && cur.lng) {
        // Inject keyframe animation once
        const styleId = 'rg-station-pulse-style';
        if (!document.getElementById(styleId)) {
          const styleTag = document.createElement('style');
          styleTag.id = styleId;
          styleTag.textContent = `
            @keyframes rg-pulse-ring {
              0%   { transform: scale(1);   opacity: 0.8; }
              70%  { transform: scale(2.2); opacity: 0; }
              100% { transform: scale(2.2); opacity: 0; }
            }
            @keyframes rg-pulse-bounce {
              0%, 100% { transform: translateY(0px); }
              50%       { transform: translateY(-4px); }
            }
            .rg-station-train-pin {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            }
            .rg-station-train-pin .rg-pulse-ring {
              position: absolute;
              width: 46px;
              height: 46px;
              border-radius: 50%;
              background: rgba(255, 149, 0, 0.45);
              animation: rg-pulse-ring 1.6s ease-out infinite;
            }
            .rg-station-train-pin .rg-pulse-ring-2 {
              animation-delay: 0.55s;
            }
            .rg-station-train-pin .rg-core {
              position: relative;
              z-index: 2;
              width: 42px;
              height: 42px;
              border-radius: 50%;
              background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
              border: 3px solid #FFFFFF;
              box-shadow: 0 4px 18px rgba(255, 149, 0, 0.65), 0 0 0 3px rgba(255,149,0,0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              animation: rg-pulse-bounce 2s ease-in-out infinite;
            }
          `;
          document.head.appendChild(styleTag);
        }

        const pinEl = document.createElement('div');
        pinEl.className = 'rg-station-train-pin';
        pinEl.innerHTML = `
          <div class="rg-pulse-ring"></div>
          <div class="rg-pulse-ring rg-pulse-ring-2"></div>
          <div class="rg-core">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="#FFFFFF" stroke-width="2.2"
                 stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="3" width="16" height="16" rx="2"/>
              <path d="M4 11h16"/>
              <path d="M12 3v8"/>
              <circle cx="8" cy="15" r="1"/>
              <circle cx="16" cy="15" r="1"/>
              <path d="m8 19-2 2"/>
              <path d="m16 19 2 2"/>
            </svg>
          </div>
        `;

        const delayStr = data.delayMinutes > 0
          ? `<span style="color:#FF9500;font-weight:700;">+${data.delayMinutes} min delayed</span>`
          : `<span style="color:#34C759;font-weight:700;">On time</span>`;

        const stationPopup = new maplibregl.Popup({ offset: 28, closeButton: false }).setHTML(`
          <div style="font-size:0.75rem;color:#FF9500;font-weight:700;letter-spacing:0.5px;margin-bottom:3px;">🚆 TRAIN IS HERE</div>
          <div style="font-weight:700;font-size:0.9375rem;color:#1C1C1E;">${cur.name}</div>
          <div style="font-size:0.78rem;color:#636366;margin-top:2px;">${cur.code} &nbsp;·&nbsp; ${delayStr}</div>
        `);

        new maplibregl.Marker({ element: pinEl, anchor: 'center' })
          .setLngLat([cur.lng, cur.lat])
          .setPopup(stationPopup)
          .addTo(mapInstance);
      }
      // ─────────────────────────────────────────────────────────────────────
    });

    map.current = mapInstance;

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Update Train Marker on position change
  useEffect(() => {
    if (!map.current || !data?.position) return;

    const { lng, lat, bearing } = data.position;
    if (!lng || !lat) return;

    if (!trainMarkerRef.current) {
      // Create Custom Train SVG Marker
      const trainEl = document.createElement('div');
      trainEl.style.width = '38px';
      trainEl.style.height = '38px';
      trainEl.style.borderRadius = '50%';
      trainEl.style.backgroundColor = '#007AFF';
      trainEl.style.display = 'flex';
      trainEl.style.alignItems = 'center';
      trainEl.style.justifyContent = 'center';
      trainEl.style.boxShadow = '0 0 16px rgba(0, 122, 255, 0.6)';
      trainEl.style.border = '2.5px solid #FFFFFF';
      trainEl.style.cursor = 'pointer';
      trainEl.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="3" width="16" height="16" rx="2" />
          <path d="M4 11h16" />
          <path d="M12 3v8" />
          <circle cx="8" cy="15" r="1" />
          <circle cx="16" cy="15" r="1" />
          <path d="m8 19-3 3" />
          <path d="m16 19 3 3" />
        </svg>
      `;

      trainMarkerRef.current = new maplibregl.Marker({ element: trainEl, rotation: bearing })
        .setLngLat([lng, lat])
        .addTo(map.current);
    } else {
      trainMarkerRef.current.setLngLat([lng, lat]);
      trainMarkerRef.current.setRotation(bearing);
    }
  }, [data?.position, isLoaded]);

  // Recenter handler
  const handleRecenter = () => {
    if (!map.current || !data?.position) return;
    map.current.flyTo({
      center: [data.position.lng, data.position.lat],
      zoom: 8,
      pitch: 30,
    });
  };

  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: isFullscreen ? '100vh' : height,
        borderRadius: isFullscreen ? 0 : 'var(--radius-lg)',
        overflow: 'hidden',
        border: isFullscreen ? 'none' : '1px solid var(--border-subtle)',
        boxShadow: isFullscreen ? 'none' : 'var(--shadow-md)',
      }}
    >
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* Floating Map Controls */}
      <MapControls
        onRecenter={handleRecenter}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      {/* Fullscreen Toggle */}
      {onToggleFullscreen && (
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            backgroundColor: 'var(--bg-glass)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
          }}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          <span>{isFullscreen ? 'Close Map' : 'Expand Map'}</span>
        </button>
      )}
    </div>
  );
};
