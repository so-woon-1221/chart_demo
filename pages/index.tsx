import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
const BoxPlot = dynamic(() => import('../components/chart/BoxPlot'));
const NetworkChart = dynamic(() => import('../components/chart/NetworkChart'));
const BarChart = dynamic(() => import('../components/chart/BarChart'), {
  ssr: false,
});
const LineChart = dynamic(() => import('../components/chart/LineChart'), {
  ssr: false,
});
const HorizontalBarChart = dynamic(
  () => import('../components/chart/HorizontalBarChart'),
  {
    ssr: false,
  },
);
const Bubble = dynamic(() => import('../components/chart/Bubble'), {
  ssr: false,
});
const PieChart = dynamic(() => import('../components/chart/PieChart'), {
  ssr: false,
});
const Treemap = dynamic(() => import('../components/chart/Treemap'), {
  ssr: false,
});
const LineChartWithBarChart = dynamic(
  () => import('../components/chart/LineChartWithBarChart'),
  { ssr: false },
);
import RadarChart from '../components/chart/RadarChart';
import Scatter from '../components/chart/Scatter';
import Head from 'next/head';
import Mosaic from '../components/chart/Mosaic';

const nodes = [
  { x: 50, y: 20 },
  { x: 200, y: 250 },
  { x: 300, y: 40, color: '#26deb0' },
];

const links = [
  { source: nodes[0], target: nodes[1] },
  { source: nodes[1], target: nodes[2] },
  { source: nodes[2], target: nodes[0], dashed: true },
];

