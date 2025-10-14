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
  return (
    <div className='flex-1 min-h-0 overflow-y-auto p-[var(--padding)]'>
      <ul className='grid grid-cols-3 gap-[20px] '>
        {MOCK_LIST_ARRAY.map((item: string, index: number) => {
          return (
            <li key={item + index} className='w-40 rounded-sm'>
              <div className='w-40 h-40 rounded bg-red-500'></div>
              <div className='mt-3'>
                <span className='font-medium'>Name</span>
                <p className='font-semibold'>{item}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
