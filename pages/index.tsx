import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import BarChart from '../components/chart/BarChart';
import LineChart from '../components/chart/LineChart';
import HorizontalBarChart from '../components/chart/HorizontalBarChart';
import { MdBubbleChart } from 'react-icons/md';
import Bubble from '../components/chart/Bubble';
import PieChart from '../components/chart/PieChart';
import Treemap from '../components/chart/Treemap';
const LineChartWithBarChart = dynamic(
  () => import('../components/chart/LineChartWithBarChart'),
  { ssr: false },
);

// const ChartContainer = tw.div`
//   border border-zinc-100 shadow rounded
//   h-[400px]
// `;

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
      </div>
    </div>
  );
};

export default Home;
