// import { useAppSelector } from "../../../../app/store/store";
// import { getAllMaterialValues } from "../../model/selectors";

const MOCK_LIST_ARRAY = [
  'Alice Johnson',
  'Ethan Miller',
  'Sofia Lopez',
  'Liam Brown',
  'Emma Davis',
  'Noah Wilson',
  'Olivia Taylor',
  'James Anderson',
  'Ava Thomas',
  'William Garcia',
  'Mia Martinez',
  'Lucas Rodriguez',
  'Charlotte Lee',
  'Benjamin Harris',
  'Amelia Clark',
  'Henry Lewis',
  'Isabella Walker',
  'Alexander Hall',
  'Harper Allen',
  'Michael Young',
  'Sofia Lopez',
  'Liam Brown',
  'Emma Davis',
  'Noah Wilson',
  'Olivia Taylor',
  'James Anderson',
  'Ava Thomas',
  'William Garcia',
  'Mia Martinez',
  'Lucas Rodriguez',
  'Charlotte Lee',
  'Benjamin Harris',
  'Amelia Clark',
  'Henry Lewis',
  'Isabella Walker',
  'Alexander Hall',
  'Harper Allen',
  'Michael Young',
];

export const MaterialList = () => {
  // const allMaterialsValues = useAppSelector(getAllMaterialValues)

  return (
    <div
      className='
    flex-1 min-h-0 overflow-y-auto p-[var(--padding)] 
    sm:p-[var(--sm-padding)]
    '
    >
      <ul
        className='
      grid grid-cols-1 gap-[8px] 
      sm:grid-cols-3
      
      '
      >
        {MOCK_LIST_ARRAY.map((item: string, index: number) => {
          return (
            <li
              key={item + index}
              className='
            w-76 rounded-sm
            sm:w-40
            '
            >
              <div
                className='
              w-76 h-40 rounded bg-blue-500
              sm:w-40 sm:h-40'
              ></div>
              <div className='mt-3'>
                <span className='font-medium'>Name {index}</span>
                <p className='font-semibold'>{item}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
