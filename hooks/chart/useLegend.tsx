import { LinearGradient } from "@visx/gradient";

interface Props {
  width?: number;
  height?: number;
  min: number;
  max: number;
  from: string;
  to: string;
  id: string;
  vertical: boolean;
}

export const useLegend = ({
  width = 45,
  height = 40,
  min,
  max,
  from,
  to,
  id,
  vertical,
}: Props) => {
  return !vertical ? (
    <svg width={width} height={height}>
      <LinearGradient
        id={`${id}-legend-gradient`}
        from={from}
        to={to}
        vertical={vertical}
      />
      <rect
        x={0}
        y={0}
        width={width}
        height={20}
        fill={`url(#${id}-legend-gradient)`}
      />
      <line x1={0} x2={0} y1={0} y2={25} stroke="black" strokeWidth={4} />
      <line
        x1={width / 2}
        x2={width / 2}
        y1={0}
        y2={25}
        stroke="black"
        strokeWidth={2}
      />
      <line
        x1={width}
        x2={width}
        y1={0}
        y2={25}
        stroke="black"
        strokeWidth={4}
      />
      <text x={0} y={25} alignmentBaseline="hanging" fontSize={"12px"}>
        {min > 10000 ? Math.round(min / 10000) : min}
        {min > 10000 && "만"}
      </text>
      <text
        x={width / 2}
        y={25}
        alignmentBaseline="hanging"
        textAnchor="middle"
        fontSize={"12px"}
      >
        {max / 2 > 10000 ? Math.round(max / 2 / 10000) : max / 2}
        {max > 10000 && "만"}
      </text>
      <text
        x={width}
        y={25}
        alignmentBaseline="hanging"
        textAnchor="end"
        fontSize={"12px"}
      >
        {max > 10000 ? Math.round(max / 10000) : max}
        {max > 10000 && "만"}
      </text>
    </svg>
  ) : (
    <svg width={width} height={height}>
      <LinearGradient
        id={`${id}-legend-gradient`}
        from={from}
        to={to}
        vertical={vertical}
      />
      <rect
        x={0}
        y={0}
        width={20}
        height={height}
        fill={`url(#${id}-legend-gradient)`}
      />
      <line x1={0} x2={25} y1={0} y2={0} stroke="black" strokeWidth={4} />
      <line
        x1={0}
        x2={25}
        y1={height / 2}
        y2={height / 2}
        stroke="black"
        strokeWidth={2}
      />
      <line
        x1={0}
        x2={25}
        y1={height}
        y2={height}
        stroke="black"
        strokeWidth={4}
      />
      <text x={25} y={0} alignmentBaseline="hanging" fontSize={"12px"}>
        {min}
      </text>
      <text x={25} y={height / 2} alignmentBaseline="middle" fontSize={"12px"}>
        {max / 2}
      </text>
      <text x={25} y={height} alignmentBaseline="baseline" fontSize={"12px"}>
        {max}
      </text>
    </svg>
  );
};
