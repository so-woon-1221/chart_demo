import React, {
  useState,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
} from 'react';
import { select, arc, pie, color } from 'd3';
import { scaleOrdinal } from '@visx/scale';
import withParentSize from 'hooks/withParentSize';
import styled from 'styled-components';
import Gradient from 'javascript-color-gradient';

const Tooltip = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

interface Props {
  data: Array<{ key: string; data: number; percent: number }>;
  colorSet: Array<string>;
  width: number;
  height: number;
  setSelectedKey?: Dispatch<SetStateAction<string>>;
  id: string;
  type: number;
}

const PieChart: React.FC<Props> = ({
  data,
  colorSet,
  width,
  height,
  setSelectedKey,
  id,
  type,
}) => {
  const [tooltipData, setTooltipData] = useState<{
    key: string;
    value: number;
  }>();
  const colorList = new Gradient()
    .setColorGradient(...colorSet)
    .setMidpoint(data.length)
    .getColors();

  const color = useMemo(() => {
    return scaleOrdinal()
      .domain(data.map((d) => d.key))
      .range(colorList);
  }, [colorList, data]);

  const drawChart = useCallback(() => {
    const pieWidth = (width * 5) / 6;
    // 차트 그리기 ////////////////////////////////////////////////////////////////////
    const radius = Math.min(pieWidth, height) / 2;
    const arcValue = arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.85)
      .cornerRadius(3)
      .padAngle(0.005);

    const pieGenerator = pie()
      .sort(null)
      .value((d: any) => d.percent);

    // @ts-ignore
    const chartData = pieGenerator(data);

    select(`#${id}-pie-chart`)
      .selectAll('path')
      .data(chartData)
      .join('path')
      .attr('transform', `translate(${pieWidth / 2}, ${height / 2})`)
      .attr('fill', (d: any) => {
        if (d.data.key == '기타') {
          return '#e3e3e3';
        }
        // @ts-ignore
        return color(d.data.key);
      })
      .attr('stroke', 'rgba(0,0,0,0.3)')
      .on('mouseover touchmove', function (_, d: any) {
        select(this)
          .transition()
          .attr(
            'transform',
            `translate(${pieWidth / 2}, ${height / 2}) scale(1.05)`,
          )
          .attr('filter', 'drop-shadow(1px 1px 4px rgba(0,0,0,0.4))');
        setTooltipData({ key: d.data.key, value: d.data.percent });
      })
      .on('mouseleave touchend', function () {
        select(this)
          .transition()
          .attr(
            'transform',
            `translate(${pieWidth / 2}, ${height / 2}) scale(1)`,
          )
          .attr('filter', '');
        setTooltipData(undefined);
      })
      .on('click', (_, d: any) => {
        if (setSelectedKey && type == 2) {
          setSelectedKey(d.data.key);
        }
      });
    //   @ts-ignore
    select(`#${id}-pie-chart`).selectAll('path').attr('d', arcValue);
    /////
    return <g id={`${id}-pie-chart`}></g>;
  }, [color, data, height, id, setSelectedKey, type, width]);

  const drawLegend = useCallback(() => {
    return color.domain().map((d: any, i: number) => {
      return (
        <li
          key={`legend-${i}`}
          className="flex items-center space-x-2"
          style={{ fontSize: '14px' }}
        >
          <svg width={15} height={15}>
            <rect
              x={0}
              y={0}
              width={15}
              height={15}
              fill={color(d) as string}
            />
          </svg>
          <span>{d}</span>
        </li>
      );
    });
  }, [color]);

  return (
    <div className="flex items-center w-full h-full">
      <div className="relative flex w-5/6">
        <svg width={(width * 5) / 6} height={height}>
          {drawChart()}
        </svg>
        {tooltipData && (
          <Tooltip>
            <div className="flex flex-col space-y-2">
              <span>{tooltipData.key}</span>
              <span>{tooltipData.value.toFixed(2)}%</span>
            </div>
          </Tooltip>
        )}
      </div>
      <div
        className="flex justify-center w-1/6 overflow-y-auto"
        style={{ height: '450px' }}
      >
        <ul
          id={`pie-legend`}
          className="flex flex-col w-full my-auto space-y-2 overflow-x-auto"
        >
          {drawLegend()}
        </ul>
      </div>
    </div>
  );
};

export default withParentSize(PieChart);
