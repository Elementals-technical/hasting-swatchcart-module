import { SwatchesList } from '../SwatchesList/SwatchesList';
import { useAppSelector } from '../../../../app/store/store';
import { getSelectedMaterials } from '../../model/selectors';

export const SwatchesListWrapper = () => {
  const selectedMaterials = useAppSelector(getSelectedMaterials) ?? [];

  return <SwatchesList selectedMaterials={selectedMaterials} />;
};
