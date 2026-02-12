import React, { useEffect, useState } from 'react'
import { SiKibana } from "react-icons/si";
import Cards from '../../components/report & analytics/Cards';
import { fetchSummary, fetchMonthlyComparison, fetchCategoryDistribution, fetchTrend, fetchLineMonthlyComparison, fetchRecentTransaction } from '../../store/slices/analyticsSlice';
import { useDispatch } from 'react-redux';
import BarChart from '../../components/report & analytics/BarChart';
import LineChart from '../../components/report & analytics/LineChart';
import Comparison from '../../components/report & analytics/Comparison';
import ECategoryDistribution from '../../components/report & analytics/ECategoryPieChart';
import ICategoryDistribution from '../../components/report & analytics/ICategoryPieChart';
import ExportDataModal from '../../components/report & analytics/ExportDataModal';
import RecentTransaction from '../../components/report & analytics/RecentTransaction';
import { fetchCategories } from '@/store/slices/categorySlice';
import AddIncomeForm from '@/components/income/forms/AddIncomeForm';
import AddExpenseForm from '@/components/expense/forms/AddExpenseForm';
import AddCategory from '@/components/category/forms/Addcategory';



const Report = () => {
    const dispatch = useDispatch();
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchSummary());
        dispatch(fetchMonthlyComparison());
        dispatch(fetchCategoryDistribution());
        dispatch(fetchTrend());
        dispatch(fetchLineMonthlyComparison());
        dispatch(fetchRecentTransaction())
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className='bg-black text-amber-600 w-full h-full p-6'>
            <div className='flex items-center justify-start gap-3'>
                <SiKibana size={25} />
                <h2 className='text-2xl font-bold'>Dashboard & Analytics</h2>
            </div>

            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4'>
                <p className='text-gray-500 text-sm md:text-base'>Get a Clear Overview of Your Finances</p>
                <div className='grid grid-cols-2 sm:flex items-center justify-center gap-2 w-full md:w-auto'>
                    <button className='btn btn-warning transition-all duration-300 ease-in-out hover:scale-105 text-xs md:text-sm' onClick={() => setIsExportModalOpen(true)}>Export Data</button>
                    <button className="btn btn-warning transition-all duration-300 ease-in-out hover:scale-105 text-xs md:text-sm" onClick={() => setIsIncomeModalOpen(true)}>New Income</button>
                    <button className="btn btn-warning transition-all duration-300 ease-in-out hover:scale-105 text-xs md:text-sm" onClick={() => setIsExpenseModalOpen(true)}>New Expense</button>
                    <button className="btn btn-warning transition-all duration-300 ease-in-out hover:scale-105 text-xs md:text-sm" onClick={() => setIsCategoryModalOpen(true)}>New Category</button>
                </div>
            </div>



            <div className='pt-6'>
                <Cards />
            </div>

            <div className='pt-6'>
                <RecentTransaction />
            </div>

            <div className='pt-6'>
                <BarChart />
            </div>

            <div className='pt-6'>
                <LineChart />
            </div>

            <div className='pt-6'>
                <Comparison />
            </div>

            <div className='flex md:flex-row flex-col items-center justify-center gap-6 pt-6'>
                <ECategoryDistribution />
                <ICategoryDistribution />
            </div>

            <ExportDataModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
            <AddIncomeForm isOpen={isIncomeModalOpen} onClose={() => setIsIncomeModalOpen(false)} />
            <AddExpenseForm isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} />
            <AddCategory isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />


        </div>
    )
}

export default Report