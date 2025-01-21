import { useEffect, useRef, useState } from "react";
import { initializeMapWithOverlay } from "../map/initializeMap";
import { pathData } from "../path/pathData";
import { useDemoPathData } from "../hooks/useDemoPathData";
import { useSubmitClickListener } from "../hooks/useSubmitClickListener";

interface MarkerData {
    id: string;
    lat: number;
    lng: number;
    content: string;
}

export default function EditorComponent() {
    const mapRef = useRef<HTMLDivElement>(null);

    const [loaded, setLoaded] = useState<boolean>(false);

    const [map, setMap] = useState<any>(null);
    const [AdvancedMarker, setAdvancedMarker] = useState<any>(null);
    const [Polyline, setPolyline] = useState<any>(null);
    const [markers, setMarkers] = useState<any[]>([]);

    useEffect(() => {
        if (!mapRef.current) return;

        const initializeMap = async () => {
            try {
                const { map: initMap, advancedMarkerConstructor, polylineConstructor } = await initializeMapWithOverlay(mapRef.current);
                setMap(initMap);
                setAdvancedMarker(() => advancedMarkerConstructor);
                setPolyline(() => polylineConstructor);
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

    // function calculateBearing(lat1, lng1, lat2, lng2) {
    //     const rad = Math.PI / 180;
    //     const y = Math.sin((lng2 - lng1) * rad) * Math.cos(lat2 * rad);
    //     const x = Math.cos(lat1 * rad) * Math.sin(lat2 * rad) -
    //               Math.sin(lat1 * rad) * Math.cos(lat2 * rad) * Math.cos((lng2 - lng1) * rad);
  
    //     const bearing = Math.atan2(y, x) * (180 / Math.PI); // 라디안 -> 도(°) 변환
    //     return (bearing + 360) % 360; // 0~360도로 변환
    // }

    // function animation(start, destination) {
    //     return new Promise((resolve) => {
    //         const { lat: startLat, lng: startLng } = start;
    //         const { lat: destLat, lng: destLng } = destination;
    
    //         const deltaLng = destLng - startLng;
    //         const deltaLat = destLat - startLat;
    
    //         const startTime = performance.now();
    
    //         function step(currentTime) {
    //             const elapsed = currentTime - startTime;
    //             const progress = Math.min(elapsed / 3000, 1); // 10초(10000ms) 기준으로 진행률 계산
    //             const currentLat = startLat + deltaLat * progress;
    //             const currentLng = startLng + deltaLng * progress;
    //             marker.element.position = { lat: currentLat, lng: currentLng };
    //             const bearing = calculateBearing(startLat, startLng, currentLat, currentLng);
                
    //             if (progress < 1) {
    //                 requestAnimationFrame(step);
    //             } else {
    //                 resolve(); // 애니메이션 완료 시 Promise 해결
    //             }
    //         }
    
    //         requestAnimationFrame(step);
    //     });
    // }
    
    // async function handleMove() {
    //     marker.element.position = { lat: 37.449167, lng: 126.653056 };
    
    //     const vertices = pathData.getVertices();
    
    //     for (let i=0; i<vertices.length-1; i++) {

    //         await animation(vertices[i], vertices[i+1]); // 각 애니메이션이 끝날 때까지 기다림
    //     }
    
    //     console.log("All animations completed");
    // }
    

    return (
            <div id="map" ref={mapRef} style={{ width: "100%", height: "90%" }}></div>
        )
};
