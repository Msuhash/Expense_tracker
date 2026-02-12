import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchIncome, fetchGraphIncome } from '../../store/slices/incomeSlice'
import IncomePieChart from '../../components/income/charts/IncomePieChart'
import IncomeLineChart from '../../components/income/charts/IncomeLineChart'
import { FaTableList } from "react-icons/fa6";
import IncomeTable from '../../components/income/table/IncomeTable'
import AddIncomeForm from '../../components/income/forms/AddIncomeForm'
import { fetchCategories } from '../../store/slices/categorySlice'

const Income = () => {
  const dispatch = useDispatch();
  const { filters, pagination, loading, error } = useSelector((state) => state.income);
  const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = React.useState(false);

  useEffect(() => {
    // Fetch income data when component mounts
    // Increase limit to 1000 for analytics to get all data points for the chart
    dispatch(fetchIncome({
      ...filters,
      page: 1,
    }));
  }, [dispatch, filters]);

  useEffect(() => {
    // Fetch distinct data for charts (unfiltered or global)
    dispatch(fetchGraphIncome());
    dispatch(fetchCategories());
  }, [dispatch]);

  console.log("filters", filters);

  return (
    <div className='bg-black text-amber-600 w-full h-full p-4 md:p-6'>
      <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
        <h1 className='text-xl font-bold text-amber-600'>Income - Quick Analytics</h1>
        {/* {loading && <div className='flex justify-center items-center w-full'>
          <FourSquare color="#ffea00" size="medium" text="Please Wait!" textColor="" />
        </div>} */}
      </div>

      {error && (
        <div className='bg-red-900/20 border border-red-500 text-red-500 p-4 rounded-lg mb-6'>
          Error: {error}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <IncomePieChart />
        <IncomeLineChart />
      </div>

      <div className='mt-6'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
          <div className='flex items-center gap-2'>
            <FaTableList />
            <h1 className='text-xl font-bold text-amber-600'>Income</h1>
          </div>

          <div className='w-full md:w-auto flex justify-end'>
            <button
              className="btn btn-warning w-full md:w-auto"
              onClick={() => setIsAddIncomeModalOpen(true)}
            >
              New Income
            </button>
          </div>
        </div>
      </div>

      <div className='mt-6'>
        <IncomeTable />
      </div>


      <AddIncomeForm
        isOpen={isAddIncomeModalOpen}
        onClose={() => setIsAddIncomeModalOpen(false)}
      />
    </div >
  )
}

export default Income
