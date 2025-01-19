
import ReactDOM from "react-dom";

interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  content: string;
}

/**
 * Create a React component for marker content.
 */
const createMarkerContent = (content: string): JSX.Element => {
  return (
    <div
      style={{
        color: "blue",
        fontSize: "14px",
        padding: "5px",
        border: "1px solid black",
        backgroundColor: "white",
      }}
    >
      {content}
    </div>
  );
};

/**
 * Convert React JSX to a DOM container using ReactDOM.createPortal.
 */
const renderToContainer = (jsx: JSX.Element): HTMLElement => {
  const container = document.createElement("div");
  ReactDOM.createPortal(jsx, container);
  return container;
};

/**
 * Add an AdvancedMarkerView to the map.
 */
const createAdvancedMarker = (
  map: any,
  AdvancedMarkerView: any,
  lat: number,
  lng: number,
  content: HTMLElement
): void => {
  new AdvancedMarkerView({
    map,
    content,
    position: { lat, lng },
  });
};

/**
 * Main function to add a marker.
 */
const addMarker = (
  map: any,
  AdvancedMarkerView: any,
  markers: MarkerData[],
  setMarkers: React.Dispatch<React.SetStateAction<MarkerData[]>>,
  lat: number,
  lng: number
): void => {
  if (!map || !AdvancedMarkerView) return;

  const newMarker: MarkerData = {
    id: `marker-${Date.now()}`,
    lat,
    lng,
    content: `Marker at (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
  };

  // Update the markers state
  setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

  // Create marker content as a React component
  const markerContent = createMarkerContent(newMarker.content);

  // Render the content to a DOM container
  const container = renderToContainer(markerContent);

  // Add the marker to the map
  createAdvancedMarker(map, AdvancedMarkerView, lat, lng, container);
};

export default addMarker;