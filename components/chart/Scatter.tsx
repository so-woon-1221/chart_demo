import withParentSize from '../../hooks/withParentSize';
import { ComponentType, useMemo } from 'react';
import { Group } from '@visx/group';
import { max, ScaleBand, scaleBand, scaleLinear, scaleTime } from 'd3';
import { Axis } from '@visx/axis';
import { GridRows } from '@visx/grid';

interface Props {
  data: { x: string | number | Date; [key: string]: number | string | Date }[];
  id: string;
  width: number;
  height: number;
  colorList: string[];
  xType: 'band' | 'linear' | 'time';
}

const Scatter: ComponentType<Props> = ({
  data,
  id,
  width,
  height,
  colorList,
  xType,
}) => {
  const keyList = useMemo(() => {
    const { x, ...rest } = data[0];
    return Object.keys(rest);
  }, [data]);

  const maxY = useMemo(() => {
    const rest = data.map(({ x, ...rest }) => Object.values(rest));
    return max(rest as any, (d: number[]) => max(d, (a: number) => a));
  }, [data]);

  const xScale = useMemo(() => {
    switch (xType) {
      case 'band':
        return scaleBand()
          .domain(data.map((d) => d.x as string))
          .range([50, width - 50]);
      case 'linear':
        return scaleLinear()
          .domain(data.map((d) => d.x as number))
          .range([50, width - 50]);
      case 'time':
        return scaleTime()
          .domain(data.map((d) => d.x as Date))
          .range([50, width - 50]);
    }
  }, [data, width, xType]);

  const yScale = useMemo(() => {
    return scaleLinear()
      .range([height - 50, 50])
      .domain([0, maxY as number]);
  }, [height, maxY]);

  return (
    <div className={'w-full h-full'}>
      <svg width={width} height={height}>
        <Axis scale={xScale} top={height - 50} />
        <Axis scale={yScale} left={50} orientation={'left'} />
        <GridRows scale={yScale} width={width - 100} left={50} />
        <Group>
          {keyList.map((k, i) => {
            return (
              <Group key={`${id}-scatter-${k}`}>
                {data.map((a, j) => {
                  return (
                    <circle
                      key={`${id}-scatter-${a.x}-${j}`}
                      cx={
                        xScale(a.x as any)! +
                        (xType == 'band'
                          ? (xScale as ScaleBand<string>).bandwidth() / 2
                          : 0)
                      }
                      cy={yScale(a[k] as number)}
                      r={3}
                      stroke={colorList[i]}
                      fill={colorList[i]}
                      fillOpacity={0.5}
                    />
                  );
                })}
                )
              </Group>
            );
          })}
        </Group>
      </svg>
    </div>
  );
};

export default withParentSize(Scatter);
