import withParentSize from '../../hooks/withParentSize';
import { ComponentType, useCallback, useMemo, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { GeoJsonObject } from 'geojson';
import L from 'leaflet';
import { geoMercator, geoPath, geoTransform, select } from 'd3';
import 'leaflet/dist/leaflet.css';
import { feature } from 'topojson-client';

interface Props {
  data: any;
  id: string;
  width?: number;
  height?: number;
}

const Map2: ComponentType<Props> = ({ data, id, width, height }) => {
  const [mapState, setMapState] = useState<L.Map>();
  const ref = useCallback((node: any) => {
    setMapState(node);
  }, []);
  const [geoJson, setGeoJson] = useState<any>(undefined);

  // const drawGeoJson = useCallback(() => {
  //   if (mapState && geoJson == undefined) {
  //     const temp = L.geoJSON(data as GeoJsonObject, {
  //       style: () => {
  //         return { color: 'black', weight: 1 };
  //       },
  //     })
  //       .bindTooltip((layer: any) => {
  //         return layer.feature.properties['SGG_NM'];
  //       })
  //       .addTo(mapState);
  //
  //     setGeoJson(temp);
  //   }
  // }, [mapState, geoJson, data]);

  const projectPoint = function (x: number, y: number) {
    if (mapState) {
      const point = mapState.latLngToLayerPoint(new L.LatLng(y, x));
      //@ts-ignore
      this.stream.point(point.x, point.y);
    }
  };
  // const projection = geoMercator()
  //   .scale(70000)
  //   .center([126.9784147, 37.5666805])
  //   .translate([width! / 2, height! / 2]);

  const transform = geoTransform({ point: projectPoint }),
    path = geoPath().projection(transform);

  const svg = useMemo(() => {
    if (mapState) {
      if (!select(`#${id}-svg`).empty()) {
        // window.alert('yes');
        return select(`#${id}-svg`) as any;
      } else {
        // window.alert('no');
        return select(mapState.getPanes().overlayPane)
          .append('svg')
          .attr('id', `${id}-svg`);
      }
    }
  }, [id, mapState]);

  const g = useMemo(() => {
    if (svg) {
      if (svg.select('g').empty()) {
        return svg.append('g').attr('class', 'leaflet-zoom-hide');
      } else {
        return svg.select('g');
      }
    }
  }, [svg]);

  const drawChart = useCallback(() => {
    if (mapState && svg && g) {
      const paths = g.selectAll('path').data(data.features).join('path');
      const reset = () => {
        const bounds = path.bounds(data);
        const topLeft = bounds[0],
          bottomRight = bounds[1];

        svg
          .attr('width', bottomRight[0] - topLeft[0])
          .attr('height', bottomRight[1] - topLeft[1])
          .style('left', topLeft[0] + 'px')
          .style('top', topLeft[1] + 'px');

        g.attr(
          'transform',
          'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')',
        );

        paths
          // @ts-ignore
          .attr('d', path)
          .attr('fill-opacity', 0.6)
          .attr('fill', '#666')
          .attr('stroke', 'white');
      };

      mapState.on('zoomend', reset);
      reset();
    }
  }, [data, g, mapState, path, svg]);

  return (
    <div className={'w-full h-full'}>
      <MapContainer
        center={[37.5666805, 126.9784147]}
        zoom={11}
        // scrollWheelZoom={false}
        style={{ width: `100%`, height: `100%` }}
        ref={ref}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/*<>{drawGeoJson()}</>*/}
        <>{drawChart()}</>
        {/*{seoul && (*/}
        {/*  <GeoJSON*/}
        {/*    data={seoul2 as GeoJsonObject}*/}
        {/*    style={() => {*/}
        {/*      return { color: 'blue', fillColor: 'red' };*/}
        {/*    }}*/}
        {/*  ></GeoJSON>*/}
        {/*)}*/}
      </MapContainer>
    </div>
  );
};

export default withParentSize(Map2);
