import { useEffect } from "react";
import findNearestSubEdge from "../utils/findEdge";
import { convertJsonToPaths } from "../path/jsonToPath";
import jsonData from "../path/coordinates.json";

export const useDemoPathAllData = (map, AdvancedMarker, Polyline, selectedRef, modeRef, setCreateLine) => {
	useEffect(() => {
		if (!map || !AdvancedMarker || !Polyline) return;

		convertJsonToPaths(jsonData).forEach((el) => {
			el.getMainVertices().forEach((vertex) => {
				new AdvancedMarker({
					map,
					position: { lat: vertex.lat, lng: vertex.lng },
					title: `Main Vertex: ${vertex.id}`,
				});
			});
		});
		// 각 Edge의 경로를 표시
		convertJsonToPaths(jsonData).forEach((el) =>
			el.edges.forEach((edge) => {
				const pathCoordinates = edge.vertices.map((v) => ({
					lat: v.lat,
					lng: v.lng,
				}));

				const polyline = new Polyline({
					map,
					path: pathCoordinates,
					strokeColor: "#FF0000",
					strokeOpacity: 1.0,
					strokeWeight: 2,
				});

				// 클릭 이벤트 (Polyline 클릭 시)
				polyline.addListener("click", (event) => {
					const lat = event.latLng.lat();
					const lng = event.latLng.lng();

					const { id, vertices, distance, point } = findNearestSubEdge(el, { lat, lng, edgeId: edge.id });

					if (modeRef.current === "line") {
						if (selectedRef.current.line) selectedRef.current.line.setMap(null);
						if (selectedRef.current.pin) selectedRef.current.pin.setMap(null);

						selectedRef.current = {
							pin: null,
						};

						const selectedPolyline = new Polyline({
							map,
							path: [
								{ lat: vertices[0].lat, lng: vertices[0].lng },
								{ lat: vertices[1].lat, lng: vertices[1].lng },
							],
							strokeColor: "#0000FF",
							strokeOpacity: 1.0,
							strokeWeight: 5,
						});

						const centerVertex = {
							lat: (vertices[0].lat + vertices[1].lat) / 2,
							lng: (vertices[0].lng + vertices[1].lng) / 2,
						};

						const svgContainer = document.createElement("div");
						svgContainer.innerHTML = `<img src="/public/pin_danger.svg" alt="Custom SVG" style="width: 40px; height: 40px;">`;

						const dangerMakrer = new AdvancedMarker({
							map,
							position: centerVertex,
							content: svgContainer,
						});

						selectedRef.current = {
							line: selectedPolyline,
							pin: dangerMakrer,
						};

						selectedPolyline.addListener("click", () => {
							selectedPolyline.setMap(null);
							dangerMakrer.setMap(null);
							selectedRef.current = {
								line: null,
								pin: null,
							};
						});
					} else {
						const svgContainer = document.createElement("div");

						const isStart = selectedRef.current.pin === null ? true : false;

						svgContainer.innerHTML = `<img src="/public/pin_${isStart ? "start" : "end"}.svg" alt="Custom SVG" style="width: 40px; height: 40px;">`;

						const marker = new AdvancedMarker({
							map,
							position: { lat: point.lat, lng: point.lng },
							content: svgContainer,
						});

						if (isStart) {
							marker.addListener("click", () => {
								setCreateLine((prevInfo) => {
									const _endMarker = prevInfo.end;

									_endMarker.setMap(null);
									marker.setMap(null);
									return {
										start: null,
										end: null,
										points: [],
									};
								});

								selectedRef.current.pin = null;
							});

							setCreateLine({
								start: marker,
								end: null,
								points: [{ lat: point.lat, lng: point.lng }],
							});

							selectedRef.current.pin = marker;
						} else {
							marker.addListener("click", () => {
								setCreateLine((prevInfo) => {
									return { ...prevInfo, end: null, points: prevInfo.points.slice(0, -1) };
								});
								marker.setMap(null);
							});

							setCreateLine((prevInfo) => {
								return {
									...prevInfo,
									end: marker,
									points: [...prevInfo.points, { lat: point.lat, lng: point.lng }],
								};
							});
						}
					}
				});
			}),
		);
	}, [map, AdvancedMarker, Polyline]);
};
