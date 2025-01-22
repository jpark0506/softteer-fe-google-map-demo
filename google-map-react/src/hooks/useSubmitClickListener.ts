import { useEffect } from "react";

export const useSubmitClickListener = (map, addMarker, loaded) => {
    useEffect(() => {
        if (!loaded) return;

        const handleClick = (event: any) => {
            const { latLng } = event;
            if (!latLng) return;
            addMarker(latLng.lat(), latLng.lng());
        };
        const clickListener = map.addListener("click", (event) => {
            if (event.placeId) {
                event.stop();
            }
            handleClick(event);
        });

        return () => {
            clickListener.remove();
        };
    }, [map, loaded]);
}

//https://developers.google.com/maps/documentation/javascript/examples/event-poi