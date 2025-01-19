import { Loader } from '@googlemaps/js-api-loader';

const googleMapsLoader = new Loader({
    apiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
    version: 'weekly',
    libraries: ['maps','marker'],
  });

const loadMapObject = async () => {
    const { Map, OverlayView, Polyline } = await googleMapsLoader.importLibrary('maps');
    const {AdvancedMarkerElement} = await googleMapsLoader.importLibrary('marker');
    
    return { Map, OverlayView,AdvancedMarkerElement, Polyline };
    
}

export default loadMapObject;