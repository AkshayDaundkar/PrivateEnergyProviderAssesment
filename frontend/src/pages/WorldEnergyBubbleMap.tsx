import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { scaleSqrt, scaleLinear } from "d3-scale";
import { interpolateRdYlBu } from "d3-scale-chromatic";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import worldGeo from "../assets/custom.geo.json"; // Local GeoJSON

const countryCoordinates: Record<string, [number, number]> = {
  USA: [-100, 40],
  China: [105, 35],
  India: [78, 22],
  Germany: [10, 51],
  Brazil: [-51, -10],
  Canada: [-106, 56],
  Australia: [133, -27],
  France: [2, 46],
  UK: [-1.5, 52],
  Russia: [105, 60],
  Japan: [138, 37],
};

type Props = {
  data: { Country: string; "Total Energy Consumption (TWh)": number }[];
};

export default function WorldEnergyMapD3({ data }: Props) {
  // Aggregate by country
  const totals: Record<string, number> = data.reduce((acc, cur) => {
    const country = cur.Country;
    acc[country] = (acc[country] || 0) + cur["Total Energy Consumption (TWh)"];
    return acc;
  }, {});

  const values = Object.values(totals);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const midVal = (minVal + maxVal) / 2;

  const radiusScale = scaleSqrt().domain([0, maxVal]).range([2, 30]);

  const colorScale = scaleLinear<string>()
    .domain([minVal, midVal, maxVal])
    .range([
      interpolateRdYlBu(1),
      interpolateRdYlBu(0.5),
      interpolateRdYlBu(0),
    ]); // Blue → Yellow → Red

  return (
    <div className="mt-10 bg-white rounded shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        🌐 Energy Consumption Bubble Map
      </h2>

      <ComposableMap projection="geoEqualEarth" width={900} height={500}>
        <Geographies geography={worldGeo}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#f8fafc"
                stroke="#cbd5e1"
              />
            ))
          }
        </Geographies>

        {Object.entries(totals).map(([country, value]) => {
          const coords = countryCoordinates[country];
          if (!coords) return null;

          return (
            <Marker key={country} coordinates={coords}>
              <circle
                r={radiusScale(value)}
                fill={colorScale(value)}
                stroke="#333"
                strokeWidth={1}
                data-tooltip-id="map-tooltip"
                data-tooltip-content={`${country}: ${value.toFixed(2)} TWh`}
              />
            </Marker>
          );
        })}
      </ComposableMap>

      <Tooltip id="map-tooltip" />

      {/* Color Gradient Legend */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
          <span>Low</span>
          <span>Mid</span>
          <span>High</span>
        </div>
        <div
          className="w-full h-4 rounded"
          style={{
            background: `linear-gradient(to right, ${interpolateRdYlBu(
              1
            )}, ${interpolateRdYlBu(0.5)}, ${interpolateRdYlBu(0)})`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{minVal.toFixed(2)} TWh</span>
          <span>{midVal.toFixed(2)} TWh</span>
          <span>{maxVal.toFixed(2)} TWh</span>
        </div>
      </div>
    </div>
  );
}
