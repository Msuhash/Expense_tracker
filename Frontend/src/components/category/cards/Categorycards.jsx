import React from 'react'
import { useSelector } from 'react-redux'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MdDoubleArrow } from "react-icons/md";
import { MdCategory } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { TbRadioactiveFilled } from "react-icons/tb";
import { MdOutlineIncompleteCircle } from "react-icons/md";

const Categorycards = () => {
  const { categories, incomeCategories, expenseCategories } = useSelector((state) => state.category);
  const { summary } = useSelector((state) => state.budget);

  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='bg-black border-yellow-600 transition-all duration-300 ease-in-out hover:scale-105'>
          <CardHeader>
            <CardTitle className='text-yellow-600 font-bold text-lg flex items-center justify-between'>Total Categories<MdCategory /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex item-center justify-start gap-3'>
              <p className='text-yellow-600 text-sm flex items-center gap-2'>{categories?.length ?? 0}<MdDoubleArrow /></p>
              <p className='text-emerald-600 text-sm'>Income: {incomeCategories?.length ?? 0}</p>
              <p className='text-red-600 text-sm'>Expense: {expenseCategories?.length ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-black border-yellow-600 transition-all duration-300 ease-in-out hover:scale-105'>
          <CardHeader>
            <CardTitle className='text-yellow-600 font-bold text-lg flex items-center justify-between'>Total Budget<FaSackDollar /></CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-yellow-600'>₹{summary?.totalBudget ?? 0}</p>
          </CardContent>
        </Card>
        <Card className='bg-black border-yellow-600 transition-all duration-300 ease-in-out hover:scale-105'>
          <CardHeader>
            <CardTitle className='text-yellow-600 font-bold text-lg flex items-center justify-between'>Active Budget<TbRadioactiveFilled /></CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-yellow-600'>{summary?.activeBudget ?? 0}</p>
          </CardContent>
        </Card>
        <Card className='bg-black border-yellow-600 transition-all duration-300 ease-in-out hover:scale-105'>
          <CardHeader>
            <CardTitle className='text-yellow-600 font-bold text-lg flex items-center justify-between'>Budget Completed<MdOutlineIncompleteCircle /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex item-center justify-start gap-3'>
              <p className='text-yellow-600 text-sm flex items-center gap-2'>{summary?.completedBudget ?? 0}<MdDoubleArrow /></p>
              <p className='text-emerald-600 text-sm'>Succeed: {summary?.budgetSucceed ?? 0}</p>
              <p className='text-red-600 text-sm'>Failed: {summary?.budgetFailed ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Categorycards