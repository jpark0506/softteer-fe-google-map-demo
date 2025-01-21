/* ===================================================
   (5) map.js
   - 지도 초기화 + 터치/마우스 이벤트
=================================================== */
let map;
let overlay;
let currentMode = "draw";

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.449167, lng: 126.653056 },
        zoom: 17,
        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        gestureHandling: "none",
    });

    overlay = new google.maps.OverlayView();
    overlay.onAdd = function () { };
    overlay.draw = function () { };
    overlay.onRemove = function () { };
    overlay.setMap(map);

    // 기본 경로 하나 생성
    createNewPath();

    // Touch
    const mapDiv = map.getDiv();
    mapDiv.addEventListener("touchstart", handleTouchStart, { passive: false });
    mapDiv.addEventListener("touchmove", handleTouchMove, { passive: false });
    mapDiv.addEventListener("touchend", handleTouchEnd, { passive: false });

    // Mouse
    mapDiv.addEventListener("mousedown", handleMouseDown);
    mapDiv.addEventListener("mousemove", handleMouseMove);
    mapDiv.addEventListener("mouseup", handleMouseUp);
}

function setModeDraw() {
    currentMode = "draw";
    setMapInteractionsEnabled(false);
}

function setModePan() {
    currentMode = "pan";
    setMapInteractionsEnabled(true);
}

function setMapInteractionsEnabled(enabled) {
    map.setOptions({
        draggable: enabled,
        scrollwheel: enabled,
        disableDoubleClickZoom: !enabled,
        gestureHandling: enabled ? "auto" : "none",
    });
}

function getLatLngFromEvent(e) {
    const rect = map.getDiv().getBoundingClientRect();
    let x, y;
    if (e.touches && e.touches[0]) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }
    const proj = overlay.getProjection();
    if (!proj) return null;
    return proj.fromContainerPixelToLatLng(new google.maps.Point(x, y));
}

function updateCoordinateDisplay(latLng) {
    document.getElementById("coordinates").textContent =
        `Lat: ${latLng.lat().toFixed(6)}, Lng: ${latLng.lng().toFixed(6)}`;
}

/* Touch */
let isDrawing = false;
function handleTouchStart(e) {
    if (currentMode !== "draw") return;
    isDrawing = true;
    e.preventDefault();
    const latLng = getLatLngFromEvent(e);
    if (latLng) startNewStrokePoint(latLng);
}
function handleTouchMove(e) {
    if (currentMode !== "draw") return;
    e.preventDefault();
    if (!isDrawing) return;
    const latLng = getLatLngFromEvent(e);
    if (latLng) continueStrokePoint(latLng);
}
function handleTouchEnd(e) {
    if (currentMode !== "draw") return;
    isDrawing = false;
    finishStroke();
}

/* Mouse */
let isMouseDown = false;
function handleMouseDown(e) {
    if (currentMode !== "draw") return;
    isMouseDown = true;
    const latLng = getLatLngFromEvent(e);
    if (latLng) startNewStrokePoint(latLng);
}
function handleMouseMove(e) {
    const latLng = getLatLngFromEvent(e);
    if (latLng) updateCoordinateDisplay(latLng);

    if (currentMode !== "draw") return;
    if (isMouseDown && latLng) {
        continueStrokePoint(latLng);
    }
}
function handleMouseUp(e) {
    if (currentMode !== "draw") return;
    isMouseDown = false;
    finishStroke();
}