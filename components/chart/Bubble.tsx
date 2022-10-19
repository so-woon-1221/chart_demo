import withParentSize from 'hooks/withParentSize';
import { useCallback, useMemo, useState } from 'react';
import { Group } from '@visx/group';
import { Pack, hierarchy } from '@visx/hierarchy';
import { max, scaleLinear, format, select, HierarchyCircularNode } from 'd3';
import { TooltipWithBounds as Tooltip } from '@visx/tooltip';

interface Props {
  data: Array<{ key: string; data: number; percent: number }>;
  width?: number;
  height?: number;
  id: string;
  colorList?: string[];
}

const formatter = format(',.2f');

const Bubble: React.FC<Props> = ({
  data,
  id,
  width,
  height,
  colorList,
  // isTransitionEnd,
  // setIsTransitionEnd,
}) => {
  const [tooltipData, setTooltipData] = useState<{
    name: string;
    data: number;
    percent: number;
    x: number;
    y: number;
  }>();

  const root = useMemo(() => {
    const pack = {
      children: data.map((d) => {
        return { name: d.key, data: +d.data, percent: d.percent };
      }),
      name: '성 연령',
      data: 0,
      percent: 0,
    };
    return hierarchy<any>(pack)
      .sum((d) => {
        return d.percent;
      })
      .sort((a, b) => {
        return b.data.percent - a.data.percent;
      });
  }, [data]);

  const scaleCircle = scaleLinear()
    .domain([0, max(data.map((d) => +d.percent))!])
    .range([0, width! / 10]);

  const drawChart = useCallback(
    (circle: any[]) => {
      const data = circle as HierarchyCircularNode<any>[];

      const chartArea = select(`#${id}-area`).select('g');
      chartArea
        .selectAll('circle')
        .data(data)
        .join((enter) =>
          enter
            .append('circle')
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y),
        )
        .attr('fill', colorList ? colorList[0] : 'black')
        .on('mouseover', (e, d) => {
          // if (isTransitionEnd) {
          setTooltipData(
            Object.assign(d.data, {
              x: d.x,
              y: d.y,
            }),
          );
          // }
        })

        // .on('mouseleave', () => isTransitionEnd && setTooltipData(undefined))
        .on('mouseleave', () => setTooltipData(undefined))
        .transition()
        // .on('end', () => setIsTransitionEnd(true))
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('r', (d) => scaleCircle(d.data.percent));

      chartArea
        .selectAll('text.name')
        .data(data)
        .join((enter) =>
          enter
            .append('text')
            .attr('x', (d) => d.x)
            .attr('y', (d) => d.y - 10),
        )
        .attr('class', 'name')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('pointer-events', 'none')
        .attr('font-size', 14)
        .attr('fill', 'white')
        .transition()
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y - 10)
        .text((d) =>
          scaleCircle(d.data.percent) > 50 ? d.data.name.split(' ')[0] : '',
        );

      chartArea
        .selectAll('text.value')
        .data(data)
        .join((enter) =>
          enter
            .append('text')
            .attr('x', (d) => d.x)
            .attr('y', (d) => d.y + 10),
        )
        .attr('class', 'value')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('pointer-events', 'none')
        .attr('font-size', 14)
        .attr('fill', 'white')
        .transition()
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y + 10)
        .text((d) =>
          scaleCircle(d.data.percent) > 50 ? d.data.name.split(' ')[1] : '',
        );

      return <g />;
    },
    // [id, isTransitionEnd, scaleCircle, setIsTransitionEnd],
    [id, scaleCircle],
  );

  return (
    <div className="relative w-full h-full">
      {/*{tooltipData && isTransitionEnd && (*/}
      {tooltipData && (
        <Tooltip left={tooltipData.x + 70} top={tooltipData.y + 25}>
          <div className="flex flex-col space-y-2" style={{ fontSize: '12px' }}>
            <div className="text-zinc-600">{tooltipData.name}</div>
            <div className="font-bold text-black">
              {formatter(tooltipData.percent)}%
            </div>
          </div>
        </Tooltip>
      )}
      <svg width={width} height={height}>
        {root && (
          <Pack<any>
            root={root}
            size={[width! - 100, height! - 100]}
            radius={(d) => {
              return scaleCircle(d.data.percent);
            }}
          >
            {(packData) => {
              const circles = packData
                .descendants()
                .filter((d) => d.children == undefined);
              return (
                <Group top={50} left={50} id={`${id}-area`}>
                  {drawChart(circles)}
                </Group>
              );
            }}
          </Pack>
        )}
      </svg>
    </div>
  );
};

export default withParentSize(Bubble);
