import React, { useState } from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
    CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSelector, useDispatch } from 'react-redux';
import { Badge } from '@/components/ui/badge';
import { FaArrowTrendUp } from "react-icons/fa6";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { deleteCategory } from '@/store/slices/categorySlice';
import { HiArrowTrendingDown } from "react-icons/hi2";
import { Progress } from '@/components/ui/progress';
import { Calendar } from 'lucide-react';
import { SiProgress } from "react-icons/si";
import AddBudget from '../forms/AddBudget';
import UpdateBudget from '../forms/UpdateBudget';
import DeleteBudget from '../forms/DeleteBudget';
import DeleteCategory from '../forms/DeleteCategory';

const CategoryTabs = () => {
    const dispatch = useDispatch();
    const { incomeCategories, expenseCategories } = useSelector((state) => state.category);
    const { budget } = useSelector((state) => state.budget);
    const { categoryDistribution } = useSelector((state) => state.analytics);

    const [budgetData, setBudgetData] = useState(null)
    const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
    const [isUpdateBudgetOpen, setIsUpdateBudgetOpen] = useState(false);

    const [deleteBudgetId, setDeleteBudgetId] = useState(null);
    const [isDeleteBudgetOpen, setIsDeleteBudgetOpen] = useState(false);

    const [deleteCategory, setDeleteCategory] = useState(null);
    const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);

    const handleEdit = (budget) => {
        setBudgetData(budget);
        setIsUpdateBudgetOpen(true);
    }

    const handleCloseAddBudget = () => {
        setIsAddBudgetOpen(false);
    }

    const handleCloseUpdateBudget = () => {
        setBudgetData(null);
        setIsUpdateBudgetOpen(false);
    }

    const handleDelete = (budgetId) => {
        setDeleteBudgetId(budgetId);
        setIsDeleteBudgetOpen(true);
    }

    const handleCloseDeleteBudget = () => {
        setDeleteBudgetId(null);
        setIsDeleteBudgetOpen(false);
    }

    const handleDeleteCategory = (category) => {
        setDeleteCategory(category);
        setIsDeleteCategoryOpen(true);
    }

    const handleCloseDeleteCategory = () => {
        setDeleteCategory(null);
        setIsDeleteCategoryOpen(false);
    }

    return (
        <div className='flex flex-col justify-between items-center w-full'>
            <Tabs defaultValue="Expense" className="w-full mt-7">
                <TabsList className='bg-black border border-amber-600 w-full sm:w-auto'>
                    <TabsTrigger value="Expense">Expense</TabsTrigger>
                    <TabsTrigger value="Income">Income</TabsTrigger>
                    <TabsTrigger value="Budget">Budget</TabsTrigger>
                </TabsList>
                <TabsContent value="Expense">
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
                        {expenseCategories.map((category) => (
                            <Card key={category._id} className='bg-black border-l-8 border-gray-800 transition-all duration-300 ease-in-out hover:scale-105' style={{ borderLeftColor: category.color }}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <h1 className='text-xl'>{category.icon}</h1>
                                        <div className='w-full'>
                                            <h1 style={{ color: category.color }}>{category.name}</h1>
                                            <Badge variant="outline" className='bg-gray-800 border-gray-800 mt-2' style={{ color: category.color }}>
                                                <div className='flex items-center gap-2'>
                                                    <HiArrowTrendingDown />{category.type}
                                                </div>
                                            </Badge>
                                        </div>
                                        <div className='flex items-center justify-end w-full'>
                                            {category.isDefault ? null : (
                                                <button className='text-red-500 hover:bg-red-900 cursor-pointer p-2 rounded-lg' onClick={() => handleDeleteCategory(category)}><RiDeleteBin5Fill size={20} /></button>
                                            )}
                                        </div>
                                    </CardTitle>
                                    {category.description ? (
                                        <CardDescription>
                                            <p className='font-bold font-sans text-gray-500 mt-3'>{category.description}</p>
                                        </CardDescription>
                                    ) : null}
                                </CardHeader>
                                <CardContent>
                                    {(() => {
                                        const categoryBudget = budget.find(b => b.category.toLowerCase() === category.name.toLowerCase());
                                        const percentage = categoryBudget ? (categoryBudget.amount / categoryBudget.limit) * 100 : 0;
                                        const amountSpent = categoryDistribution?.expenseCategories?.find(item => item.category === category.name)?.amount || 0
                                        return categoryBudget ? (
                                            <div className='space-y-3 w-full'>
                                                <div className='flex items-center justify-between text-sm'>
                                                    <p className='text-sm font-bold font-sans' style={{ color: category.color }}>Amount Spent: {amountSpent}</p>
                                                    {categoryBudget.endDate > new Date().toISOString() ? (
                                                        <Badge variant="outline" className={percentage <= 65 ? "bg-green-500 border-none" : percentage > 65 && percentage <= 80 ? "bg-yellow-500 border-none" : "bg-red-500 border-none"}>{categoryBudget.limit > categoryBudget.amount ? "Under Budget - Active" : categoryBudget.limit === categoryBudget.amount ? "On Budget - Active" : "Over Budget - Active"}</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className={categoryBudget.amount > categoryBudget.limit ? "bg-red-500 border-none" : "bg-green-500 border-none"}>
                                                            {categoryBudget.amount > categoryBudget.limit ? "Budget Failed" : "Budget Succeeded"}
                                                        </Badge>
                                                    )}

                                                </div>
                                                <div className='flex items-center justify-between text-sm'>
                                                    <span style={{ color: category.color }}>Budget</span>
                                                    <span className='text-gray-500'>
                                                        {categoryBudget.amount.toFixed(2)} / {categoryBudget.limit.toFixed(2)}
                                                    </span>
                                                </div>
                                                <Progress value={Math.min(percentage, 100)} className={percentage <= 65 ? '[&>*]:bg-green-500 mt-2 bg-gray-800' : percentage <= 80 ? '[&>*]:bg-yellow-500 mt-2 bg-gray-800' : '[&>*]:bg-red-500 mt-2 bg-gray-800'} />
                                                <div className='flex items-center justify-between text-xs'>
                                                    <div className='flex items-center gap-1 text-gray-500'>
                                                        <Calendar className='h-3 w-3'
                                                        />
                                                        {new Date(categoryBudget.startDate).toLocaleDateString()} - {new Date(categoryBudget.endDate).toLocaleDateString()}
                                                    </div>
                                                    <span className={percentage <= 65 ? 'text-green-500' : percentage > 65 && percentage <= 80 ? 'text-yellow-500' : 'text-red-500'}>
                                                        {Math.min(percentage, 100).toFixed(2)}%
                                                    </span>
                                                </div>
                                                <div className='flex items-center justify-between gap-3 mt-6'>
                                                    {(categoryBudget.endDate < new Date().toISOString()) || categoryBudget.limit < categoryBudget.amount ? (
                                                        null
                                                    ) : (
                                                        <>
                                                            <Button className="bg-gray-800 hover:bg-gray-700 w-full" onClick={() => handleEdit(categoryBudget)}>Edit Budget</Button>
                                                            <Button className="bg-red-800 hover:bg-red-700 w-full" onClick={() => handleDelete(categoryBudget._id)}>Delete Budget</Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className='text-sm font-bold font-sans' style={{ color: category.color }}>Amount Spent: {categoryDistribution?.expenseCategories?.find(item => item.category === category.name)?.amount || 0}</p>
                                                <Button className='w-full bg-amber-600 text-black hover:bg-amber-700 mt-6' onClick={() => setIsAddBudgetOpen(true)}>Set Budget</Button>
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="Income">
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
                        {incomeCategories.map((category) => (
                            <Card key={category._id} className='bg-black border-l-8 border-gray-800 transition-all duration-300 ease-in-out hover:scale-105' style={{ borderLeftColor: category.color }}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <h1 className='text-xl'>{category.icon}</h1>
                                        <div className='w-full'>
                                            <h1 style={{ color: category.color }}>{category.name}</h1>
                                            <Badge variant="outline" className='bg-gray-800 border-gray-800 mt-2' style={{ color: category.color }}>
                                                <div className='flex items-center gap-2'>
                                                    <FaArrowTrendUp />{category.type}
                                                </div>
                                            </Badge>
                                        </div>
                                        <div className='flex items-center justify-end w-full'>
                                            {category.isDefault ? null : (
                                                <button className='text-red-500 hover:bg-red-900 cursor-pointer p-2 rounded-lg' onClick={() => handleDeleteCategory(category)}><RiDeleteBin5Fill size={20} /></button>
                                            )}
                                        </div>
                                    </CardTitle>
                                    {category.description ? (
                                        <p className='font-bold font-sans text-gray-500 mt-2'>{category.description}</p>
                                    ) : null}
                                </CardHeader>
                                <CardContent>
                                    <p className='text-sm font-bold font-sans' style={{ color: category.color }}>Amount Got: {categoryDistribution?.incomeCategories?.find(item => item.category === category.name)?.amount || 0}</p>
                                </CardContent>
                            </Card>
                        ))}

                    </div>
                </TabsContent>
                <TabsContent value="Budget">
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
                        {budget.map((budg) => {
                            const percentage = Math.min((budg.amount / budg.limit) * 100, 100)
                            const now = new Date()
                            const endDate = new Date(budg.endDate)
                            const isActive = now <= endDate

                            let statusColor = '';
                            if (isActive) {
                                if (percentage <= 65) { statusColor = "lime" }
                                else if (percentage <= 85) { statusColor = "yellow" }
                                else { statusColor = "red" }
                            } else { statusColor = budg.amount >= budg.limit ? "red" : "lime" }

                            const borderColor =
                                statusColor === "lime"
                                    ? "border-l-lime-600"
                                    : statusColor === "yellow"
                                        ? "border-l-yellow-500"
                                        : "border-l-red-600";

                            const textColorClass =
                                statusColor === "lime"
                                    ? "text-lime-600"
                                    : statusColor === "yellow"
                                        ? "text-yellow-500"
                                        : "text-red-600";
                            return (
                                <Card key={budg._id} className={`bg-black border-l-8 border-gray-800 ${borderColor} transition-all duration-300 ease-in-out hover:scale-105`}>
                                    <CardHeader>
                                        <CardTitle>
                                            <div className={`flex items-center justify-between ${textColorClass}`}>
                                                <div className='flex items-center justify-start gap-2'>
                                                    <h1><SiProgress /></h1>
                                                    <h1>{budg.category}</h1>
                                                </div>
                                                {isActive ? (
                                                    <Badge variant="outline" className={percentage <= 65 ? "bg-lime-600 border-none" : percentage <= 80 ? "bg-yellow-500 border-none" : "bg-red-600 border-none"}>{percentage <= 65 ? "Under Budget - Active" : percentage <= 80 ? "Near limit - Active" : "Over Budget - Active"}</Badge>
                                                ) : (
                                                    <Badge variant="outline" className={budg.amount > budg.limit ? "bg-red-600 border-none" : "bg-lime-600 border-none"}>
                                                        {budg.amount > budg.limit ? "Budget Failed" : "Budget Succeeded"}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='space-y-3'>
                                        <div>
                                            <div className={`flex items-center justify-between text-sm ${textColorClass}`}>
                                                <span>Budget</span>
                                                <span className='text-gray-500'>
                                                    {budg.amount.toFixed(2)} / {budg.limit.toFixed(2)}
                                                </span>
                                            </div>
                                            <Progress value={Math.min(percentage, 100)} className={percentage <= 65 ? '[&>*]:bg-green-500 mt-2 bg-gray-800' : percentage <= 80 ? '[&>*]:bg-yellow-500 mt-2 bg-gray-800' : '[&>*]:bg-red-500 mt-2 bg-gray-800'} />
                                            <div className='flex items-center justify-between text-xs mt-3'>
                                                <div className='flex items-center gap-1 text-gray-500'>
                                                    <Calendar className='h-3 w-3' />
                                                    {new Date(budg.startDate).toLocaleDateString()} - {new Date(budg.endDate).toLocaleDateString()}
                                                </div>
                                                <span className={percentage <= 65 ? 'text-green-500' : percentage <= 80 ? 'text-yellow-500' : 'text-red-500'}>
                                                    {Math.min(percentage, 100).toFixed(2)}%
                                                </span>
                                            </div>
                                            <div className='flex items-center justify-between gap-3 mt-6'>
                                                {!isActive || budg.amount > budg.limit ? (
                                                    null
                                                ) : (
                                                    <>
                                                        <Button className="bg-gray-800 hover:bg-gray-700 w-full" onClick={() => handleEdit(budg)}>Edit Budget</Button>
                                                        <Button className="bg-red-800 hover:bg-red-700 w-full" onClick={() => handleDelete(budg._id)}>Delete Budget</Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </TabsContent>
            </Tabs>

            <AddBudget isOpen={isAddBudgetOpen} onClose={handleCloseAddBudget} />
            <UpdateBudget key={budgetData?._id} isOpen={isUpdateBudgetOpen} onClose={handleCloseUpdateBudget} budget={budgetData} />
            <DeleteBudget isOpen={isDeleteBudgetOpen} onClose={handleCloseDeleteBudget} budgetId={deleteBudgetId} />
            <DeleteCategory isOpen={isDeleteCategoryOpen} onClose={handleCloseDeleteCategory} category={deleteCategory} />


        </div>
    )
}

export default CategoryTabs