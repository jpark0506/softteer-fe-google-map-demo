import { useEffect, useRef, useState } from "react";
import { initializeMapWithOverlay } from "./initializeMap";
import { pathData } from "../path/pathData";
import { useDemoPathData } from "../hooks/useDemoPathData";
import { useSubmitClickListener } from "../hooks/useSubmitClickListener";

interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  content: string;
}

const MapComponent = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  const [map, setMap] = useState<any>(null);
  const [AdvancedMarker, setAdvancedMarker] = useState<any>(null);
  const [Polyline, setPolyline] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      try {
        const { map: initMap, advancedMarkerConstructor, polylineConstructor } = await initializeMapWithOverlay(mapRef.current);
        setMap(initMap);
        setAdvancedMarker(()=>advancedMarkerConstructor);
        setPolyline(()=>polylineConstructor);
        setLoaded(true);
      } catch (e) {
        console.error("[ERROR] MapComponent init Error", e);
      }
    };

    initializeMap();

    return () => {
      markers.forEach((marker) => {
        removeMarker(marker.id);
      });
    };
  }, []);
  
  const addMarker = (lat: number, lng: number) => {
    if (!map || !AdvancedMarker) return;

    const newMarker: MarkerData = {
      id: `marker-${Date.now()}`,
      lat,
      lng,
      content: `Marker at (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
    };

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

    const element = document.createElement("div");
    element.style.color = "blue";
    element.style.fontSize = "14px";
    element.style.padding = "5px";
    element.style.border = "1px solid black";
    element.style.backgroundColor = "white";
    element.innerText = newMarker.content;

    new AdvancedMarker({
      map,
      content: element,
      position: { lat, lng },
    });
  };

  useSubmitClickListener(map, addMarker, loaded);
  useDemoPathData(map, AdvancedMarker, Polyline);

  const removeMarker = (id: string) => {
    setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== id));
  };

  return <div id="map" ref={mapRef} style={{ width: "100%", height: "100%" }}></div>;
};

export default MapComponent;