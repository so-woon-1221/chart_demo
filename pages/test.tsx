import { useCallback, MouseEvent, useState } from 'react';

const Test = () => {
  const onClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    setContainerClicked(true);
    e.stopPropagation();
    // const target = e.target as HTMLDivElement;
    // target.style.padding = '0';
    // target.style.position = 'fixed';
    // target.style.top = '0';
    // target.style.left = '0';
    // target.style.width = '100vw';
    // target.style.height = '100vh';
  }, []);

  const [isContainerClicked, setContainerClicked] = useState(false);

  return (
    <div className={'p-10'}>
      <div
        className={`bg-slate-500 ${
          isContainerClicked
            ? 'fixed top-0 left-0 w-screen h-screen transition-all'
            : 'p-4 relative w-[150px] h-[80px]'
        }`}
        onClick={onClick}
      >
        클릭
        <span
          className={`${
            isContainerClicked ? 'absolute top-10 right-10' : 'hidden'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setContainerClicked(false);
          }}
        >
          닫기
        </span>
      </div>
    </div>
  );
};

export default Test;
