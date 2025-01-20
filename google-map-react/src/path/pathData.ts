import { Vertex, Edge, Path } from "./pathInterfaces";

// Vertex 정의
export const vertex1: Vertex = { id: "v1", lat: 37.449167, lng: 126.653056, isMain: true };
export const vertex2: Vertex = { id: "v2", lat: 37.450137, lng: 126.654056, isMain: false };
export const vertex3: Vertex = { id: "v3", lat: 37.452167, lng: 126.655056, isMain: false };
export const vertex4: Vertex = { id: "v4", lat: 37.451127, lng: 126.656056, isMain: true };
export const vertex5: Vertex = { id: "v5", lat: 37.453167, lng: 126.657056, isMain: true };
export const vertex6: Vertex = { id: "v6", lat: 37.454167, lng: 126.658056, isMain: false };
export const vertex7: Vertex = { id: "v7", lat: 37.455167, lng: 126.659056, isMain: true };

// Edge 정의
export const edge1: Edge = { id: "e1", vertices: [vertex1, vertex2, vertex3, vertex4] };
export const edge2: Edge = { id: "e2", vertices: [vertex4, vertex5, vertex6, vertex7] };

// 전체 경로 데이터
export const pathData = new Path("path1", [edge1, edge2]);