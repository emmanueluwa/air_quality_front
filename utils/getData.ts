import { useEffect, useState } from "react";
import { QualityData } from "./types";

export async function getData(): Promise<QualityData> {
  const response = await fetch("http://localhost:8080/api");
  const data: QualityData = await response.json();
  return data;
}
