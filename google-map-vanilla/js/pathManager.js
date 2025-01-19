/* ===================================================
   (3) pathManager.js
   - 여러 개의 길 관리 + 
     서브노드 표시/숨김(toggle) 처리 위해 subMarkers도 추가
=================================================== */
let paths = [];
let activePathIndex = -1;

// 서브노드 표시 여부 (true: 보이기, false: 숨기기)
let subNodesVisible = true;

function createNewPath() {
    const newPath = {
        originalPath: [],
        realTimePolyline: null,
        finalPolyline: null,
        subNodes: [],
        subPolyline: null,
        subMarkers: []
    };
    paths.push(newPath);
    switchPath(paths.length - 1);
}

function switchPath(stepOrIndex) {
    if (paths.length === 0) return;
    let newIndex = activePathIndex;

    if (stepOrIndex === 1 || stepOrIndex === -1) {
        newIndex = activePathIndex + stepOrIndex;
        if (newIndex < 0) newIndex = paths.length - 1;
        if (newIndex >= paths.length) newIndex = 0;
    } else {
        newIndex = stepOrIndex;
    }

    if (newIndex < 0 || newIndex >= paths.length) return;
    activePathIndex = newIndex;
    document.getElementById("activePathIndex").textContent = activePathIndex + 1;
}

function getActivePath() {
    if (activePathIndex < 0 || activePathIndex >= paths.length) return null;
    return paths[activePathIndex];
}

function clearCurrentPath() {
    const pathObj = getActivePath();
    if (!pathObj) return;

    pathObj.originalPath = [];

    // 임시(실시간) 라인 제거
    if (pathObj.realTimePolyline) {
        pathObj.realTimePolyline.setMap(null);
        pathObj.realTimePolyline = null;
    }

    // 최종(빨간) 라인 제거
    if (pathObj.finalPolyline) {
        pathObj.finalPolyline.setMap(null);
        pathObj.finalPolyline = null;
    }

    // 서브노드 파란 라인 제거
    if (pathObj.subPolyline) {
        pathObj.subPolyline.setMap(null);
        pathObj.subPolyline = null;
    }
    pathObj.subNodes = [];

    // 서브노드 마커 제거
    clearSubMarkers(pathObj);

    document.getElementById("finalDistance").textContent = "길이: -";
    document.getElementById("resampledOutput").textContent = "(결과가 여기에 표시됩니다)";
}

/** "재샘플링" 버튼 */
function resampleCurrentPath() {
    const pathObj = getActivePath();
    if (!pathObj) return;
    if (pathObj.originalPath.length < 2) {
        alert("경로가 충분하지 않습니다.");
        return;
    }
    finalizePath(pathObj);
}

/** 서브노드 마커/라인을 표시 or 숨기기 (toggle) */
function toggleSubNodes() {
    subNodesVisible = !subNodesVisible;
    const pathObj = getActivePath();
    if (!pathObj) return;

    if (pathObj.subPolyline) {
        pathObj.subPolyline.setMap(subNodesVisible ? map : null);
    }

    if (pathObj.subMarkers) {
        pathObj.subMarkers.forEach(mk => {
            mk.setMap(subNodesVisible ? map : null);
        });
    }
}

/** 서브노드 마커 모두 제거 */
function clearSubMarkers(pathObj) {
    if (!pathObj.subMarkers) return;
    pathObj.subMarkers.forEach(mk => mk.setMap(null));
    pathObj.subMarkers = [];
}