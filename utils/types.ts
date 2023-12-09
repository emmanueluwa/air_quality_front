export interface QualityData {
  meta: {
    name: string;
    license: string;
    website: string;
    page: number;
    limit: number;
    found: string;
  };
  results: Result[];
}

interface Result {
  locationId: number;
  location: string;
  parameter: string;
  value: number;
  date: {
    utc: string;
    local: string;
  };
  unit: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  country: string;
  city: string | null;
  isMobile: boolean;
  isAnalysis: boolean | null;
  entity: string;
  sensorType: string;
}
