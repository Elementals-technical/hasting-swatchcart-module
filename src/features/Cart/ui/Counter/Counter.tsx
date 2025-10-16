import { MinusIconSVG } from '../../../../app/assets/svg/MinusIconSVG';
import { PlusIconSVG } from '../../../../app/assets/svg/PlusIconSVG';
import { TrashIconSVG } from '../../../../app/assets/svg/TrashIconSVG';

interface ICounterProps {
  value: number;
  canIncrement: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onDelete: () => void;
}

export const Counter = ({
  value,
  canIncrement,
  onIncrement,
  onDecrement,
  onDelete,
}: ICounterProps) => {
  const showTrash = value <= 1;
  return (
    <div className='flex items-center gap-2 text-sm'>
      {showTrash ? (
        <button
          aria-label='Remove item'
          onClick={onDelete}
          className='[&_svg_path]:stroke-[var(--main-accent-color)]'
        >
          <TrashIconSVG />
        </button>
      ) : (
        <button
          aria-label='Decrease'
          onClick={onDecrement}
          className='[&_svg_path]:stroke-[var(--svg-dark)]'
        >
          <MinusIconSVG />
        </button>
      )}
      <span className='min-w-4 text-center select-none'>{value}</span>
      <button
        aria-label='Increase'
        onClick={onIncrement}
        disabled={!canIncrement}
        className='[&_svg_path]:stroke-[var(--svg-dark)] disabled:opacity-40'
      >
        <PlusIconSVG />
      </button>
    </div>
  );
};
