import { ParentSize } from '@visx/responsive';
import { ComponentType } from 'react';

interface Props {
  data: any;
  id: string;
  height?: number;
  [key: string]: any;
}

const withParentSize = <P extends Props>(
  ChartComponent: ComponentType<P>,
): ComponentType<P> => {
  const Component = (props: Props) => {
    return (
      <div
        className={`shadow-lg w-full bg-[#fafafa] rounded relative ${
          props.height
            ? ''
            : 'h-[450px] lg:h-full lg:max-h-[700px] lg:min-h-[450px]'
        }`}
        style={{ height: props.height ? `${props.height}px` : `` }}
      >
        <ParentSize>
          {({ width, height }) => {
            const combinedProps = props.height
              ? { ...props, width }
              : { ...props, width, height };
            return <ChartComponent {...(combinedProps as unknown as P)} />;
          }}
        </ParentSize>
      </div>
    );
  };

  return Component;
};

export default withParentSize;
