import withParentSize from 'hooks/withParentSize';
import {
  XYChart,
  AnimatedBarStack,
  AnimatedBarSeries,
  Axis,
  Tooltip,
  AnimatedBarGroup,
  AnimatedAnnotation,
  AnnotationLabel,
} from '@visx/xychart';
import { ComponentType, useCallback, useMemo, useState } from 'react';
import { max, min, ScaleBand, scaleOrdinal, select } from 'd3';
import moment from 'moment';
import { GridRows } from '@visx/grid';
import { scaleLinear, scaleTime, scaleBand } from '@visx/scale';
import { TooltipWithBounds } from '@visx/tooltip';

interface Props {
  // x축은 x로 고정, index와 x가 아닌키는 모두 라인을 그릴 수 있도록 설정
  data: {
    x: string;
    [key: string]: string | number | boolean;
  }[];
  id: string;
  width?: number;
  height?: number;
  xType: 'time' | 'band' | 'point' | 'ordinal';
  barType?: string;
  colorSet: string[];
  showLegend?: boolean;
  annotationType?: 'sum' | 'rate';
  keyArray?: string[];
  showAnno?: boolean;
}

const BarChart: ComponentType<Props> = ({
  data,
  id,
  width,
  height,
  xType,
  barType,
  colorSet,
  showLegend = true,
  annotationType,
  keyArray,
  showAnno,
}) => {
  // y축을 쌓기위한 Key List
  const keyList = useMemo(() => {
    if (!!keyArray) {
      return keyArray;
    } else {
      return Object.keys(data[0]).filter(
        (k) => k !== 'x' && k !== 'index' && k !== 'is_future',
      );
    }
  }, [data, keyArray]);

  const tooltipKeyList = useMemo(() => {
    return [...keyList].reverse();
  }, [keyList]);

  const color = useMemo(() => {
    return scaleOrdinal().domain(keyList).range(colorSet);
  }, [colorSet, keyList]);

  // y축 표시를 위한 것
  const maxY = useMemo(() => {
    const yArray: number[] = [];
    data.forEach((d) => {
      switch (barType) {
        case 'stack':
          let sum = 0;
          keyList.forEach((k) => {
            sum += +d[`${k}`];
          });
          yArray.push(sum);
          break;

        default:
          keyList.forEach((k) => {
            yArray.push(+d[`${k}`]);
          });
          break;
      }
    });

    const maxValue = max(yArray) ?? 0;

    return maxValue * 1.1;
  }, [barType, data, keyList]);

  const xScale = useMemo(() => {
    switch (xType) {
      case 'time':
        return scaleTime({
          domain: [
            moment(min(data.map((d) => d.x)), 'YYYYMMDD').toDate(),
            moment(max(data.map((d) => d.x)), 'YYYYMMDD').toDate(),
          ],
          range: [80, width! - 50],
        });
      default:
        return scaleBand({
          domain: data.map((d) => d.x),
          range: [80, width! - 50],
        });
    }
  }, [data, width, xType]);

  const yScale = useMemo(() => {
    return scaleLinear({ range: [height! - 50, 50], domain: [0, maxY] });
  }, [height, maxY]);

  const drawLegend = useCallback(() => {
    return (
      <div className="absolute top-0 -translate-x-1/2 translate-y-1/2 left-1/2">
        <ul className="flex space-x-2">
          {keyList.map((d, i) => {
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
                    fill={(color(d) as string) ?? '#e3e3e3'}
                  />
                </svg>
                <span>{d}</span>
              </li>
            );
          })}
          {!!data.find((d) => d.is_future == true) && (
            <li className="flex items-center space-x-1">
              {' '}
              <svg width={15} height={15}>
                <rect x={0} y={0} width={15} height={15} fill={'#666'} />
              </svg>
              <span>예측</span>
            </li>
          )}
        </ul>
      </div>
    );
  }, [color, id, keyList]);

  const getSum = useCallback(
    (d: any) => {
      let sum = 0;
      keyList.forEach((k) => {
        sum += +d[k];
      });
      return sum;
    },
    [keyList],
  );

  const getSumFromTo = useCallback(
    (d: any, index: number) => {
      let sum = 0;
      for (let i = 0; i <= index; i++) {
        sum += d[`${keyList[i]}`];
      }
      return sum;
    },
    [keyList],
  );

  const [tooltipData, setTooltipData] = useState<{
    data: { [key: string]: string | number | boolean };
    x: number;
    y: number;
    title?: string;
  }>();

  return (
    <div className="relative w-full h-full">
      {showLegend && drawLegend()}
      <XYChart
        width={width}
        height={height}
        xScale={{
          // @ts-ignore
          type: xType,
          domain:
            xType == 'time'
              ? [
                  moment(min(data.map((d) => d.x)), 'YYYYMMDD').toDate(),
                  moment(max(data.map((d) => d.x)), 'YYYYMMDD').toDate(),
                ]
              : data.map((d) => d.x),
          range: [80, width! - 50],
          padding: xType == 'time' ? 0 : 0.2,
        }}
        yScale={{
          type: 'linear',
          domain: [0, maxY],
          range: [height! - 50, 50],
        }}
        onPointerMove={(e) => {
          if (barType == 'stack') {
            const datum = e.datum as any;
            const x = datum.data.stack;

            const findData = data.find((d) => d.x == x);

            if (data[e.index]) {
              if (xType == 'time') {
                setTooltipData({
                  x: xScale(datum.data.stack)!,
                  y: 25,
                  data: data[e.index],
                  title: findData?.is_future ? '예측값' : '',
                });
              } else {
                const scale = xScale as ScaleBand<string>;
                setTooltipData({
                  x: scale(datum.data.stack)! + scale.bandwidth() / 2,
                  y: yScale(getSum(data[e.index])),
                  data: data[e.index],
                  title: findData?.is_future ? '예측값' : '',
                });
              }
            }
          }
        }}
        onPointerOut={(e) => {
          if (barType == 'stack') {
            setTooltipData(undefined);
          }
        }}
      >
        <GridRows width={width! - 130} left={80} scale={yScale} numTicks={3} />
        <Axis
          orientation="bottom"
          tickFormat={(d) =>
            xType == 'time' ? moment(d).format('YYYYMMDD') : d
          }
        />
        <Axis orientation="left" left={80} />
        {barType == 'stack' ? (
          <AnimatedBarStack>
            {keyList.map((k, i) => {
              return (
                <AnimatedBarSeries
                  key={`${id}-line-${k}`}
                  dataKey={`${id}-line-${k}`}
                  xAccessor={(d) =>
                    xType == 'time' ? moment(d.x, 'YYYYMMDD').toDate() : d.x
                  }
                  yAccessor={(d) => +d[`${k}`]}
                  data={data}
                  colorAccessor={(d) =>
                    d.is_future ? '#666' : (color(k) as string)
                  }
                />
              );
            })}
          </AnimatedBarStack>
        ) : barType == 'group' ? (
          <AnimatedBarGroup>
            {keyList.map((k, i) => {
              return (
                <AnimatedBarSeries
                  key={`${id}-bar-${k}`}
                  dataKey={`${id}-bar-${k}`}
                  xAccessor={(d) =>
                    xType == 'time' ? moment(d.x, 'YYYYMMDD').toDate() : d.x
                  }
                  yAccessor={(d) => +d[`${k}`]}
                  data={data}
                  colorAccessor={() => color(k) as string}
                />
              );
            })}
          </AnimatedBarGroup>
        ) : (
          keyList.map((k, i) => {
            return (
              <AnimatedBarSeries
                key={`${id}-bar-${i}`}
                dataKey={`${id}-bar-${i}`}
                xAccessor={(d) =>
                  xType == 'time' ? moment(d.x, 'YYYYMMDD').toDate() : d.x
                }
                yAccessor={(d) => +d[`${k}`]}
                data={data}
                colorAccessor={() => color(k) as string}
                // colorAccessor={() => `url(#${id}-gradient)`}
              />
            );
          })
        )}
        {/* <LinearGradient
          id={`${id}-gradient`}
          to={"#354965"}
          fromOpacity={1}
          //   from={"#354965"}
          //   to={"#354965"}
          from={"#02CC9A"}
          toOpacity={1}
        /> */}
        {barType !== 'stack' && (
          <Tooltip
            renderTooltip={(e) => {
              const datum = e.tooltipData?.nearestDatum?.datum as {
                [key: string]: number;
              };

              const tooltipData: { key: string; value: number }[] = [];

              if (datum) {
                keyList.forEach((k) => {
                  tooltipData.push({
                    key: k,
                    value: +datum[`${k}`],
                  });
                });

                if (tooltipData.length > 1) {
                  return (
                    <div className="flex flex-col space-y-2">
                      <span className="text-zinc-600">{datum.x}</span>
                      <div className="flex flex-col space-y-1 font-bold">
                        {tooltipData.map((d, i) => {
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
                  );
                }
                // 막대가 스택도 아니고 하나만 나오면 annotiation 나오는데 툴팁이 있어야할까에 대한 의문
                else {
                  if (data.length >= 13) {
                    return (
                      <div className="flex flex-col space-y-2">
                        <span>{datum.x}</span>
                        <span>
                          {tooltipData[0].value.toLocaleString('ko-KR', {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    );
                  }
                  return undefined;
                }
              }
            }}
            snapTooltipToDatumX
            snapTooltipToDatumY
          />
        )}
        {showAnno &&
          data.length < 13 &&
          (annotationType == 'sum'
            ? data.map((d, i) => {
                return (
                  <AnimatedAnnotation
                    datum={d}
                    key={`#${id}-label-${i}`}
                    dataKey={`#${id}-label-${i}`}
                    xAccessor={(d) => d.x}
                    yAccessor={(d) => getSum(d)}
                  >
                    <AnnotationLabel
                      title={getSum(+d).toLocaleString('ko-KR', {
                        maximumFractionDigits: 2,
                      })}
                      horizontalAnchor="middle"
                      backgroundProps={{
                        fill: 'transparent',
                      }}
                      anchorLineStroke="none"
                      titleFontSize={12}
                    />
                  </AnimatedAnnotation>
                );
              })
            : keyList.map((k, i) => {
                return data.map((d, j) => {
                  return (
                    <AnimatedAnnotation
                      datum={d}
                      key={`${id}-label-${i}-${j}`}
                      dataKey={`${id}-label-${i}-${j}`}
                      xAccessor={(d) => d.x}
                      yAccessor={(d) => getSumFromTo(d, i)}
                    >
                      <AnnotationLabel
                        title={(+d[k]).toLocaleString('ko-KR', {
                          maximumFractionDigits: 2,
                        })}
                        horizontalAnchor="middle"
                        backgroundProps={{
                          fill: 'transparent',
                        }}
                        anchorLineStroke="none"
                        titleFontSize={12}
                      />
                    </AnimatedAnnotation>
                  );
                });
              }))}
      </XYChart>
      {barType == 'stack' && tooltipData && (
        <TooltipWithBounds left={tooltipData.x} top={tooltipData.y}>
          <div className="flex flex-col space-y-2" style={{ fontSize: '12px' }}>
            <span className="text-zinc-600">
              {tooltipData.data.x}{' '}
              {tooltipData.title && `(${tooltipData.title})`}
            </span>
            <div className="flex flex-col space-y-1 font-bold text-black">
              {tooltipKeyList.map((k, i) => {
                return (
                  <span key={`#${id}-tooltip-${k}`}>
                    {k} :{' '}
                    {tooltipData.data[k].toLocaleString('ko-KR', {
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

export default withParentSize(BarChart);
