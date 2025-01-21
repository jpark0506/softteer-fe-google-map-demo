
function computeAngleDeg(A, B, C) {
    const ABx = B.lng() - A.lng();
    const ABy = B.lat() - A.lat();
    const BCx = C.lng() - B.lng();
    const BCy = C.lat() - B.lat();

    const dot = ABx * BCx + ABy * BCy;
    const magAB = Math.sqrt(ABx * ABx + ABy * ABy);
    const magBC = Math.sqrt(BCx * BCx + BCy * BCy);
    if (magAB === 0 || magBC === 0) return 180;

    const cosTheta = dot / (magAB * magBC);
    const clamped = Math.max(-1, Math.min(1, cosTheta));
    const rad = Math.acos(clamped);
    return (rad * 180) / Math.PI;
}

function extractCornerPoints(path, angleThresholdDeg) {
    if (path.length < 3) return [...path];
    const cornerPoints = [];
    cornerPoints.push(path[0]);
    for (let i = 1; i < path.length - 1; i++) {
        const angleDeg = computeAngleDeg(path[i - 1], path[i], path[i + 1]);
        // angleDeg 이하이면 코너로 간주
        if (angleDeg <= angleThresholdDeg) {
            cornerPoints.push(path[i]);
        }
    }
    cornerPoints.push(path[path.length - 1]);
    return cornerPoints;
}

function catmullRomSpline(points, resolution = 0.1) {
    if (points.length < 2) return points;
    const result = [];
    // 가장자리(처음/끝)를 하나씩 복제하여 보강
    const ext = [points[0], ...points, points[points.length - 1]];
    for (let i = 0; i < ext.length - 3; i++) {
        const p0 = ext[i];
        const p1 = ext[i + 1];
        const p2 = ext[i + 2];
        const p3 = ext[i + 3];
        for (let t = 0; t <= 1; t += resolution) {
            const pt = catmullRomInterpolate(p0, p1, p2, p3, t);
            result.push(pt);
        }
    }
    // 마지막 점이 중복되지 않도록 처리
    result.push(points[points.length - 1]);
    return result;
}

function catmullRomInterpolate(p0, p1, p2, p3, t) {
    const x0 = p0.lng(), y0 = p0.lat();
    const x1 = p1.lng(), y1 = p1.lat();
    const x2 = p2.lng(), y2 = p2.lat();
    const x3 = p3.lng(), y3 = p3.lat();

    const t2 = t * t;
    const t3 = t2 * t;

    // Catmull-Rom basis matrix 계수
    const a1x = -0.5 * x0 + 1.5 * x1 - 1.5 * x2 + 0.5 * x3;
    const b1x = x0 - 2.5 * x1 + 2 * x2 - 0.5 * x3;
    const c1x = -0.5 * x0 + 0.5 * x2;
    const d1x = x1;

    const a1y = -0.5 * y0 + 1.5 * y1 - 1.5 * y2 + 0.5 * y3;
    const b1y = y0 - 2.5 * y1 + 2 * y2 - 0.5 * y3;
    const c1y = -0.5 * y0 + 0.5 * y2;
    const d1y = y1;

    const X = a1x * t3 + b1x * t2 + c1x * t + d1x;
    const Y = a1y * t3 + b1y * t2 + c1y * t + d1y;

    return new google.maps.LatLng(Y, X);
}

/**
 * (코너 보존) + 스플라인
 * angleThresholdDeg 이하 -> 코너로 간주
 */
function smoothPathPreservingCorners(path, angleThresholdDeg = 110, resolution = 0.1) {
    if (path.length < 2) return path;
    const corners = extractCornerPoints(path, angleThresholdDeg);
    if (corners.length < 2) return corners;

    const finalResult = [];
    for (let i = 0; i < corners.length - 1; i++) {
        const seg = [corners[i], corners[i + 1]];
        let segSmoothed = catmullRomSpline(seg, resolution);
        // 세그먼트가 이어질 때 겹치는 점 방지
        if (i > 0 && segSmoothed.length > 0) {
            segSmoothed = segSmoothed.slice(1);
        }
        finalResult.push(...segSmoothed);
    }
    return finalResult;
}