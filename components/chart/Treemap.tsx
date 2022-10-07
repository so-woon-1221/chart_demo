import {
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from 'react';
import { select, stratify, treemap, extent, HierarchyNode, pointer } from 'd3';
import { scaleLog, ContinuousInput } from '@visx/scale';
import { TooltipWithBounds as Tooltip } from '@visx/tooltip';
import withParentSize from 'hooks/withParentSize';
// import { useRecoilValue } from 'recoil';
// import { filterStateAtom } from 'atom/filterStateAtom';

interface Props {
  data: Array<{ id: string; parent: string | null; size: number }>;
  width: number;
  height: number;
  id: string;
  setSelectedKey?: Dispatch<SetStateAction<string>>;
  colorSet?: string[];
}

const Treemap: React.FC<Props> = ({
  data,
  id,
  width,
  height,
  setSelectedKey,
  colorSet = ['#ef4444', '#0891b2'],
}) => {
  const [isTransitionEnd, setIsTransitionEnd] = useState(false);
  // const filterState = useRecoilValue(filterStateAtom);
  const colorScale = useMemo(
    () =>
      scaleLog({
        domain: extent(
          data.filter((d) => d.parent !== null).map((d) => d.size),
        ) as ContinuousInput[],
        range: colorSet,
      }),
    [colorSet, data],
  );

  const [tooltipData, setTooltipData] = useState<
    | {
        parent: string;
        key: string;
        value: number;
        x: number | undefined;
        y: number | undefined;
      }
    | undefined
  >();

  // useEffect(() => {
  //   setIsTransitionEnd(false);
  // }, [filterState]);

  const drawChart = useCallback(() => {
    const chartArea = select(`#${id}-tree`).attr(
      'transform',
      'translate(25,25)',
    );
    const textArea = select(`#${id}-text`).attr(
      'transform',
      'translate(25,25)',
    );

    const root = stratify()
      .id((d: any) => d.id)
      .parentId((d: any) => d.parent)(data.sort((a, b) => b.size - a.size));
    root.sum((d: any) => d.size || 0);

    treemap()
      .size([width - 50, height - 50])
      .padding(0)(root);

    chartArea
      .selectAll('rect')
      .data(root.leaves())
      .join((enter) =>
        enter
          .append('rect')
          .attr('x', function (d: any) {
            return d.x0;
          })
          .attr('y', function (d: any) {
            return d.y0;
          })
          .attr('width', function (d: any) {
            return (d.x1 - d.x0) / 2;
          })
          .attr('height', function (d: any) {
            return (d.y1 - d.y0) / 2;
          }),
      )
      .attr('cursor', 'pointer')
      .on(
        'mousemove touchmove touchstart',
        function (e, d: HierarchyNode<any>) {
          if (d.value && d.parent?.value && isTransitionEnd) {
            setTooltipData({
              parent: d.data.parent,
              key: d.data.id,
              value: (d.value / d.parent.value) * 100,
              // x: (d.x0 + d.x1) / 2,
              // y: (d.y0 + d.y1) / 2,
              x: pointer(e)[0],
              y: pointer(e)[1],
            });
          } else {
            setTooltipData(undefined);
          }
        },
      )
      .on('mouseleave', () => {
        setTooltipData(undefined);
      })
      .on('click', (e, d) => {
        if (setSelectedKey && d.id) {
          setSelectedKey(d.id);
        }
      })
      .attr('x', function (d: any) {
        return d.x0;
      })
      .attr('y', function (d: any) {
        return d.y0;
      })
      .transition()
      .on('end', () => setIsTransitionEnd(true))
      .attr('width', function (d: any) {
        return d.x1 - d.x0;
      })
      .attr('height', function (d: any) {
        return d.y1 - d.y0;
      })

      .style('stroke', '#eee')
      .style('fill', (d: any) => {
        return colorScale(d.value);
      });

    textArea
      .selectAll('text')
      .data(root.leaves())
      .join('text')
      .call(() => {})
      .attr('x', function (d: any) {
        return d.x0 + 8;
      })
      .attr('y', function (d: any) {
        return d.y0 + 20;
      })
      .text(function (d: any) {
        if (d.y1 - d.y0 > 25 && d.x1 - d.x0 > 80) {
          //   return `${d.id} - ${d.value.toLocaleString("ko-KR", {
          //     maximuFractionDigits: 0,
          //   })}`;
          return d.id;
        } else {
          return '';
        }
      })
      .attr('font-size', '14px')
      .attr('fill', 'white')
      .attr('pointer-events', 'none');

    return (
      <>
        <g id={`${id}-tree`} />
        <g id={`${id}-text`} />
      </>
    );
  }, [colorScale, data, height, id, isTransitionEnd, setSelectedKey, width]);

  return (
    <div className="relative w-full h-full">
      <svg width={width} height={height}>
        {drawChart()}
      </svg>
      {tooltipData && (
        <Tooltip
          left={tooltipData?.x ? tooltipData.x + 20 : 0}
          top={tooltipData?.y ? tooltipData.y + 15 : 0}
          id={`${id}-chart-tooltip`}
        >
          <div className="space-y-2" style={{ fontSize: '12px' }}>
            <div className="text-zinc-600">{tooltipData.parent}</div>
            <div className="flex flex-col space-y-1 font-bold text-black">
              <span>{tooltipData.key}</span>
              <span>
                {tooltipData?.value.toLocaleString('ko-KR', {
                  maximumFractionDigits: 2,
                })}
                %
              </span>
            </div>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default withParentSize(Treemap);
