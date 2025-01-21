import { useEffect } from "react";
import { pathData } from "../path/pathData";

export const useDemoPathData = (map, AdvancedMarker, Polyline) => {
    
      useEffect(()=>{
        if (!map || !AdvancedMarker  || !Polyline) return;
    
        pathData.getMainVertices().forEach((vertex) => {
          new AdvancedMarker({
            map,
            position: { lat: vertex.lat, lng: vertex.lng },
            title: `Main Vertex: ${vertex.id}`,
          });
        });
    
        // 각 Edge의 경로를 표시
        pathData.edges.forEach((edge) => {
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
          polyline.addListener("click", () => {
            alert(`Clicked on Edge: ${edge.id}`);
          });

          polyline.addListener("click", () => {
            alert(`Clicked on Edge: ${edge.id}`);
          });
    
          // hover 이벤트
          polyline.addListener("mouseover", () => {
            console.log(`Entered Edge: ${edge.id}`);
            polyline.setOptions({ strokeColor: "#00FF00" }); // Hover 시 색상 변경
          });
          polyline.addListener("mouseout", () => {
            console.log(`Left Edge: ${edge.id}`);
            polyline.setOptions({ strokeColor: "#FF0000" }); // 원래 색상으로 복원
          });
        });
      }, [map, AdvancedMarker, Polyline]);
}