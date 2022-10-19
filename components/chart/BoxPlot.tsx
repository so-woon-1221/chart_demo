import withParentSize from 'hooks/withParentSize';
import { BoxPlot } from '@visx/stats';
import {
  ComponentType,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from 'react';
import { scaleLinear, scaleBand } from '@visx/scale';
import { max, min } from 'd3';
import { Group } from '@visx/group';
import { Axis } from '@visx/axis';
import { TooltipWithBounds as Tooltip } from '@visx/tooltip';

interface Props {
  data: {
    x: string;
    qt1: number;
    qt3: number;
    median: number;
    min: number;
    max: number;
    avg: number;
    count: number;
  }[];
  id: string;
  width?: number;
  height?: number;
  // setSelectedKey: Dispatch<SetStateAction<string | undefined>>;
}

const BoxPlotChart: ComponentType<Props> = ({
  id,
  data,
  width,
  height,
  // setSelectedKey: setBrand,
}) => {
  const [tooltipData, setTooltipData] = useState<{
    tooltipTop: number;
    tooltipLeft: number;
    tooltipData: { data: { value: number; key: string }[]; name: string };
  }>();

  const yScale = useMemo(() => {
    return scaleLinear({
      //   domain: [
      //     min(data, (d) => d.QT1 - 1.2 * (d.QT3 - d.QT1)) ?? 0,
      //     max(data, (d) => d.QT3 + 1.2 * (d.QT3 - d.QT1))
      //       ? max(data, (d) => d.QT3 + 1.2 * (d.QT3 - d.QT1))
      //       : 0,
      //   ],
      domain: [min(data, (d) => +d.min)!, max(data, (d) => +d.max)!],
      range: [height! - 50, 50],
      round: true,
    });
  }, [data, height]);

  const xScale = useMemo(() => {
    return scaleBand({
      domain: data.map((d) => d.x),
      range: [50, width! - 50],
    });
  }, [data, width]);

  return (
    <div className="relative flex flex-col w-full h-full">
      <svg width={width} height={height}>
        <Axis scale={xScale} top={height! - 50} />
        <Axis scale={yScale} left={50} orientation="left" />
        {data.map((d, i) => {
          return (
            <Group key={`${id}-box-${i}`}>
              <BoxPlot
                min={d.min}
                max={d.max}
                median={+d.avg}
                firstQuartile={d.qt1}
                thirdQuartile={d.qt3}
                left={xScale(d.x)! + xScale.bandwidth() / 2 - 10}
                boxWidth={20}
                fill="#354965"
                fillOpacity={0.3}
                stroke="#354965"
                strokeWidth={2}
                valueScale={yScale}
                // outliers={outliers(d)}
                minProps={{
                  x1: xScale(d.x)! + xScale.bandwidth() / 2 - 10,
                  x2: xScale(d.x)! + xScale.bandwidth() / 2 + 10,
                  style: {
                    // stroke: "black",
                    strokeWidth: 4,
                  },
                  onMouseOver: () => {
                    setTooltipData({
                      tooltipTop: yScale(d.min)!,
                      tooltipLeft: xScale(d.x)! + xScale.bandwidth() / 2,
                      tooltipData: {
                        data: [{ value: +d.min, key: '최소값' }],
                        name: d.x,
                      },
                    });
                    // setBrand(d.x);
                  },
                  onMouseLeave: () => {
                    setTooltipData(undefined);
                    // setBrand(undefined);
                  },
                }}
                maxProps={{
                  x1: xScale(d.x)! + xScale.bandwidth() / 2 - 10,
                  x2: xScale(d.x)! + xScale.bandwidth() / 2 + 10,
                  style: {
                    // stroke: "black",
                    strokeWidth: 4,
                  },
                  onMouseOver: () => {
                    setTooltipData({
                      tooltipTop: yScale(d.max)!,
                      tooltipLeft: xScale(d.x)! + xScale.bandwidth() / 2,
                      tooltipData: {
                        data: [{ value: +d.max, key: '최대값' }],
                        name: d.x,
                      },
                    });
                    // setBrand(d.x);
                  },
                  onMouseLeave: () => {
                    setTooltipData(undefined);
                    // setBrand(undefined);
                  },
                }}
                boxProps={{
                  style: {
                    // stroke: "black",
                    strokeWidth: 3,
                  },
                  onMouseOver: (e) => {
                    setTooltipData({
                      tooltipTop: yScale(d.median)!,
                      tooltipLeft: xScale(d.x)! + xScale.bandwidth() / 2,
                      tooltipData: {
                        data: [
                          { value: +d.max, key: '최대값' },
                          { value: +d.qt3, key: '3사분위값' },
                          {
                            value: +d.avg,
                            key: '평균값',
                          },
                          { value: +d.qt1, key: '1사분위값' },
                          { value: +d.min, key: '최소값' },
                        ],
                        name: d.x,
                      },
                    });
                    // setBrand(d.x);
                  },
                  onMouseLeave: () => {
                    setTooltipData(undefined);
                    // setBrand(undefined);
                  },
                }}
                medianProps={{
                  style: {
                    stroke: '#02CC9A',
                    strokeWidth: 4,
                  },
                  onMouseOver: () => {
                    setTooltipData({
                      tooltipTop: yScale(d.avg)!,
                      tooltipLeft: xScale(d.x)! + xScale.bandwidth() / 2,
                      tooltipData: {
                        data: [
                          {
                            value: +d.avg,
                            key: '평균값',
                          },
                        ],
                        name: d.x,
                      },
                    });
                    // setBrand(d.x);
                  },
                  onMouseLeave: () => {
                    setTooltipData(undefined);
                    // setBrand(undefined);
                  },
                }}
              />
            </Group>
          );
        })}
      </svg>
      {tooltipData && (
        <Tooltip left={tooltipData.tooltipLeft} top={tooltipData.tooltipTop}>
          <div className="flex flex-col space-y-2" style={{ fontSize: '12px' }}>
            <span>{tooltipData.tooltipData.name}</span>
            <div className="flex flex-col space-y-1 font-bold text-black">
              {tooltipData.tooltipData.data.map((d, i) => {
                return (
                  <span key={`${id}-tooltip-${i}`}>
                    {d.key} :{' '}
                    {d.value.toLocaleString('ko-KR', {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                );
              })}
            </div>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default withParentSize(BoxPlotChart);
