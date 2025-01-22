import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
import { initializeMapWithOverlay } from "../map/initializeMap";
import { useSubmitClickListener } from "../hooks/useSubmitClickListener";
import { useDemoPathAllData } from "../hooks/useDemoPathAlldata";

export default function EditorComponent() {
	const mapRef = useRef<HTMLDivElement>(null);
	const selectedRef = useRef<undefined | { pin: any; line?: any }>({ pin: null });
	const [loaded, setLoaded] = useState<boolean>(false);

	const [map, setMap] = useState<any>(null);
	const [AdvancedMarker, setAdvancedMarker] = useState<any>(null);
	const [Polyline, setPolyline] = useState<any>(null);
	const [markers, setMarkers] = useState<any[]>([]);

	const [mode, setMode] = useState<"line" | "pin">("line");
	const modeRef = useRef<"line" | "pin">("line");

	const [createLine, setCreateLine] = useState({
		start: null,
		end: null,
		points: [],
	});

	const [currentLine, setCurrentLine] = useState();

	function resetSelectedEdge() {
		if (selectedRef.current.line) selectedRef.current.line.setMap(null);
		if (selectedRef.current.pin) selectedRef.current.pin.setMap(null);

		selectedRef.current = {
			pin: null,
		};
	}

	const addMarker = (lat: number, lng: number) => {
		switch (modeRef.current) {
			case "line":
				resetSelectedEdge();
				break;
			case "pin":
				if (!selectedRef.current.pin) return;
				if (createLine.end) return;
				setCreateLine((lineInfo) => {
					return {
						...lineInfo,
						points: [...lineInfo.points, { lat, lng }],
					};
				});
				break;
		}
	};

	const removeMarker = (id: string) => {
		setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== id));
	};

	const handleMode: MouseEventHandler<HTMLButtonElement> = (e) => {
		const inputMode = e.currentTarget.name as "pin" | "line";
		resetSelectedEdge();
		modeRef.current = inputMode;
		setMode(inputMode);
	};

	useEffect(() => {
		if (!mapRef.current) return;

		const initializeMap = async () => {
			try {
				const {
					map: initMap,
					advancedMarkerConstructor,
					polylineConstructor,
				} = await initializeMapWithOverlay(mapRef.current);
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

	useSubmitClickListener(map, addMarker, loaded);
	useDemoPathAllData(map, AdvancedMarker, Polyline, selectedRef, modeRef, setCreateLine);

	useEffect(() => {
		if (Polyline) {
			const newLine = new Polyline({
				map,
				path: [],
				strokeColor: "#808080",
				strokeOpacity: 1.0,
				strokeWeight: 4,
			});
			setCurrentLine(newLine);
		}
	}, [Polyline]);

	useEffect(() => {
		if (currentLine) {
			currentLine.setPath(createLine.points);
		}
	}, [createLine]);

	function handleSubmit() {
		resetSelectedEdge();
	}

	return (
		<div style={{ height: "100%" }}>
			<div id="map" ref={mapRef} style={{ width: "100%", height: "85vh" }} />
			<div>
				{mode}
				<button name="line" onClick={handleMode}>
					위험 주의 요소 선택
				</button>
				<button name="pin" onClick={handleMode}>
					Pin 추가
				</button>
				<button onClick={handleSubmit}>경로 제출</button>
			</div>
		</div>
	);
}

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
