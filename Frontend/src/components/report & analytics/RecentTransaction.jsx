import React from 'react'
import { useSelector } from 'react-redux'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

const RecentTransaction = () => {
    const { recentTransaction, loading } = useSelector((state) => state.analytics);
    const { incomeCategories, expenseCategories } = useSelector((state) => state.category);

    const getCategory = (transaction) => {
        const categories = transaction.type === 'income' ? incomeCategories : expenseCategories;
        return categories.find(c => c.name === transaction.category);
    };

    return (
        <Card className="bg-black text-amber-700 border-amber-800">
            <CardHeader>
                <CardTitle className="text-xl">Recent Transactions</CardTitle>
                <CardDescription className="pt-2">Your last 5 income and expense transactions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className='border-amber-700 hover:bg-gray-900'>
                                <TableHead className="text-red-800">Date</TableHead>
                                <TableHead className="text-red-800">Category</TableHead>
                                <TableHead className="text-red-800">Description</TableHead>
                                <TableHead className="text-red-800">Type</TableHead>
                                <TableHead className="text-right text-red-800">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentTransaction.map((transaction, index) => {
                                const category = getCategory(transaction);
                                return (
                                    <TableRow key={index} className="border-amber-700 hover:bg-gray-900">
                                        <TableCell className="font-medium">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{category?.icon || '📦'}</span>
                                                <span>{category?.name || transaction.category}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{transaction.description}</TableCell>
                                        <TableCell>
                                            <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'} className={transaction.type === 'income' ? 'bg-lime-800 text-black hover:bg-lime-900' : 'bg-red-800 text-black hover:bg-red-900'}>
                                                {transaction.type === 'income' ? (
                                                    <TrendingUp className="mr-1 h-3 w-3" />
                                                ) : (
                                                    <TrendingDown className="mr-1 h-3 w-3" />
                                                )}
                                                {transaction.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                            }`}>
                                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
                {recentTransaction.length === 0 && !loading && (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No transactions yet</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default RecentTransaction