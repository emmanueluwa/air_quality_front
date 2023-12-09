import React, { useEffect, useState } from "react";
import AirQualityChart from "../components/AirQualityChart";
import { getData } from "@/utils/getData";
import { QualityData } from "@/utils/types";

function Index() {
  const [qualityData, setQualityData] = useState<QualityData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setQualityData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  console.log("data from index", qualityData);

  return (
    <>
      <h1>Air Quality Data</h1>
      <AirQualityChart
        airQualityData={qualityData?.results}
        width={2000}
        height={2000}
      />
      {/* {qualityData?.results.map((result, index) => (
        <div key={index}>
          <p>Location: {result.location}</p>
          <p>Parameter: {result.parameter}</p>
          <p>Value: {result.value}</p>
          <p>Unit: {result.unit}</p>
          <p>Date (UTC): {result.date?.utc}</p>
        </div>
      ))} */}
    </>
  );
}

export default Index;
