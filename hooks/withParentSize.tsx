import { ParentSize } from '@visx/responsive';
import React from 'react';

interface ChartProps {
  data: any;
  id: string;
  height?: number | string;
  [key: string]: any;
}

const withParentSize = <P extends ChartProps>(
  ChartComponent: React.ComponentType<P>,
): React.FC<ChartProps> => {
  const Component = (props: ChartProps) => {
    return (
      <div
        className={`shadow-lg w-full bg-[#fafafa] rounded h-[450px] lg:h-full lg:max-h-[700px] lg:min-h-[450px]`}
      >
        <ParentSize>
          {({ width, height }) => {
            const combinedProps = { ...props, width, height };
            return <ChartComponent {...(combinedProps as unknown as P)} />;
          }}
        </ParentSize>
      </div>
    );
  };

  return React.memo(Component);
};

export default withParentSize;
