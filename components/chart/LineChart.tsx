import withParentSize from 'hooks/withParentSize';
import {
  XYChart,
  AnimatedAreaStack,
  AnimatedAreaSeries,
  Axis,
  Tooltip,
} from '@visx/xychart';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { LinearGradient } from '@visx/gradient';
import {
  max,
  min,
  scaleLinear,
  scaleOrdinal,
  scaleTime,
  scaleBand,
  ScaleTime,
  ScaleBand,
} from 'd3';
import moment from 'moment';
import { GridRows } from '@visx/grid';
import { GlyphCircle } from '@visx/glyph';
import { TooltipWithBounds } from '@visx/tooltip';
import { useCallback } from 'react';

interface Props {
  // x축은 x로 고정, index와 x가 아닌키는 모두 라인을 그릴 수 있도록 설정
  data: { index: number; x: string; [key: string]: string | number }[];
  id: string;
  width: number;
  height: number;
  xType: any;
  barType: string;
  setClickState: Dispatch<SetStateAction<string>>;
  colorList: string[];
  keyArray?: string[];
  limit?: number;
  indexAxis?: boolean;
  xRect?: { pos: number; text: string };
  yRect?: { pos: number; text: string };
}

const LineChart: React.FC<Props> = ({
  data,
  id,
  width,
  height,
  xType,
  barType = 'normal',
  setClickState,
  colorList = ['#354965'],
  keyArray,
  limit,
  indexAxis,
  xRect,
  yRect,
}) => {
  // y축을 쌓기위한 Key List
  const keyList = useMemo(() => {
    if (!!keyArray) {
      return keyArray;
    } else {
      return Object.keys(data[0]).filter(
        (k) => k !== 'x' && k !== 'index' && k !== 'isFuture',
      );
    }
  }, [data, keyArray]);

  const tooltipKeyList = useMemo(() => {
    return [...keyList].reverse();
  }, [keyList]);

  const color = scaleOrdinal<string>().domain(keyList).range(colorList);

  // y축 표시를 위한 것
  const maxY = useMemo(() => {
    if (!!limit) {
      return limit;
    } else {
      const yArray: number[] = [];
      if (barType !== 'stack') {
        data.forEach((d) => {
          keyList.forEach((k) => {
            yArray.push(+d[`${k}`]);
          });
        });
      } else {
        data.forEach((d) => {
          let sum = 0;
          keyList.forEach((k) => {
            sum += +d[`${k}`];
          });
          yArray.push(sum);
        });
      }

      const maxValue = max(yArray) ?? 0;

      return maxValue * 1.1;
    }
  }, [barType, data, keyList, limit]);

  const xScale: ScaleTime<any, any, any> | ScaleBand<any> = useMemo(() => {
    return xType == 'time'
      ? scaleTime()
          .domain([
            moment(min(data.map((d) => d.x)), 'YYYYMMDD').toDate(),
            moment(max(data.map((d) => d.x)), 'YYYYMMDD').toDate(),
          ])
          .range([80, width - 50])
      : scaleBand()
          .domain(data.map((d) => d.x))
          .range([80, width - 50]);
  }, [data, width, xType]);

  const yScale = useMemo(() => {
    return scaleLinear()
      .domain([0, maxY])
      .range([height - 50, 50]);
  }, [height, maxY]);

  const [tooltipData, setTooltipData] = useState<any>();

  const xRectX = useMemo(() => {
    if (!!xRect) {
      if (!!data[xRect.pos - 1] && xType !== 'time') {
        return (
          xScale(data[xRect.pos - 1].x as (Date | number) & string) +
          (xScale as ScaleBand<any>).bandwidth() / 2
        );
      }
    }
  }, [data, xRect, xScale, xType]);

  const drawLegend = useCallback(() => {
    if (keyList.length > 1) {
      let legendList = [...keyList].reverse();
      if (legendList.findIndex((d) => d.includes('pred')) > -1) {
        legendList = legendList.reverse();
      }
      return (
        <div className="absolute top-0 -translate-x-1/2 translate-y-1/2 left-1/2">
          <ul
            className="grid gap-x-2"
            style={{
              gridTemplateColumns: `repeat(${keyList.length}, minmax(0, 1fr))`,
            }}
          >
            {legendList.map((d, i) => {
              return (
                <li
                  key={`${id}-legend-${i}`}
                  className="flex items-center space-x-1"
                >
                  <svg width={15} height={15}>
                    <rect
                      x={0}
                      y={0}
                      width={15}
                      height={15}
                      fill={
                        d.includes('pred')
                          ? '#666'
                          : (color(d) as string) ?? '#e3e3e3'
                      }
                    />
                  </svg>
                  <span>
                    {d.replace(/cgi/g, '성장률').replace(/_pred/, ' 예측')}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  }, [color, id, keyList]);

  return (
    <div className="relative w-full h-full">
      {drawLegend()}
      <XYChart
        width={width}
        height={height}
        xScale={{
          type: xType,
          domain:
            xType == 'time'
              ? [
                  moment(min(data.map((d) => d.x)), 'YYYYMMDD').toDate(),
                  moment(max(data.map((d) => d.x)), 'YYYYMMDD').toDate(),
                ]
              : data.map((d) => d.x),
          range: [80, width - 50],
        }}
        yScale={{
          type: 'linear',
          domain: [0, maxY],
          range: [height - 50, 50],
          nice: true,
        }}
        onPointerUp={(e) => {
          if (setClickState) {
            const datum = e.datum as any;
            setClickState(
              moment(datum.data.stack).format('YYYY-MM-DD').toString(),
            );
          }
        }}
        onPointerMove={(e) => {
          if (barType == 'stack') {
            const datum = e.datum as any;
            if (data[e.index]) {
              setTooltipData({
                x: datum.data.stack,
                y: 25,
                data: data[e.index],
              });
            }
          }
        }}
        onPointerOut={(e) => {
          if (barType == 'stack') {
            setTooltipData(undefined);
          }
        }}
      >
        <GridRows width={width - 130} left={80} scale={yScale} numTicks={3} />
        <Axis
          orientation="bottom"
          tickFormat={(d) => {
            return indexAxis
              ? data.find((a) => a.x == d)?.index
              : xType == 'time'
              ? moment(d).format('YYYYMMDD')
              : d;
          }}
        />
        <Axis orientation="left" left={80} />
        {keyList.length > 1 ? (
          barType == 'stack' ? (
            <AnimatedAreaStack>
              {keyList.map((k) => {
                return (
                  <AnimatedAreaSeries
                    key={`${id}-line-${k}`}
                    dataKey={`${id}-line-${k}`}
                    xAccessor={(d) =>
                      xType == 'time' ? moment(d.x, 'YYYYMMDD').toDate() : d.x
                    }
                    yAccessor={(d) => d[`${k}`]}
                    data={data}
                    // fillOpacity={0.9}
                    fill={`url(#${id}-gradient-${k})`}
                    lineProps={{ stroke: color(k) }}
                  />
                );
              })}
            </AnimatedAreaStack>
          ) : (
            keyList.map((k, i) => {
              return (
                <AnimatedAreaSeries
                  key={`${id}-line-${i}`}
                  dataKey={`${id}-line-${i}`}
                  xAccessor={(d) =>
                    xType == 'time' ? moment(d.x, 'YYYYMMDD').toDate() : d.x
                  }
                  yAccessor={(d) => d[`${k}`]}
                  data={data}
                  fill={
                    k.includes('pred') ? 'none' : `url(#${id}-gradient-${k})`
                  }
                  // fill={color(k)}
                  // fillOpacity={0.3}
                  lineProps={{
                    stroke: k.includes('pred') ? '#666' : color(k),
                    strokeDasharray: k.includes('pred') ? 5 : 0,
                  }}
                />
              );
            })
          )
        ) : (
          <>
            <AnimatedAreaSeries
              key={`${id}-line`}
              dataKey={`${id}-line`}
              xAccessor={(d) =>
                xType == 'time' ? moment(d.x, 'YYYYMMDD').toDate() : d.x
              }
              yAccessor={(d) => d[`${keyList[0]}`]}
              data={data}
              fill={`url(#${id}-gradient)`}
              lineProps={{ stroke: colorList[0] }}
            />
          </>
        )}
        <LinearGradient
          id={`${id}-gradient`}
          from={colorList[0]}
          fromOpacity={0.6}
          to={colorList[0]}
          toOpacity={0}
        />
        {keyList.map((k, i) => {
          return (
            <LinearGradient
              key={`${id}-gradient-${k}`}
              id={`${id}-gradient-${k}`}
              from={color(k)}
              fromOpacity={0.5}
              to={'#fff'}
              toOpacity={0}
            />
          );
        })}
        {barType !== 'stack' && (
          <Tooltip
            renderTooltip={(e) => {
              const datum = e.tooltipData?.nearestDatum?.datum as {
                [key: string]: number | boolean;
              };

              let tooltipData: { key: string; value: number }[] = [];

              if (datum) {
                keyList.forEach((k) => {
                  if (
                    (datum.isFuture == true && !k.includes('pred')) ||
                    (datum.isFuture == false && k.includes('pred'))
                  ) {
                  } else {
                    tooltipData.push({
                      key: k.replace(/cgi/g, '성장률'),
                      value: datum[`${k}`] as number,
                    });
                  }
                });

                if (keyList.length > 1) {
                  return (
                    <div className="flex flex-col space-y-2">
                      <span className="text-zinc-600">
                        {datum.x} {datum.isFuture && `(예측값)`}
                      </span>
                      <div className="flex flex-col font-bold text-black">
                        {[...tooltipData]
                          .sort((a, b) => b.value - a.value)
                          .map((d, i) => {
                            return (
                              d.value && (
                                <span key={`${id}-tooltip-${i}`}>
                                  {d.key.replace(/_pred/, '')} :{' '}
                                  {d.value.toLocaleString('ko-KR', {
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              )
                            );
                          })}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="flex flex-col space-y-2 ">
                      <span className="text-zinc-600">{datum.x}</span>
                      <span className="font-bold text-black">
                        {tooltipData[0].value?.toLocaleString('ko-KR', {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  );
                }
              }
            }}
            snapTooltipToDatumX
            snapTooltipToDatumY
            showVerticalCrosshair={true}
            renderGlyph={() => <GlyphCircle fill={'#2C4251'} size={10} />}
            showSeriesGlyphs
          />
        )}
        {barType == 'stack' && tooltipData && (
          <>
            <rect
              x={
                xScale(tooltipData.x) +
                (xType == 'band'
                  ? (xScale as ScaleBand<any>).bandwidth() / 2
                  : 0)
              }
              y={50}
              width={1}
              height={height - 100}
              fill={'#666'}
            />
          </>
        )}
        {!!xRect && (
          <>
            <text x={xRectX + 10 ?? 0} y={65}>
              <tspan fill={'#666'}>{xRect.text}</tspan>
            </text>
            <line
              x1={xRectX ?? 0}
              x2={xRectX ?? 0}
              y1={50}
              y2={height - 50}
              strokeWidth={1}
              stroke={'#666'}
              strokeDasharray={'5'}
            />
          </>
        )}
        {!!yRect && (
          <>
            <text x={85} y={yScale(yRect.pos) + 15}>
              <tspan fill={'#666'}>{yRect.text}</tspan>
            </text>
            <line
              x1={80}
              x2={width - 50}
              y1={yScale(yRect.pos)}
              y2={yScale(yRect.pos)}
              strokeWidth={1}
              strokeDasharray={'5'}
              stroke={'#666'}
            />
          </>
        )}
      </XYChart>
      {barType == 'stack' && tooltipData && (
        <TooltipWithBounds
          left={
            xScale(tooltipData.x) +
            (xType == 'band' ? (xScale as ScaleBand<any>).bandwidth() / 2 : 0)
          }
          top={tooltipData.y}
        >
          <div className="flex flex-col space-y-2" style={{ fontSize: '12px' }}>
            <span className="text-zinc-600">{tooltipData.data.x}</span>
            <div className="flex flex-col space-y-1 font-bold text-black">
              {tooltipKeyList.map((k, i) => {
                return (
                  <span key={`#${id}-tooltip-${k}`}>
                    {k} :{' '}
                    {tooltipData.data[k]?.toLocaleString('ko-KR', {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                );
              })}
            </div>
          </div>
        </TooltipWithBounds>
      )}
    </div>
  );
};

export default withParentSize(LineChart);
