import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteBudget } from '@/store/slices/budgetSlice'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
const DeleteBudget = ({ isOpen, onClose, budgetId }) => {
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.budget)

    const handleDelete = async () => {
        if (budgetId) {
            await dispatch(deleteBudget(budgetId)).unwrap()
            onClose()
            toast.success("Budget deleted successfully")
            // You may want to add a success toast here if you have a toast system
        }
        else {
            toast.error("Failed to delete budget")
        }
    }

    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className='flex flex-col gap-4 bg-black border border-amber-900/50 p-6 rounded-xl shadow-2xl shadow-amber-900/20 w-full max-w-md'>
                <div className="space-y-2">
                    <h3 className='text-amber-600 font-bold text-xl'>Delete Budget Record</h3>
                    <p className='text-amber-500/80 text-sm'>
                        Are you sure you want to delete this budget record? This action cannot be undone.
                    </p>
                </div>

                <div className='flex justify-end gap-3 mt-4'>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className='text-amber-600 hover:bg-amber-900/20 hover:text-amber-700 cursor-pointer'
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                        className='bg-red-900/80 hover:bg-red-900 text-red-200 border border-red-800 cursor-pointer'
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DeleteBudget