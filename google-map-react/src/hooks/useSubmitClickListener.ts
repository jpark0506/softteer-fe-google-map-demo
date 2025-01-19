import { useEffect } from "react";

export const useSubmitClickListener = (map, AdvancedMarker, Polyline, addMarker) => {
    useEffect(() => {
        if (!map || !AdvancedMarker  || !Polyline) return;
    
        const handleClick = (event: any) => {
          const { latLng } = event;
          if (!latLng) return;
          addMarker(latLng.lat(), latLng.lng());
        };
        const clickListener = map.addListener("click", handleClick);
    
        return () => {
          clickListener.remove();
        };
      }, [map, AdvancedMarker, Polyline]);
}