import { Vertex } from "../path/pathInterfaces";

function haversine(point1, point2) {

    const { lat: lat1, lng: lng1 } = point1;
    const { lat: lat2, lng: lng2 } = point2;

    const R = 6371000;
    const toRad = (angle) => (angle * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function centerDistance(point1: Vertex, point2: Vertex, clicked: { lat: number, lng: number }): number {
    const centerPoint = { lat: (point1.lat + point2.lat) / 2, lng: (point1.lng + point2.lng) / 2 };

    return haversine(centerPoint, clicked);
}

export default function findNearestSubEdge(pathData, { lat, lng, edgeId }) {
    const edges = pathData.edges.filter(el => el.id === edgeId);
    const vertices = edges[0].vertices;

    const pairVertices = vertices.map((el, idx) => {
        if (idx == vertices.length - 1) return undefined;

        return {
            id: idx,
            vertices: [el, vertices[idx + 1]]
        }
    }).filter(el => el != undefined);

    const edgesWithDistance = pairVertices.map((el) => {
        return {
            ...el,
            distance: centerDistance(el.vertices[0], el.vertices[1], { lat, lng })
        }
    }).sort((a, b) => { return a.distance - b.distance })

    const nearestEdge = edgesWithDistance[0];

    const distance0 = haversine(nearestEdge.vertices[0], { lat, lng });
    const distance1 = haversine(nearestEdge.vertices[1], { lat, lng });

    const nearestPoint = distance0 > distance1 ? nearestEdge.vertices[1] : nearestEdge.vertices[0];

    return {
        ...nearestEdge,
        point: nearestPoint
    }
}
