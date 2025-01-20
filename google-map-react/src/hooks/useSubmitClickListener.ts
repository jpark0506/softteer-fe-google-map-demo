import { useEffect } from "react";

export const useSubmitClickListener = (map, addMarker, loaded) => {
    useEffect(() => {
        if (!loaded) return;
    
        const handleClick = (event: any) => {
          const { latLng } = event;
          if (!latLng) return;
          addMarker(latLng.lat(), latLng.lng());
        };
        const clickListener = map.addListener("click", handleClick);
    
        return () => {
          clickListener.remove();
        };
      }, [map, loaded]);
}