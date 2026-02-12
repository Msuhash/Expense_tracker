import React, { useEffect, useState } from 'react'
import { TbCategoryPlus } from "react-icons/tb";
import Categorycards from '../../components/category/cards/Categorycards';
import { fetchCategories } from '@/store/slices/categorySlice';
import { fetchBudget, fetchSummary } from '@/store/slices/budgetSlice';
import { fetchCategoryDistribution } from '@/store/slices/analyticsSlice';
import { useSelector, useDispatch } from 'react-redux';
import CategoryTabs from '../../components/category/cards/CategoryTabs';
import Addcategory from '../../components/category/forms/Addcategory';
import AddBudget from '../../components/category/forms/AddBudget';

const Category = () => {
  const dispatch = useDispatch();
  const { budget } = useSelector((state) => state.budget);
  const { categories } = useSelector((state) => state.category);
  const { loading, error } = useSelector((state) => state.category);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBudget());
    dispatch(fetchSummary());
    dispatch(fetchCategoryDistribution());
  }, []);

  return (
    <div className='bg-black text-amber-600 w-full h-full p-6'>
      <div className='flex items-center justify-start gap-3'>
        <TbCategoryPlus size={35} />
        <h6 className='font-bold text-xl md:text-2xl'>category & Budget Maintainence</h6>
      </div>

      <div className='mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <p className='text-amber-700 text-sm md:text-base'>Manage your categories and budgets</p>

        <div className='grid grid-cols-2 gap-2 w-full md:w-auto'>
          <button className='btn btn-warning transition-all duration-300 ease-in-out hover:scale-105 text-sm' onClick={() => setIsCategoryOpen(true)}>
            <p>Add Category</p>
          </button>

          <button className='btn btn-warning transition-all duration-300 ease-in-out hover:scale-105 text-sm' onClick={() => setIsBudgetOpen(true)}>
            <p>Add Budget</p>
          </button>
        </div>
      </div>

      <div className='mt-6'>
        <Categorycards />
      </div>

      <div>
        <CategoryTabs />
      </div>

      <Addcategory isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)} />
      <AddBudget isOpen={isBudgetOpen} onClose={() => setIsBudgetOpen(false)} />
    </div>
  )
}

export default Category
