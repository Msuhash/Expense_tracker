import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useSelector } from 'react-redux'
import { MdDoubleArrow } from "react-icons/md";
import { HiMiniCurrencyRupee } from "react-icons/hi2";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { GiProgression } from "react-icons/gi";
import { FaSortAmountUpAlt } from "react-icons/fa";
import { FaSortAmountDown } from "react-icons/fa";

const Cards = () => {
    const { summary } = useSelector((state) => state.analytics);
    console.log("summary", summary);
    return (
        <div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                <Card className='bg-black border-l-8 border-l-lime-600 border-y-gray-800 border-r-gray-800 transition-all duration-300 ease-in-out hover:scale-105'>
                    <CardHeader>
                        <CardTitle className='text-lime-600 font-bold text-lg flex items-center justify-between'>Total Income <FaSortAmountUpAlt size={25} /></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-lime-600 flex items-center gap-2'><HiMiniCurrencyRupee size={25} /> {summary?.totalIncome ?? 0}</p>
                    </CardContent>
                </Card>
                <Card className='bg-black border-l-8 border-l-red-600 border-y-gray-800 border-r-gray-800 transition-all duration-300 ease-in-out hover:scale-105'>
                    <CardHeader>
                        <CardTitle className='text-red-600 font-bold text-lg flex items-center justify-between'>Total Expense <FaSortAmountDown size={25} /></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-red-600 flex items-center gap-2'><HiMiniCurrencyRupee size={25} /> {summary?.totalExpense ?? 0}</p>
                    </CardContent>
                </Card>
                <Card className='bg-black border-l-8 border-l-lime-600 border-y-gray-800 border-r-gray-800 transition-all duration-300 ease-in-out hover:scale-105'>
                    <CardHeader>
                        <CardTitle className='text-lime-600 font-bold text-lg flex items-center justify-between'>Net Amount <GiProgression size={25} /></CardTitle>
                    </CardHeader>
                    <CardContent className='flex items-center gap-2'>
                        <p className='text-lime-600 flex items-center gap-2'><HiMiniCurrencyRupee size={25} /> {summary?.net ?? 0} <MdDoubleArrow /></p>
                        <p className='text-lime-600 text-sm'>{summary?.profitPercentage ?? 0}% Profit</p>
                    </CardContent>
                </Card>
                <Card className='bg-black border-l-8 border-l-yellow-600 border-y-gray-800 border-r-gray-800 transition-all duration-300 ease-in-out hover:scale-105'>
                    <CardHeader>
                        <CardTitle className='text-yellow-600 font-bold text-lg flex items-center justify-between'>
                            Top Categories
                            <BiSolidCategoryAlt size={25} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col items-start justify-start gap-2'>
                        <p className='text-yellow-600'>Income: {summary?.topIncomeCategory?.category ?? 'N/A'}</p>
                        <p className='text-yellow-600'>Expense: {summary?.topExpenseCategory?.category ?? 'N/A'}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Cards