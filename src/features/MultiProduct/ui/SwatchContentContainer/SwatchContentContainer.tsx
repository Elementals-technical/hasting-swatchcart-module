import { SwatchesList } from '../../../swatches/ui/SwatchesList/SwatchesList';

export const SwatchContentContainer = () => {
  return (
    <div className='flex flex-col gap-4 border-t border-[var(--border)]'>
      <SwatchesList containerStyles='flex flex-col p-[var(--sm-padding)] shrink-0' />
      <div className=''>
        <button>click</button>
      </div>
    </div>
  );
};
