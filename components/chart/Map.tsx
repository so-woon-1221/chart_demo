import { Zoom } from '@visx/zoom';
import withParentSize from '../../hooks/withParentSize';
import { ComponentType, useEffect, useState } from 'react';
import { Graticule } from '@visx/geo';
import { mean, select } from 'd3';
import { feature } from 'topojson-client';
import { defaultStyles, TooltipWithBounds } from '@visx/tooltip';
import Projection from '@visx/geo/lib/projections/Projection';
import { localPoint } from '@visx/event';

interface Props {
  data: any;
  id: string;
  width?: number;
  height?: number;
}

interface FeatureShape {
  type: 'Feature';
  id: string;
  geometry: { coordinates: [number, number][][]; type: 'Polygon' };
  properties: { ADM_SECT_C: string; SGG_NM: string };
}

const Map: ComponentType<Props> = ({ data, id, width, height }) => {
  const [mapData, setMapData] = useState<
    | {
        type: 'FeatureCollection';
        features: FeatureShape[];
      }
    | undefined
  >(undefined);

  useEffect(() => {
    if (mapData == undefined) {
      const temp = feature(data, data.objects['서울시2']) as unknown as {
        type: 'FeatureCollection';
        features: FeatureShape[];
      };

      setMapData(temp);
    }
  }, [data, mapData]);

  const [center, setCenter] = useState<[number, number]>([126.9895, 37.5651]);
  const [scale, setScale] = useState(70000);
  const [tooltip, setTooltip] = useState<null | { x: number; y: number }>(null);

  return (
    <Zoom<SVGSVGElement>
      width={width!}
      height={height!}
      scaleXMin={1 / 2}
      scaleXMax={4}
      scaleYMin={1 / 2}
      scaleYMax={4}
    >
      {(zoom) => (
        <>
          {tooltip && (
            <TooltipWithBounds
              left={tooltip.x}
              top={tooltip.y}
              key={Math.random()}
              style={{
                ...defaultStyles,
                transform: `translate(${tooltip.x}px, ${tooltip.y}px)`,
              }}
              applyPositionStyle
            >
              aaa
            </TooltipWithBounds>
          )}
          <svg width={width} height={height} ref={zoom.containerRef}>
            {/*<RectClipPath id="zoom-clip" width={width} height={height} />*/}
            {mapData && (
              <Projection
                data={mapData.features}
                center={center}
                translate={[width! / 2, height! / 2]}
                scale={scale}
              >
                {(projection) => {
                  return (
                    <g transform={zoom.toString()}>
                      <Graticule
                        graticule={(g) => projection.path(g) || ''}
                        stroke={'purple'}
                      />
                      {projection.features.map(
                        ({ feature, path, centroid }, i) => {
                          return (
                            <path
                              key={`map-feature-${i}`}
                              d={path || ''}
                              fill={'#666'}
                              stroke={'white'}
                              strokeWidth={0.5}
                              onClick={(events) => {
                                if (events)
                                  alert(
                                    `Clicked: ${feature.properties.SGG_NM} (${feature.properties.ADM_SECT_C})`,
                                  );
                              }}
                              onMouseMove={function (e) {
                                // const left = mean(
                                //   feature.geometry.coordinates[0],
                                //   (a) => a[0],
                                // );
                                // const top = mean(
                                //   feature.geometry.coordinates[0],
                                //   (a) => a[1],
                                // );
                                //
                                // const [x, y] = projection.projection([
                                //   left!,
                                //   top!,
                                // ])!;

                                setTooltip(localPoint(e));

                                select(
                                  (e.target as SVGPathElement).parentElement,
                                )
                                  .selectAll('path')
                                  .attr('fill-opacity', 0.3);

                                select(e.target as SVGPathElement)
                                  .attr('fill-opacity', 1)
                                  .attr('fill', '#000');
                              }}
                              onMouseOut={(e) => {
                                select(
                                  (e.target as SVGPathElement).parentElement,
                                )
                                  .selectAll('path')
                                  .attr('fill-opacity', 1)
                                  .attr('fill', '#666');

                                setTooltip(null);
                              }}
                            />
                          );
                        },
                      )}
                    </g>
                  );
                }}
              </Projection>
            )}
          </svg>
        </>
      )}
    </Zoom>
  );
};

export default withParentSize(Map);
