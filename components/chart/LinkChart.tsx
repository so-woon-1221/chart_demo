import withParentSize from 'hooks/withParentSize';
import React, { useCallback, useRef, useState } from 'react';
import { DefaultNode, Graph } from '@visx/network';
import { Group } from '@visx/group';
import { select } from 'd3-selection';

interface Props {
  width: number;
  height: number;
  data: {
    link: { source: any; target: any }[];
    node: {
      x: number;
      y: number;
      extent: string[];
      intent: { key: string; value: number }[];
      key: string;
    }[];
  };
  id: string;
  setSelectedKey?: React.Dispatch<
    React.SetStateAction<{
      extent: string[];
      intent: { y: number; x: string }[];
      key: string;
    }>
  >;
  selectedKey: {
    extent: string[];
    intent: { y: number; x: string }[];
    key: string;
  };
}

const LinkChart: React.FC<Props> = ({
  id,
  data,
  width,
  height,
  setSelectedKey,
  selectedKey,
}) => {
  const [selectedNode, setSelectedNode] = useState<string>();
  const svgRef = useRef<SVGSVGElement>(null);
  const nodes = data.node.map((d) => {
    return {
      ...d,
      x: +d.x * (width - 100) + 25,
      y: +d.y * (height - 100) + 25,
    };
  });

  const links = data.link.map((d) => {
    return {
      ...d,
      source: {
        ...d.source,
        x: +d.source.x * (width - 100) + 25,
        y: +d.source.y * (height - 100) + 25,
      },
      target: {
        ...d.target,
        x: +d.target.x * (width - 100) + 25,
        y: +d.target.y * (height - 100) + 25,
      },
    };
  });

  const graph = {
    nodes,
    links,
  };

  const onClickNode = useCallback(
    (node: {
      x: number;
      y: number;
      extent: string[];
      intent: { key: string; value: number }[];
      key: string;
    }) => {
      if (!!setSelectedKey) {
        return setSelectedKey({
          extent: node.extent,
          intent: node.intent.map((d) => {
            return { x: d.key, y: +d.value };
          }),
          key: node.key,
        });
      }
    },
    [setSelectedKey],
  );

  return (
    <div className="relative w-full h-full">
      <svg width={width} height={height} ref={svgRef}>
        <Group>
          {nodes.map((node, i) => {
            return (
              <text key={`${id}-text-${i}`} x={node.x + 30} y={node.y}>
                {node.key}
              </text>
            );
          })}
          <Graph<
            { source: any; target: any },
            {
              x: number;
              y: number;
              extent: string[];
              intent: { key: string; value: number }[];
              key: string;
            }
          >
            graph={graph as any}
            top={25}
            left={25}
            nodeComponent={({ node }) => (
              <DefaultNode
                fill={selectedKey?.key == node.key ? '#02CC9A' : '#354965'}
                r={selectedKey?.key == node.key ? 20 : 15}
                cursor="pointer"
                onClick={() => {
                  onClickNode(node);
                }}
                onMouseOver={() => {
                  if (svgRef.current) {
                    select(svgRef.current)
                      .selectAll(`line.${node.key}`)
                      .attr('stroke', 'red');
                  }
                }}
                onMouseLeave={() => {
                  if (svgRef.current) {
                    select(svgRef.current)
                      .selectAll(`line.${node.key}`)
                      .attr('stroke', '#666');
                  }
                }}
              />
            )}
            linkComponent={({ link: { source, target } }) => (
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                strokeWidth={2}
                stroke="#999"
                strokeOpacity={0.6}
                className={`${source.key} ${target.key}`}
              />
            )}
          />
        </Group>
      </svg>
    </div>
  );
};

export default withParentSize(LinkChart);
