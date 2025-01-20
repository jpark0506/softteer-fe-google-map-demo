import { pathData } from "../path/pathData";
import { Vertex } from "../path/pathInterfaces";

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000; // 지구 반지름 (미터)
    const toRad = (angle) => (angle * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function perpendicularDistance(start:Vertex, end1:Vertex, clicked:{lat: number, lng:number}):number{
    const {lat:lat1, lng:lng1} = start;
    const {lat:lat2, lng:lng2} = end1;
    const {lat:lat3, lng:lng3} = clicked;
    
    // 선분 AB의 두 끝점 사이 거리
    const AB = haversine(lat1, lng1, lat2, lng2);

    // 점 C와 두 끝점 A, B 사이의 거리
    const AC = haversine(lat1, lng1, lat3, lng3);
    const BC = haversine(lat2, lng2, lat3, lng3);

    // 선분 AB의 수직 거리 계산
    const s = (AB + AC + BC) / 2; // 반둘레
    const area = Math.sqrt(s * (s - AB) * (s - AC) * (s - BC)); // 헤론 공식
    const distance = (2 * area) / AB; // 높이 = (2 * 면적) / 밑변

    return distance;
}

function findNearestSubEdge({ lat, lng, edgeId }) {
        const edges = pathData.edges.filter(el => el.id === edgeId);
        const vertices = edges[0].vertices;

        const pairVertices = vertices.map((el, idx)=> {
            if(idx == vertices.length-1) return undefined;

            return {
                id: idx,
                vertices: [el, vertices[idx+1]]
            }
        }).filter(el => el!=undefined);

        pairVertices.sort((a, b)=> {
            return perpendicularDistance(a.vertices[0], a.vertices[1], {lat, lng}) - perpendicularDistance(b.vertices[0], b.vertices[1], {lat, lng})
        })


        return pairVertices[0].id;
    }
