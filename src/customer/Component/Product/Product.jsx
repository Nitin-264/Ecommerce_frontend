'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';

import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  ChevronDownIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';

import ProductCard from './ProductCard';
import { filters, singlefilter } from './FilterData';

import {
  Pagination,
} from '@mui/material';

import FilterListIcon from '@mui/icons-material/FilterList';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { findProducts } from '../../../State/Product/Action';

const sortOptions = [
  { name: 'Price: Low to High', value: 'price_low' },
  { name: 'Price: High to Low', value: 'price_high' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ ROUTE PARAMS (IMPORTANT)
  const { category, section, item } = useParams();

  const customerproduct = useSelector((store) => store.customerproduct);

  // ✅ QUERY PARAMS
  const searchParams = new URLSearchParams(location.search);

  const colorValue = searchParams.get('color');
  const sizeValue = searchParams.get('size');
  const priceValue = searchParams.get('price');
  const discount = searchParams.get('discount');
  const sortValue = searchParams.get('sort');
  const pageNumber = Number(searchParams.get('page')) || 1;
  const stock = searchParams.get('stock');

  // ✅ PAGINATION
  const handlePaginationChange = (event, value) => {
    const params = new URLSearchParams(location.search);
    params.set('page', value);
    navigate({ search: `?${params.toString()}` });
  };

  // ✅ MULTI SELECT FILTER
  const handleFilter = (value, sectionId) => {
    const params = new URLSearchParams(location.search);
    const existing = params.get(sectionId)?.split(',') || [];

    let updated;
    if (existing.includes(value)) {
      updated = existing.filter((v) => v !== value);
    } else {
      updated = [...existing, value];
    }

    if (updated.length === 0) {
      params.delete(sectionId);
    } else {
      params.set(sectionId, updated.join(','));
    }

    navigate({ search: `?${params.toString()}` });
  };

  // ✅ RADIO FILTER
  const handleRadioFilterChange = (value, sectionId) => {
    const params = new URLSearchParams(location.search);
    const existingValue = params.get(sectionId);

    if (existingValue === value) {
      params.delete(sectionId);
    } else {
      params.set(sectionId, value);
    }

    navigate({ search: `?${params.toString()}` });
  };

  //✅ MAIN DATA FETCH (MOST IMPORTANT FIX)
  useEffect(() => {
    console.log("🔥 FETCHING PRODUCTS FOR:", item);
    const [minPrice, maxPrice] =
      priceValue == null
        ? [0, 10000]
        : priceValue.split('-').map(Number);

    const data = {
      category: item, // ✅ FINAL CATEGORY
      color: colorValue ? colorValue.split(',') : [],
      size: sizeValue ? sizeValue.split(',') : [],
      minPrice,
      maxPrice,
      minDiscount: discount || 0,
      sort: sortValue || 'price_low',
      pageNumber: pageNumber - 1,
      pageSize: 8,
      stock: stock || 'in_stock',
    };

    dispatch(findProducts(data));
  }, [
    item,
    colorValue,
    sizeValue,
    priceValue,
    discount,
    sortValue,
    pageNumber,
    stock,
    dispatch,
  ]);

// useEffect(() => {
//   console.log("🔥 FETCHING PRODUCTS FOR:", item);

//   dispatch(findProducts({
//     category: item,
//     pageNumber: 0,
//     pageSize: 8
//   }));
// }, [item, dispatch]);

  return (
    <div className="bg-white">
      {/* MOBILE FILTER */}
      <Dialog
        open={mobileFiltersOpen}
        onClose={setMobileFiltersOpen}
        className="relative z-40 lg:hidden"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel className="w-full max-w-xs p-4 ml-auto bg-white shadow-xl">
            <div className="flex justify-between">
              <h2 className="text-lg font-medium">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <main className="px-4 mx-auto sm:px-6 lg:px-20">
        <div className="flex items-baseline justify-between pt-8 pb-6 border-b">
          <h1 className="text-4xl font-bold text-gray-900 capitalize">
            {item?.replace('_', ' ')}
          </h1>

          <Menu as="div" className="relative">
            <MenuButton className="flex items-center text-sm font-medium">
              Sort
              <ChevronDownIcon className="w-5 h-5 ml-1" />
            </MenuButton>

            <MenuItems className="absolute right-0 z-10 w-40 mt-2 bg-white rounded-md shadow">
              {sortOptions.map((option) => (
                <MenuItem key={option.value}>
                  <button
                    onClick={() => handleRadioFilterChange(
                      option.value,
                      'sort'
                    )}
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                  >
                    {option.name}
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>

        <section className="grid grid-cols-1 gap-8 pt-6 pb-24 lg:grid-cols-5">
          {/* FILTERS */}
          <div className="hidden lg:block">
            <h2 className="flex items-center gap-2 font-semibold opacity-60">
              Filters <FilterListIcon />
            </h2>

            {filters.map((section) => (
              <Disclosure key={section.id} as="div" className="py-6 border-b">
                <DisclosureButton className="flex justify-between w-full">
                  <span>{section.name}</span>
                  <PlusIcon className="w-5 h-5" />
                </DisclosureButton>
                <DisclosurePanel className="mt-4 space-y-3">
                  {section.options.map((option) => (
                    <label key={option.value} className="flex gap-2">
                      <input
                        type="checkbox"
                        checked={
                          (searchParams.get(section.id)?.split(',') || []).includes(
                            option.value
                          )
                        }
                        onChange={() =>
                          handleFilter(option.value, section.id)
                        }
                      />
                      {option.label}
                    </label>
                  ))}
                </DisclosurePanel>
              </Disclosure>
            ))}

            {singlefilter.map((section) => (
              <Disclosure key={section.id} as="div" className="py-6 border-b">
                <DisclosureButton className="flex justify-between w-full">
                  <span>{section.name}</span>
                  <PlusIcon className="w-5 h-5" />
                </DisclosureButton>
                <DisclosurePanel className="mt-4 space-y-3">
                  {section.options.map((option) => (
                    <label key={option.value} className="flex gap-2">
                      <input
                        type="radio"
                        name={section.id}
                        checked={searchParams.get(section.id) === option.value}
                        readOnly
                        onClick={() => handleRadioFilterChange(option.value, section.id)}
                        value={option.value}
                      />
                      {option.label}
                    </label>
                  ))}
                </DisclosurePanel>
              </Disclosure>
            ))}
          </div>

          {/* PRODUCTS */}
          <div className="flex flex-wrap justify-center gap-6 lg:col-span-4">
            {customerproduct.products?.content?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <div className="flex justify-center pb-10">
          <Pagination
            count={customerproduct.products?.totalPages || 1}
            page={pageNumber}
            onChange={handlePaginationChange}
          />
        </div>
      </main>
    </div>
  );
}
