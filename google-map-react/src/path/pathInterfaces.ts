/**
 * Vertex를 나타내는 인터페이스
 */
export interface Vertex {
    id: string;
    lat: number;
    lng: number;
    isMain: boolean; // 메인 Vertex인지 여부
  }
  
  /**
   * Edge를 나타내는 인터페이스
   * Vertex들로 이루어진 경로
   */
  export interface Edge {
    id: string;
    vertices: Vertex[]; // 연결된 Vertex들의 배열
  }
  
  /**
   * Subvertex가 포함된 경로를 나타내는 클래스
   */
  export class Path {
    id: string;
    edges: Edge[];
  
    constructor(id: string, edges: Edge[]) {
      this.id = id;
      this.edges = edges;
    }
  
    /**
     * 메인 Vertex를 반환
     */
    getMainVertices(): Vertex[] {
      return this.edges.flatMap((edge) =>
        edge.vertices.filter((vertex) => vertex.isMain)
      );
    }

    getVertices(): Vertex[] {
      return this.edges.flatMap(edge => edge.vertices);
    }
  }