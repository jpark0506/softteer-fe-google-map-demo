/* ===================================================
   (2) sampling.js
   - 일정 간격 샘플링 + 거리 계산
=================================================== */
function sampleLineByDistance(path, intervalMeters) {
    const newPath = [];
    if (path.length === 0) return newPath;

    newPath.push(path[0]);
    let distanceSoFar = 0;

    for (let i = 1; i < path.length; i++) {
        let start = path[i - 1];
        let end = path[i];
        let segDist = google.maps.geometry.spherical.computeDistanceBetween(start, end);

        while (distanceSoFar + segDist >= intervalMeters) {
            const remain = intervalMeters - distanceSoFar;
            const frac = remain / segDist;
            const interp = google.maps.geometry.spherical.interpolate(start, end, frac);
            newPath.push(interp);

            start = interp;
            segDist = google.maps.geometry.spherical.computeDistanceBetween(start, end);
            distanceSoFar = 0;
        }
        distanceSoFar += segDist;
    }

    const lastPt = path[path.length - 1];
    if (!lastPt.equals(newPath[newPath.length - 1])) {
        newPath.push(lastPt);
    }

    return newPath;
}

function computeTotalDistance(path) {
    let total = 0;
    for (let i = 1; i < path.length; i++) {
        total += google.maps.geometry.spherical.computeDistanceBetween(
            path[i - 1],
            path[i]
        );
    }
    return total; // meter
}