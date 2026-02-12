import React, { useState } from 'react'
import { FaFilterCircleDollar } from "react-icons/fa6";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { setFilters, resetFilters } from '@/store/slices/expenseSlice';
import { IoMdRefresh } from "react-icons/io";

const ExpenseFilter = () => {
    const dispatch = useDispatch();
    const { expenseCategories } = useSelector((state) => state.category);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [openStart, setOpenStart] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [openEnd, setOpenEnd] = useState(false);
    const [endDate, setEndDate] = useState(null);
    const [resetKey, setResetKey] = useState(0);

    const amountRange = {
        '1-5': { minAmount: 1000, maxAmount: 5000 },
        '5-10': { minAmount: 5000, maxAmount: 10000 },
        '20-30': { minAmount: 20000, maxAmount: 30000 },
        '30-50': { minAmount: 30000, maxAmount: 50000 },
        '50-100': { minAmount: 50000, maxAmount: 100000 },
    };

    const handleReset = () => {
        setSearch('');
        setCategory('');
        setStartDate(null);
        setEndDate(null);
        dispatch(resetFilters());
        setResetKey(prev => prev + 1);
    };

    return (
        <div className='border border-amber-600 p-4 rounded-lg'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                <div className='flex items-center gap-2'>
                    <FaFilterCircleDollar />
                    <h1 className='text-xl font-bold text-amber-600'>Filters</h1>
                </div>

                <div className='w-full md:w-auto'>
                    <button
                        onClick={handleReset}
                        className='flex items-center justify-center gap-2 border border-amber-600 p-2 px-5 hover:bg-gray-900 cursor-pointer rounded-lg w-full md:w-auto'
                    >
                        <IoMdRefresh />
                        <h1 className='text-lg font-medium text-amber-600'>Reset</h1>
                    </button>
                </div>
            </div>

            <p className='text-sm text-amber-900 mt-2 text-center md:text-left'>Filter your expense data here</p>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-5'>
                <label className="input bg-gray-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-800 flex items-center gap-2 w-full">
                    <svg className="h-[1em] opacity-50 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearch(value);
                            dispatch(setFilters({ search: value }))
                        }}
                        required placeholder="Search" className="bg-transparent text-amber-700 placeholder:text-amber-700/50 outline-none w-full" />
                </label>

                <Select
                    key={`category-${resetKey}`}
                    defaultValue='category'
                    onValueChange={(value) => {
                        setCategory(value);
                        dispatch(setFilters({ category: value }))
                    }}
                >
                    <SelectTrigger className="w-full h-10 text-amber-700 hover:text-amber-600 bg-black border-amber-800 focus:ring-amber-800 focus:ring-2">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-amber-700 border-2 border-amber-800">
                        <SelectItem value="category" disabled className="text-amber-600">category</SelectItem>
                        {expenseCategories && expenseCategories.length > 0 ? (
                            expenseCategories.map((category) => (
                                <SelectItem key={category._id} value={category.name} className="focus:bg-amber-800">{category.name}</SelectItem>
                            ))
                        ) : (
                            <SelectItem value="none" disabled className="text-gray-500">No categories found</SelectItem>
                        )}
                    </SelectContent>
                </Select>

                <Select
                    key={`amount-${resetKey}`}
                    defaultValue='select amount'
                    onValueChange={(value) => {
                        const range = amountRange[value];
                        dispatch(setFilters({ minAmount: range.minAmount, maxAmount: range.maxAmount }))
                    }}
                >
                    <SelectTrigger className="w-full h-10 text-amber-700 hover:text-amber-600 bg-black border-amber-800 focus:ring-amber-800 focus:ring-2">
                        <SelectValue placeholder="select amount" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-amber-700 border-2 border-amber-800">
                        <SelectItem value="select amount" disabled className="text-amber-600">select amount</SelectItem>
                        <SelectItem value="1-5" className="focus:bg-amber-800">1k - 5k</SelectItem>
                        <SelectItem value="5-10" className="focus:bg-amber-800">5k - 10k</SelectItem>
                        <SelectItem value="20-30" className="focus:bg-amber-800">20k - 30k</SelectItem>
                        <SelectItem value="30-50" className="focus:bg-amber-800">30k - 50k</SelectItem>
                        <SelectItem value="50-100" className="focus:bg-amber-800">50k - 100k</SelectItem>
                    </SelectContent>
                </Select>

                <div>
                    <Popover open={openStart} onOpenChange={setOpenStart}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="start-date"
                                className="w-full h-10 bg-black border-amber-800 text-amber-700 hover:bg-amber-800/10 hover:text-amber-600 justify-between font-normal"
                            >
                                <CalendarIcon className="h-4 w-4" />
                                {startDate ? startDate.toLocaleDateString() : "Start date"}
                                <ChevronDownIcon className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 overflow-hidden bg-black border-2 border-amber-800" align="start">
                            <Calendar
                                mode="single"
                                selected={startDate}
                                className="bg-black text-amber-700 rounded-md w-[250px]"
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    setStartDate(date)
                                    setOpenStart(false)
                                    dispatch(setFilters({ startDate: date ? date.toISOString() : "" }))
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div>
                    <Popover open={openEnd} onOpenChange={setOpenEnd}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="end-date"
                                className="w-full h-10 bg-black border-amber-800 text-amber-700 hover:bg-amber-800/10 hover:text-amber-600 justify-between font-normal"
                            >
                                <CalendarIcon className="h-4 w-4" />
                                {endDate ? endDate.toLocaleDateString() : "End date"}
                                <ChevronDownIcon className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 overflow-hidden bg-black border-2 border-amber-800" align="start">
                            <Calendar
                                mode="single"
                                selected={endDate}
                                className="bg-black text-amber-700 rounded-md w-[250px]"
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    setEndDate(date)
                                    setOpenEnd(false)
                                    dispatch(setFilters({ endDate: date ? date.toISOString() : "" }))
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    )
}

export default ExpenseFilter