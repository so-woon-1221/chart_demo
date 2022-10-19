import {
  ComponentType,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import withParentSize from '../../hooks/withParentSize';
import {
  curveLinearClosed,
  lineRadial,
  max,
  range,
  scaleLinear,
  scaleOrdinal,
  select,
} from 'd3';

interface Props {
  data: { key: string; data: { x: string | number; y: number }[] }[];
  id: string;
  width?: number;
  height?: number;
  colorList: string[];
}

const axisCircle = 3;
const margin = 35;

const RadarChart: ComponentType<Props> = ({
  data,
  id,
  width,
  height,
  colorList,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const color = useMemo(
    () =>
      scaleOrdinal<string, string>()
        .domain(data.map((d) => d.key))
        .range(colorList),
    [colorList, data],
  );

  const keyList = useMemo(() => data.map((d) => d.key), [data]);
  const axisList = useMemo(() => data[0].data.map((d) => d.x), [data]);

  const angleSlice = useMemo(() => (Math.PI * 2) / data[0].data.length, [data]);

  const radius = useMemo(() => height! / 2 - margin, [height]);

  const maxY = useMemo(() => max(data, (d) => max(d.data, (a) => a.y)), [data]);

  const rScale = useMemo(() => {
    return scaleLinear()
      .domain([0, maxY!])
      .range([0, Math.min(height!, width!) / 2 - margin]);
  }, [height, maxY, width]);

  const radarLine = useMemo(() => {
    return lineRadial()
      .curve(curveLinearClosed)
      .radius((d: any) => rScale(d))
      .angle((d, i) => i * angleSlice);
  }, [angleSlice, rScale]);

  const drawChart = useCallback(
    (svgRef: RefObject<SVGSVGElement>) => {
      const svg = select(svgRef.current);
      if (svg) {
        const container = svg
          .select('g')
          .attr('transform', `translate(${width! / 2}, ${height! / 2})`);

        container
          .selectAll('circle')
          .data(range(1, axisCircle + 1).reverse())
          .join('circle')
          .attr('r', (d) => (radius / axisCircle) * d)
          .style('fill', '#CDCDCD')
          .style('stroke', '#CDCDCD')
          .style('fill-opacity', 0.1);

        container
          .selectAll('line')
          .data(axisList)
          .join('line')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr(
            'x2',
            (d, i) =>
              rScale(maxY! * 1.1) * Math.cos(angleSlice * i - Math.PI / 2),
          )
          .attr(
            'y2',
            (d, i) =>
              rScale(maxY! * 1.1) * Math.sin(angleSlice * i - Math.PI / 2),
          )
          .attr('class', 'line')
          .style('stroke', 'white')
          .style('stroke-width', '2px');

        container
          .selectAll('text')
          .data(axisList)
          .join('text')
          .style('font-size', '12px')
          .attr('text-anchor', 'middle')
          .attr('font-family', 'monospace')
          .attr('dy', '0.35em')
          .attr(
            'x',
            (d, i) =>
              rScale(maxY! * 1.1) * Math.cos(angleSlice * i - Math.PI / 2),
          )
          .attr(
            'y',
            (d, i) =>
              rScale(maxY! * 1.1) * Math.sin(angleSlice * i - Math.PI / 2),
          )
          .text((d) => d);

        container
          .selectAll('path')
          .data(data)
          .join('path')
          .transition()
          .attr('d', (d) => radarLine(d.data.map((a) => a.y as any)))
          .attr('fill', (d) => color(d.key))
          .attr('fill-opacity', 0.1)
          .attr('stroke', (d) => color(d.key))
          .attr('stroke-width', 2);

        container
          .selectAll('g')
          .data(data)
          .join('g')
          .attr('stroke', (d) => color(d.key))
          .attr('fill', 'none')
          .selectAll('circle')
          .data((d) => d.data)
          .join('circle')
          .attr('r', 4)
          .attr(
            'cx',
            (d, i) => rScale(d.y) * Math.cos(angleSlice * i - Math.PI / 2),
          )
          .attr(
            'cy',
            (d, i) => rScale(d.y) * Math.sin(angleSlice * i - Math.PI / 2),
          );
      }
    },
    [
      angleSlice,
      axisList,
      color,
      data,
      height,
      maxY,
      rScale,
      radarLine,
      radius,
      width,
    ],
  );

  useEffect(() => {
    drawChart(svgRef);
  }, [drawChart, svgRef]);

  return (
    <div className={'w-full h-full'}>
      <svg ref={svgRef} width={width} height={height}>
        <g />
      </svg>
    </div>
  );
};

export default withParentSize(RadarChart);
