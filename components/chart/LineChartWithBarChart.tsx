import withParentSize from 'hooks/withParentSize';
import { GridRows } from '@visx/grid';
import {
  line,
  max,
  scaleBand,
  scaleLinear,
  select,
  pointer,
  ScaleBand,
  scaleOrdinal,
} from 'd3';
import {
  MouseEvent,
  TouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Axis } from '@visx/axis';
import { TooltipWithBounds } from '@visx/tooltip';
import { GlyphCircle } from '@visx/glyph';
// import { useRecoilValue } from 'recoil';
// import { filterStateAtom } from 'atom/filterStateAtom';
import { RiBarChartFill } from 'react-icons/ri';
import { MdOutlineStackedLineChart } from 'react-icons/md';

interface Props {
  data: {
    lineData: {
      x: string;
      index: number;
      y: number;
    }[];
    barData: {
      x: string;
      index: number;
      y: number;
    }[];
  };
  width: number;
  height: number;
  id: string;
  keyList: string[];
  colorList: string[];
}

const LineChartWithBarChart: React.FC<Props> = ({
  data,
  width,
  height,
  id,
  keyList,
  colorList,
}) => {
  const [isTransitionEnd, setIsTransitionEnd] = useState(false);
  // const filterState = useRecoilValue(filterStateAtom);
  const { barData, lineData } = data;

  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    data: { key: string; value: number[] };
  }>();

  const xScale =
    // scaleTime()
    scaleBand()
      .domain(barData.map((d) => d.x.toString()))
      // .domain([
      //   min(barData.map((d) => moment(d.x, "YYYYMMDD").toDate()))!,
      //   max(barData.map((d) => moment(d.x, "YYYYMMDD").toDate()))!,
      // ])
      .range([80, width - 80])
      .padding(0.4);

  const lineYScale = scaleLinear()
    .domain([0, max(lineData, (d) => +d.y) ?? 0 * 1.1])
    .range(
      max(lineData, (d) => +d.y) == 0
        ? [height - 50, height - 50]
        : [height - 50, 50],
    );

  const barYScale = scaleLinear()
    .domain([0, max(barData, (d) => +d.y) ?? 0 * 1.1])
    .range(
      max(barData, (d) => +d.y) == 0
        ? [height - 50, height - 50]
        : [height - 50, 50],
    );

  // const color = useMemo(() => {
  //   return scaleOrdinal<string>().domain(keyList).range(['#354965', '#02CC9A']);
  // }, [keyList]);

  const createLegend = useCallback(() => {
    return (
      <div
        className="absolute top-0 left-1/2"
        style={{ transform: `translate(-50%, 50%)` }}
      >
        <ul
          className="grid gap-x-2"
          style={{
            gridTemplateColumns: `repeat(${keyList.length}, minmax(0, 1fr))`,
          }}
        >
          {keyList.map((d, i) => {
            return (
              <li key={`legend-${i}`} className="flex items-center space-x-1">
                {/* <svg width={15} height={15}>
                  <rect x={0} y={0} width={15} height={15} fill={color(d)} />
                </svg> */}
                {i == 0 ? (
                  <RiBarChartFill fill={colorList[i]} />
                ) : (
                  <MdOutlineStackedLineChart fill={colorList[i]} />
                )}
                <span>{d}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }, [keyList]);

  // useEffect(() => {
  //   setIsTransitionEnd(false);
  // }, [filterState]);

  const drawBarChart = useCallback(() => {
    const barArea = select(`#${id}-bar`);

    if (barArea) {
      barArea
        .selectAll('rect')
        .data(barData)
        .join((enter) =>
          enter
            .append('rect')
            .attr('x', (d) => xScale(d.x)!)
            .attr('y', height - 50)
            .attr('width', xScale.bandwidth())
            .attr('height', 0),
        )
        .attr('fill', colorList[1])
        // .attr("fill", `url(#${id}-gradient)`)
        .transition()
        .on('end', () => {
          setIsTransitionEnd(true);
        })
        .attr('x', (d) => xScale(d.x)!)
        // .attr("x", (d) => xScale(moment(d.x, "YYYYMMDD").toDate())!)
        .attr('y', (d) => barYScale(d.y))
        .attr('width', xScale.bandwidth())
        // .attr("width", 20)
        .attr('height', (d) => height - 50 - barYScale(d.y));
      return <g id={`${id}-bar`} />;
    }
  }, [barData, barYScale, height, id, xScale]);

  const drawLineChart = useCallback(() => {
    const lineArea = select(`#${id}-line`);

    if (lineArea) {
      lineArea
        .select('path')
        .attr('transform', `translate(${xScale.bandwidth() / 2},0)`)
        .datum(lineData as any)
        .attr('fill', 'none')
        .attr('stroke', colorList[0])
        .attr('stroke-width', 4)
        .transition()
        .attr(
          'd',
          line()
            .x((d: any) => xScale(d.x)!)
            .y((d: any) => lineYScale(d.y)),
        );

      return (
        <g id={`${id}-line`}>
          <path />
        </g>
      );
    }
  }, [id, lineData, lineYScale, xScale]);

  function scaleBandInvert(scale: ScaleBand<string>) {
    const domain = scale.domain();
    const paddingOuter = scale(domain[0]);
    const eachBand = scale.step();
    return function (value: number) {
      const index = Math.floor((value - paddingOuter!) / eachBand);
      return domain[Math.max(0, Math.min(index, domain.length - 1))];
    };
  }

  function createTooltip(
    e:
      | MouseEvent<SVGSVGElement, globalThis.MouseEvent>
      | TouchEvent<SVGSVGElement>,
  ) {
    const invertX = scaleBandInvert(xScale)(pointer(e)[0]);
    const bar = barData.find((d) => d.x == invertX);
    const line = lineData.find((d) => d.x == invertX);
    if (bar && svgRef.current && line) {
      setTooltipData({
        x: xScale(invertX) ?? 0,
        y: Math.max(barYScale(bar.y), lineYScale(bar.y)),
        data: {
          key: invertX,
          value: [+bar.y, +line.y],
        },
      });
    }
  }

  return (
    // 바는 금액 / 라인은 수량
    <div className="relative w-full h-full">
      {createLegend()}
      {tooltipData && (
        <TooltipWithBounds
          left={+tooltipData.x + xScale.bandwidth() / 2}
          top={tooltipData.y}
        >
          <div className="flex flex-col space-y-2" style={{ fontSize: '12px' }}>
            <span className="text-zinc-600">{tooltipData.data.key}</span>
            <div className="flex flex-col space-y-1 font-bold text-black">
              <span>
                {keyList[0]} :{' '}
                {tooltipData.data.value[0].toLocaleString('ko-KR', {
                  maximumFractionDigits: 2,
                })}
              </span>
              <span>
                {keyList[1]} :{' '}
                {tooltipData.data.value[1].toLocaleString('ko-KR', {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </TooltipWithBounds>
      )}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        onMouseMove={(e) => isTransitionEnd && createTooltip(e)}
        onTouchMove={(e) => isTransitionEnd && createTooltip(e)}
        onMouseLeave={() => {
          setTooltipData(undefined);
        }}
      >
        <GridRows scale={barYScale} width={width - 160} left={80} />
        <Axis scale={xScale} top={height - 50} />
        <Axis scale={barYScale} left={80} orientation="left" />
        <Axis scale={lineYScale} orientation="right" left={width - 80} />
        {drawBarChart()}
        {drawLineChart()}
        {tooltipData && (
          <GlyphCircle
            left={tooltipData.x + xScale.bandwidth() / 2}
            top={tooltipData.y}
            size={10}
          />
        )}
      </svg>
    </div>
  );
};

export default withParentSize(LineChartWithBarChart);
