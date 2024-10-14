type GeoJSONFeatureCollection = {
    type: string;
    features: GeoJSONFeature[];
};

type GeoJSONFeature = {
    type: string;
    properties: {
        name: string;
        description: string;
    };
    geometry: {
        type: string;
        coordinates: [number, number][];
    };
};