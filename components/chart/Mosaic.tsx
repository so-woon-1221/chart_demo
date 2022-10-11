import withParentSize from '../../hooks/withParentSize';
import {
  ComponentType,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  group,
  select,
  treemap,
  treemapSliceDice,
  hierarchy,
  scaleOrdinal,
} from 'd3';

interface Props {
  data: Array<{ x: string; y: string; value: number }>;
  width: number;
  height: number;
  id: string;
  colorList: string[];
}

const margin = { top: 50, right: 30, bottom: 20, left: 30 };

const Mosaic: ComponentType<Props> = ({
  data,
  width,
  height,
  id,
  colorList,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const color = useMemo(
    () =>
      scaleOrdinal()
        .domain(Array.from(group(data, (d) => d.y).keys()))
        .range(colorList),
    [colorList, data],
  );

  const treeGenerator = (
    data: Array<{ x: string; y: string; value: number }>,
    width: number,
    height: number,
  ) => {
    return treemap()
      .round(true)
      .tile(treemapSliceDice)
      .size([
        width - margin.left - margin.right,
        height - margin.top - margin.bottom,
      ])(
        hierarchy(
          group(
            data,
            (d) => d.x,
            (d) => d.y,
          ),
          //  @ts-ignore
        ).sum((d) => d.value),
      )
      .each((d) => {
        d.x0 += margin.left;
        d.x1 += margin.left;
        d.y0 += margin.top;
        d.y1 += margin.top;
      });
  };
  const drawChart = useCallback(
    (svg: RefObject<SVGSVGElement>) => {
      if (svg.current) {
        const root = treeGenerator(data, width, height);

        const container = select(svg.current);

        const node = container
          .selectAll('g')
          .data(root.descendants())
          .join('g')
          .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`);

        const column = node.filter((d) => d.depth === 1);

        column.each(function (d) {
          const thisNode = select(this);
          thisNode.selectAll('text').remove();
          thisNode.selectAll('line').remove();

          thisNode
            .append('text')
            .attr('x', 3)
            .attr('y', '-1.7em')
            .style('font-weight', 'bold')
            .text((d.data as any)[0]);

          thisNode
            .append('text')
            .attr('x', 3)
            .attr('y', '-0.5em')
            .text(d.value!);

          thisNode
            .append('line')
            .attr('x1', -0.5)
            .attr('x2', -0.5)
            .attr('y1', -30)
            .attr('y2', (d: any) => d.y1 - d.y0)
            .attr('stroke', '#000');
        });

        const cell = node.filter((d) => d.depth === 2);

        cell.each(function (d) {
          select(this).selectAll('rect').remove();

          select(this)
            .append('rect')
            .attr('fill', (d: any) => {
              const key = (d.data as any)[0];
              // console.log(d);

              return color(key) as string;
            })
            .attr('fill-opacity', (d: any) => d.value! / d.parent!.value!)
            .transition()
            .attr('width', (d: any) => d.x1 - d.x0 - 1)
            .attr('height', (d: any) => d.y1 - d.y0 - 1);

          select(this).selectAll('text').remove();
          select(this)
            .append('text')
            .attr('x', 3)
            .attr('y', '1.1em')
            .text((d.data as any)[0]);
          select(this)
            .append('text')
            .attr('x', 3)
            .attr('y', '2.3em')
            .text(d.value!);
        });
      }
    },
    [color, data, height, width],
  );

  useEffect(() => {
    if (svgRef.current) {
      drawChart(svgRef);
    }
  }, [drawChart, svgRef]);

  return (
    <div className={'w-full h-full'}>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};

export default withParentSize(Mosaic);
