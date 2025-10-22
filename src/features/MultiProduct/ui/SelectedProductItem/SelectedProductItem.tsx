import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { FiltersSelectedProductItem } from '../FiltersSelectedProductItem/FiltersSelectedProductItem';

interface ISelectedProductItemProps {
  onSidebarToggle: () => void;
}

export const SelectedProductItem = ({
  onSidebarToggle,
}: ISelectedProductItemProps) => {
  return (
    <div className='flex h-full flex-col'>
      <header className='flex items-center justify-between p-[var(--sm-padding)] border-b border-[var(--border)]'>
        <span className='text-base font-medium'>Selected Product</span>
        <button
          onClick={onSidebarToggle}
          className='flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--background-grey)]
                      [&_svg_path]:stroke-[var(--svg-dark)]'
        >
          <CloseIconSVG width={10} height={10} />
        </button>
      </header>
      <div className='flex min-h-0 flex-1 flex-col'>
        <FiltersSelectedProductItem />
        <div className='flex-1 min-h-0 overflow-y-auto p-[var(--sm-padding)]'>
          <ul
            className='
              grid grid-cols-2 gap-4
              sm:grid-cols-6 
                '
          >
            {/* {productList.length
                ? productList?.map((productListItem) => {
                    const { name } = productListItem;
                    return (
                      <ProductListItem
                        key={name}
                        productListItem={productListItem}
                      />
                    );
                  })
                : null} */}
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
            <li>7</li>
            <li>8</li>
            <li>9</li>
            <li>10</li>
            <li>11</li>
            <li>12</li>
            <li>13</li>
            <li>14</li>
            <li>15</li>
            <li>16</li>
            <li>17</li>
            <li>18</li>
            <li>19</li>
            <li>20</li>
            <li>21</li>
            <li>22</li>
            <li>23</li>
            <li>24</li>
            <li>25</li>
            <li>26</li>
            <li>27</li>
            <li>28</li>
            <li>29</li>
            <li>30</li>
            <li>31</li>
            <li>32</li>
            <li>33</li>
            <li>34</li>
            <li>35</li>
            <li>36</li>
            <li>37</li>
            <li>38</li>
            <li>39</li>
            <li>40</li>
            <li>41</li>
            <li>42</li>
            <li>43</li>
            <li>44</li>
            <li>45</li>
            <li>46</li>
            <li>47</li>
            <li>48</li>
            <li>49</li>
            <li>50</li>
            <li>51</li>
            <li>52</li>
            <li>53</li>
            <li>54</li>
            <li>55</li>
            <li>56</li>
            <li>57</li>
            <li>58</li>
            <li>59</li>
            <li>60</li>
            <li>61</li>
            <li>62</li>
            <li>63</li>
            <li>64</li>
            <li>65</li>
            <li>66</li>
            <li>67</li>
            <li>68</li>
            <li>69</li>
            <li>70</li>
            <li>71</li>
            <li>72</li>
            <li>73</li>
            <li>74</li>
            <li>75</li>
            <li>76</li>
            <li>77</li>
            <li>78</li>
            <li>79</li>
            <li>80</li>
            <li>81</li>
            <li>82</li>
            <li>83</li>
            <li>84</li>
            <li>85</li>
            <li>86</li>
            <li>87</li>
            <li>88</li>
            <li>89</li>
            <li>90</li>
            <li>91</li>
            <li>92</li>
            <li>93</li>
            <li>94</li>
            <li>95</li>
            <li>96</li>
            <li>97</li>
            <li>98</li>
            <li>99</li>
            <li>100</li>
          </ul>
        </div>
        <div
          className='flex justify-between items-center gap-4 h-[64px] p-[var(--sm-padding)]
        border-t border-[var(--border)]
        '
        >
          bottom content
        </div>
      </div>
    </div>
  );
};
