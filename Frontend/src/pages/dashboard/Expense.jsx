import React, { useEffect } from 'react'
import ExpenseLineChart from '../../components/expense/charts/ExpenseLineChart'
import ExpensePieChart from '../../components/expense/charts/ExpensePieChart'
import { useDispatch, useSelector } from 'react-redux'
import { fetchExpenses, fetchGraphExpenses } from '../../store/slices/expenseSlice'
import { FaTableList } from "react-icons/fa6";
import ExpenseTable from '../../components/expense/table/ExpenseTable'
import AddExpenseForm from '../../components/expense/forms/AddExpenseForm'
import { fetchCategories } from '../../store/slices/categorySlice'


const Expense = () => {
  const dispatch = useDispatch();
  const { filters, pagination, loading, error } = useSelector((state) => state.expense);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = React.useState(false);

  useEffect(() => {
    // Fetch expense data when component mounts
    // Increase limit to 1000 for analytics to get all data points for the chart
    dispatch(fetchExpenses({
      ...filters,
      page: 1,
    }));
  }, [dispatch, filters]);

  useEffect(() => {
    // Fetch distinct data for charts (unfiltered or global)
    dispatch(fetchGraphExpenses());
    dispatch(fetchCategories());
  }, [dispatch]);

  console.log("filters", filters);

  return (
    <div className='bg-black text-amber-600 w-full h-full p-4 md:p-6'>
      <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
        <h1 className='text-xl font-bold text-amber-600'>Expense - Quick Analytics</h1>
      </div>

      {error && (
        <div className='bg-red-900/20 border border-red-500 text-red-500 p-4 rounded-lg mb-6'>
          Error: {error}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <ExpensePieChart />
        <ExpenseLineChart />
      </div>

      <div className='mt-6'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
          <div className='flex items-center gap-2'>
            <FaTableList />
            <h1 className='text-xl font-bold text-amber-600'>Expense</h1>
          </div>

          <div className='w-full md:w-auto flex justify-end'>
            <button
              className="btn btn-warning w-full md:w-auto"
              onClick={() => setIsAddExpenseModalOpen(true)}
            >
              New Expense
            </button>
          </div>
        </div>
      </div>

      <div className='mt-6'>
        <ExpenseTable />
      </div>


      <AddExpenseForm
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
      />
    </div>
  )
}

export default Expense
