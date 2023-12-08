import React, { useEffect, useState } from "react";

interface QualityData {
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

function Index() {
  const [qualityData, setQualityData] = useState<QualityData | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api")
      .then((response) => response.json())
      .then((data: QualityData) => {
        console.log(data);
        setQualityData(data);
      });
  }, []);

  return (
    <>
      <h1>Air Quality Data</h1>
      {qualityData?.results.map((result, index) => (
        <div key={index}>
          <p>Location: {result.location}</p>
          <p>Parameter: {result.parameter}</p>
          <p>Value: {result.value}</p>
          <p>Unit: {result.unit}</p>
          <p>Date (UTC): {result.date?.utc}</p>
        </div>
      ))}
    </>
  );
}

export default Index;
