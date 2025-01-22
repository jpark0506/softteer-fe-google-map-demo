import { Edge, Path, Vertex } from "./pathInterfaces";
import jsonData from "./coordinates.json"; // J
/**
 * JSON 데이터를 Path 객체로 변환
 * @param jsonData JSON 데이터
 * @returns Path 배열
 */
export function convertJsonToPaths(jsonData: any): Path[] {
  const paths: Path[] = [];

  // JSON 데이터 순회
  for (const [pathId, verticesData] of Object.entries(jsonData)) {
    const vertices: Vertex[] = verticesData.map((vertex: any, index: number) => ({
      id: `vertex-${pathId}-${index}`,
      lat: vertex.lat,
      lng: vertex.lng,
      isMain: index === 0 || index === verticesData.length - 1 // 첫 번째와 마지막 Vertex를 메인으로 설정
    }));

    const edges: Edge[] = [];

    // Vertex 배열을 기반으로 Edge 생성
    for (let i = 0; i < vertices.length - 1; i++) {
      edges.push({
        id: `edge-${pathId}-${i}`,
        vertices: [vertices[i], vertices[i + 1]]
      });
    }

    // Path 객체 생성
    const path = new Path(pathId, edges);
    paths.push(path);
  }

  return paths;
}

console.log(convertJsonToPaths(jsonData));