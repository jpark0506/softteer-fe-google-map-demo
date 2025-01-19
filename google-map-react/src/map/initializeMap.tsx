import { InhaUniversity } from "../constant/coordinate";
import loadMapObject from "./mapLoader";

interface MapWithOverlay {
    map: any;
    overlay: any;
    advancedMarkerConstructor: any;
    polylineConstructor: any;
}
    

export const initializeMapWithOverlay = async(mapElement: HTMLElement | null): Promise<MapWithOverlay> => {
    const {Map, OverlayView, AdvancedMarkerElement, Polyline } = await loadMapObject();
  
    const map = new Map(mapElement, {
      center: InhaUniversity,
      zoom: 17,
      draggable: true,
      scrollwheel: true,
      disableDoubleClickZoom: false,
      gestureHandling: "auto",
      mapId: "roadmap",
    });
  
    const overlay = new OverlayView();
    overlay.onAdd = function () {};
    overlay.draw = function () {};
    overlay.onRemove = function () {};
    overlay.setMap(map);
  
    return { map, overlay, advancedMarkerConstructor: AdvancedMarkerElement, polylineConstructor: Polyline };
  };