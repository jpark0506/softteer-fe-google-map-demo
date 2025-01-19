/* ===================================================
   (4) drawLogic.js
   - 드로잉 & 최종 보정
=================================================== */

/**
 * (추가) 강한 보정 함수
 * - 멀티 패스로 여러 번 스플라인 & 코너 보존
 * - angleThresholdDeg를 더 낮게(예: 60) 설정
 * - resolution을 더 작게(예: 0.05) -> 곡선 점이 많아짐
 */
function heavySmoothPath(path) {
    let smoothed = [...path];
    // 필요하다면 여러 번(2~3회) 반복
    for (let i = 0; i < 2; i++) {
        smoothed = smoothPathPreservingCorners(
            smoothed,
            60,   // 코너 간주 각도(낮을수록 더 매끄럽게)
            0.05  // 스플라인 해상도(값이 작을수록 촘촘히 보정)
        );
    }
    return smoothed;
}

/**
 * 드로잉 시작
 */
function startNewStrokePoint(latLng) {
    const pathObj = getActivePath();
    if (!pathObj) return;
    pathObj.originalPath.push(latLng);
    updateCoordinateDisplay(latLng);

    // 실시간 보정(보라색) 업데이트
    updateRealTimeSpline(pathObj);
}

/**
 * 드로잉 중
 */
function continueStrokePoint(latLng) {
    const pathObj = getActivePath();
    if (!pathObj) return;
    const lastPt = pathObj.originalPath[pathObj.originalPath.length - 1];
    if (lastPt && lastPt.equals(latLng)) return;

    pathObj.originalPath.push(latLng);
    updateCoordinateDisplay(latLng);

    // 실시간 보정(보라색) 업데이트
    updateRealTimeSpline(pathObj);
}

/**
 * 드로잉 종료
 */
function finishStroke() {
    const pathObj = getActivePath();
    if (!pathObj) return;

    // "실시간" 보라색 라인 제거
    if (pathObj.realTimePolyline) {
        pathObj.realTimePolyline.setMap(null);
        pathObj.realTimePolyline = null;
    }

    // 최종 보정 & 샘플링
    finalizePath(pathObj);
}

/**
 * 드로잉 중 실시간 보정 (보라색)
 */
function updateRealTimeSpline(pathObj) {
    if (pathObj.originalPath.length < 2) {
        return; // 점이 1개 이하면 곡선 불가
    }

    // 1) '강한 보정'으로 실시간 스플라인
    const smoothed = heavySmoothPath(pathObj.originalPath);

    // 2) 기존 라인 제거
    if (pathObj.realTimePolyline) {
        pathObj.realTimePolyline.setMap(null);
    }
    // 3) 새로 그림
    pathObj.realTimePolyline = new google.maps.Polyline({
        path: smoothed,
        strokeColor: "#AA00FF", // 보라색
        strokeWeight: 3,
        strokeOpacity: 0.7,
        map: map,
    });
}

/**
 * 최종 보정 + 샘플링
 * => (수정) 보완된 경로는 거리/좌표 정보만 남기고, 지도에서는 제거
 */
function finalizePath(pathObj) {
    if (pathObj.originalPath.length < 2) return;

    // 1) '강한 보정' 스플라인 (직각 코너 보존)
    const smoothedPath = heavySmoothPath(pathObj.originalPath);

    // 2) "최종" 빨간 라인 => 지도에 표시했다가 바로 제거
    if (pathObj.finalPolyline) {
        pathObj.finalPolyline.setMap(null);
    }
    pathObj.finalPolyline = new google.maps.Polyline({
        path: smoothedPath,
        strokeColor: "#FF0000",
        strokeWeight: 4,
        strokeOpacity: 1.0,
        map: map,
    });

    // 3) 일정 간격(10m) 샘플링
    const subNodes = sampleLineByDistance(smoothedPath, 10);
    pathObj.subNodes = subNodes;

    // 파란 라인 -> 지도에 표시 후 바로 제거
    if (pathObj.subPolyline) {
        pathObj.subPolyline.setMap(null);
        pathObj.subPolyline = null;
    }
    pathObj.subPolyline = new google.maps.Polyline({
        path: subNodes,
        strokeColor: "#0000FF",
        strokeWeight: 2,
        strokeOpacity: 0.8,
        map: map
    });

    // 4) 서브노드 마커
    clearSubMarkers(pathObj);
    pathObj.subMarkers = subNodes.map(pt => {
        return new google.maps.Marker({
            position: pt,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: "#0000FF",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 1,
                scale: 3
            },
            map: map
        });
    });

    // 5) 거리 계산
    const totalDist = computeTotalDistance(smoothedPath);
    const distKm = (totalDist / 1000).toFixed(3) + " km";
    document.getElementById("finalDistance").textContent = "길이: " + distKm;

    // 6) 서브노드 정보 표시
    const output = subNodes.map((p, i) =>
        `${i}: (${p.lat().toFixed(6)}, ${p.lng().toFixed(6)})`
    );
    document.getElementById("resampledOutput").textContent = output.join("\n");

    // ★ (추가) 최종 폴리라인과 서브노드는 지도에서 삭제
    //    즉, 사용자에게 시각적 정보는 바로 안 남기고, 
    //    거리/좌표 텍스트 정보만 남긴다.
    setTimeout(() => {
        // 빨간 라인 삭제
        if (pathObj.finalPolyline) {
            pathObj.finalPolyline.setMap(null);
        }
        // 파란 라인 삭제
        // if (pathObj.subPolyline) {
        //   pathObj.subPolyline.setMap(null);
        // }
        // // 서브노드 마커 삭제
        // if (pathObj.subMarkers) {
        //   pathObj.subMarkers.forEach(mk => mk.setMap(null));
        // }
    }, 500); // 0.5초 뒤에 제거 (조금만 보고 사라짐)
}