const Home: NextPage = () => {
  return (
    <div className={'flex flex-col gap-y-4 p-3'}>
      <h1 className={'text-xl font-bold'}>차트 목록</h1>
      <div className={'grid grid-cols-3 gap-5'}>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>기본 바차트</span>
          <BarChart
            data={[
              { x: '1', y: 1 },
              { x: '2', y: 12 },
              { x: '3', y: 11 },
              { x: '4', y: 14 },
              { x: '5', y: 11 },
              { x: '6', y: 4 },
              { x: '7', y: 6 },
              { x: '8', y: 9 },
              { x: '9', y: 10 },
              { x: '10', y: 12 },
            ]}
            id={'barchart'}
            colorSet={['#333']}
            xType={'band'}
          />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>그룹 바차트</span>
          <BarChart
            data={[
              { x: '1', y: 1, y2: 12 },
              { x: '2', y: 12, y2: 13 },
              { x: '3', y: 11, y2: 1 },
              { x: '4', y: 14, y2: 2 },
              { x: '5', y: 11, y2: 4 },
              { x: '6', y: 4, y2: 6 },
              { x: '7', y: 6, y2: 12 },
              { x: '8', y: 9, y2: 2 },
              { x: '9', y: 10, y2: 7 },
              { x: '10', y: 12, y2: 12 },
            ]}
            id={'barchart2'}
            colorSet={['#333', '#888']}
            xType={'band'}
            barType={'group'}
          />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>스택 바차트</span>
          <BarChart
            data={[
              { x: '1', y: 1, y2: 12 },
              { x: '2', y: 12, y2: 13 },
              { x: '3', y: 11, y2: 1 },
              { x: '4', y: 14, y2: 2 },
              { x: '5', y: 11, y2: 4 },
              { x: '6', y: 4, y2: 6 },
              { x: '7', y: 6, y2: 12 },
              { x: '8', y: 9, y2: 2 },
              { x: '9', y: 10, y2: 7 },
              { x: '10', y: 12, y2: 12 },
            ]}
            id={'barchart3'}
            colorSet={['#333', '#888']}
            xType={'band'}
            barType={'stack'}
          />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>가로 바 차트</span>
          <HorizontalBarChart
            data={[
              { x: '1', y: 1 },
              { x: '2', y: 12 },
              { x: '3', y: 11 },
              { x: '4', y: 14 },
              { x: '5', y: 11 },
              { x: '6', y: 4 },
              { x: '7', y: 6 },
              { x: '8', y: 9 },
              { x: '9', y: 10 },
              { x: '10', y: 12 },
            ]}
            id={'horizon-bar'}
            colorSet={['#333']}
            xType={'band'}
            // barType={'stack'}
          />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>라인차트</span>
          <LineChart
            data={[
              { x: '1', y: 1 },
              { x: '2', y: 12 },
              { x: '3', y: 11 },
              { x: '4', y: 14 },
              { x: '5', y: 11 },
              { x: '6', y: 4 },
              { x: '7', y: 6 },
              { x: '8', y: 9 },
              { x: '9', y: 10 },
              { x: '10', y: 12 },
            ]}
            id={'lineChart'}
            colorList={['#333']}
            xType={'band'}
            // barType={'stack'}
          />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>스택 라인차트</span>
          <LineChart
            data={[
              { x: '1', y: 1, y2: 12 },
              { x: '2', y: 12, y2: 13 },
              { x: '3', y: 11, y2: 1 },
              { x: '4', y: 14, y2: 2 },
              { x: '5', y: 11, y2: 4 },
              { x: '6', y: 4, y2: 6 },
              { x: '7', y: 6, y2: 12 },
              { x: '8', y: 9, y2: 2 },
              { x: '9', y: 10, y2: 7 },
              { x: '10', y: 12, y2: 12 },
            ]}
            id={'lineChart2'}
            colorList={['#333', '#777']}
            xType={'band'}
            barType={'stack'}
          />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>다중 라인차트</span>
          <LineChart
            data={[
              { x: '1', y: 1, y2: 12 },
              { x: '2', y: 12, y2: 13 },
              { x: '3', y: 11, y2: 1 },
              { x: '4', y: 14, y2: 2 },
              { x: '5', y: 11, y2: 4 },
              { x: '6', y: 4, y2: 6 },
              { x: '7', y: 6, y2: 12 },
              { x: '8', y: 9, y2: 2 },
              { x: '9', y: 10, y2: 7 },
              { x: '10', y: 12, y2: 12 },
            ]}
            id={'lineChart3'}
            colorList={['#333', '#777']}
            xType={'band'}
            // barType={'stack'}
          />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>라인차트 + 바차트</span>
          <LineChartWithBarChart
            data={{
              lineData: [
                { x: '1', y: 1 },
                { x: '2', y: 12 },
                { x: '3', y: 11 },
                { x: '4', y: 14 },
                { x: '5', y: 11 },
                { x: '6', y: 4 },
                { x: '7', y: 6 },
                { x: '8', y: 9 },
                { x: '9', y: 10 },
                { x: '10', y: 12 },
              ],
              barData: [
                { x: '1', y: 1 },
                { x: '2', y: 12 },
                { x: '3', y: 11 },
                { x: '4', y: 14 },
                { x: '5', y: 11 },
                { x: '6', y: 4 },
                { x: '7', y: 6 },
                { x: '8', y: 9 },
                { x: '9', y: 10 },
                { x: '10', y: 12 },
              ],
            }}
            id={'lineChart-bar'}
            colorList={['#333', '#777']}
            keyList={['라인', '바']}
            // barType={'stack'}
          />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>버블차트</span>
          <Bubble
            data={[
              { key: '1', percent: 10 },
              { key: '2', percent: 20 },
              { key: '3', percent: 30 },
              { key: '4', percent: 25 },
              { key: '5', percent: 10 },
            ]}
            id={'bubble'}
            colorList={['#333', '#777']}
          />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>파이차트</span>
          <PieChart
            data={[
              { key: '1', percent: 10 },
              { key: '2', percent: 20 },
              { key: '3', percent: 30 },
              { key: '4', percent: 25 },
              { key: '5', percent: 10 },
            ]}
            id={'pie'}
            colorSet={['#333333', '#ffffff']}
          />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>트리맵</span>
          <Treemap
            data={[
              { id: '테스트', parent: null, size: null },
              { id: '1', parent: '테스트', size: 1 },
              { id: '2', parent: '테스트', size: 2 },
              { id: '3', parent: '테스트', size: 5 },
              { id: '4', parent: '테스트', size: 4 },
              { id: '5', parent: '테스트', size: 2 },
            ]}
            id={'tree'}
            colorSet={['#333333', '#e3e3e3'].reverse()}
          />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>네트워크</span>
          <NetworkChart
            id={'network'}
            data={{
              nodes: [
                { id: 'x', group: '', value: 10 },
                { id: 'y', group: '', value: 16 },
                { id: 'z', group: '', value: 30 },
                { id: 'a', group: '', value: 20 },
              ],
              links: [
                { source: 'x', target: 'y', value: 5 },
                { source: 'y', target: 'z', value: 15 },
                { source: 'z', target: 'x', value: 50 },
                { source: 'a', target: 'y', value: 5 },
                { source: 'a', target: 'x', value: 15 },
                { source: 'a', target: 'z', value: 35 },
              ],
            }}
          />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>박스플롯</span>
          <BoxPlot
            id={'box'}
            data={[
              {
                x: 'x',
                qt1: 10,
                qt3: 30,
                media: 12,
                avg: 12,
                min: 5,
                max: 40,
                count: 10,
              },
              {
                x: 'y',
                qt1: 20,
                qt3: 30,
                media: 12,
                avg: 17,
                min: 15,
                max: 70,
                count: 10,
              },
              {
                x: 'z',
                qt1: 13,
                qt3: 30,
                media: 12,
                avg: 16,
                min: 12,
                max: 50,
                count: 10,
              },
              {
                x: 'a',
                qt1: 10,
                qt3: 30,
                media: 12,
                avg: 12,
                min: 5,
                max: 40,
                count: 10,
              },
            ]}
          />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>레이다 차트</span>
          <RadarChart
            id={'radar'}
            data={[
              {
                key: 'x',
                data: [
                  { x: 'a', y: 3 },
                  { x: 'b', y: 6 },
                  { x: 'c', y: 8 },
                  { x: 'd', y: 4 },
                  { x: 'e', y: 5 },
                ],
              },
              {
                key: 'y',
                data: [
                  { x: 'a', y: 12 },
                  { x: 'b', y: 14 },
                  { x: 'c', y: 11 },
                  { x: 'd', y: 10 },
                  { x: 'e', y: 12 },
                ],
              },
            ]}
            colorList={['#333', '#888']}
          />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>scatter 차트</span>
          <Scatter
            id={'scatter'}
            data={[
              { x: '1', y: 1, y2: 12 },
              { x: '2', y: 12, y2: 13 },
              { x: '3', y: 11, y2: 1 },
              { x: '4', y: 14, y2: 2 },
              { x: '5', y: 11, y2: 4 },
              { x: '6', y: 4, y2: 6 },
              { x: '7', y: 6, y2: 12 },
              { x: '8', y: 9, y2: 2 },
              { x: '9', y: 10, y2: 7 },
              { x: '10', y: 12, y2: 12 },
            ]}
            colorList={['#333', '#888']}
            xType={'band'}
          />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <span className={'text-sm'}>모자이크 차트</span>
          <Mosaic
            id={'mosaic'}
            data={[
              { x: 'a', y: 'x', value: 30 },
              { x: 'a', y: 'y', value: 12 },
              { x: 'a', y: 'z', value: 14 },
              { x: 'a', y: 't', value: 22 },
              { x: 'b', y: 'x', value: 12 },
              { x: 'b', y: 'y', value: 13 },
              { x: 'b', y: 'z', value: 1 },
              { x: 'b', y: 't', value: 2 },
              { x: 'c', y: 'x', value: 12 },
              { x: 'c', y: 'y', value: 13 },
              { x: 'c', y: 'z', value: 1 },
              { x: 'c', y: 't', value: 2 },
              { x: 'd', y: 'x', value: 12 },
              { x: 'd', y: 'y', value: 13 },
              { x: 'd', y: 'z', value: 1 },
              { x: 'd', y: 't', value: 2 },
            ]}
            colorList={['#000', '#333', '#aaa', '#eee']}
            // xType={'band'}
          />
        </div>
      </div>
      <Head>
        <title>차트 리스트</title>
      </Head>
    </div>
  );
};

export default Home;
