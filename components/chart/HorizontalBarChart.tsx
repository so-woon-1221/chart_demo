import withParentSize from 'hooks/withParentSize';
import {
  XYChart,
  AnimatedBarSeries,
  Axis,
  AnnotationLabel,
  AnimatedAnnotation,
} from '@visx/xychart';
import { ComponentType, useMemo } from 'react';
import { LinearGradient } from '@visx/gradient';

interface Props {
  // x축은 x로 고정, index와 x가 아닌키는 모두 라인을 그릴 수 있도록 설정
  data: { x: string; [key: string]: string | number }[];
  id: string;
  width?: number;
  height?: number;
  // xType: "time" | "band" | "point" | "ordinal";
  barType?: string;
  colorSet: string[];
  // showLegend?: boolean;
  limit?: number;
}

const HorizontalBarChart: ComponentType<Props> = ({
  data,
  id,
  width,
  height,
  barType,
  limit,
  colorSet,
}) => {
  const keyList = useMemo(
    () => Object.keys(data[0]).filter((k) => k !== 'x' && k !== 'index'),
    [data],
  );

  return (
    <div className="relative w-full h-full">
      <XYChart
        xScale={
          !!limit
            ? {
                type: 'linear',
                range: [100, width! - 80],
                domain: [0, limit],
              }
            : {
                type: 'linear',
                range: [100, width! - 80],
              }
        }
        yScale={{
          type: 'band',
          domain: data.map((d) => d.x),
          range: [height! - 50, 50],
          padding: 0.2,
        }}
        width={width}
        height={height}
      >
        <Axis orientation="left" left={100} />
        <Axis
          orientation="bottom"
          tickFormat={(d) => {
            if (d % 1 == 0) {
              return d;
            } else {
              return '';
            }
          }}
        />
        <AnimatedBarSeries
          xAccessor={(d) => d.y}
          dataKey={`${id}-bar`}
          data={data}
          yAccessor={(d) => d.x}
          colorAccessor={() => colorSet[0]}
          // colorAccessor={() => `url(#${id}-gradient)`}
        />
        <LinearGradient
          id={`${id}-gradient`}
          from={'#354965'}
          toOpacity={1}
          to={'#02CC9A'}
          fromOpacity={1}
          vertical={false}
        />
        {data.map((d, i) => {
          return (
            <AnimatedAnnotation
              datum={d}
              key={`${id}-bar-annotation-${i}`}
              xAccessor={(d) => d.y}
              //   dx={10}
              yAccessor={(d) => d.x}
              dataKey={`${id}-bar-annotation-${i}`}
            >
              <AnnotationLabel
                title={d.y.toLocaleString('ko-KR', {
                  maximumFractionDigits: 2,
                })}
                horizontalAnchor="start"
                verticalAnchor="middle"
                backgroundProps={{
                  stroke: 'none',
                  fill: 'transparent',
                }}
                fontColor="#354965"
              />
            </AnimatedAnnotation>
          );
        })}
      </XYChart>
    </div>
  );
};

export default withParentSize(HorizontalBarChart);
