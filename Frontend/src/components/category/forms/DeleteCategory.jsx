import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCategory, clearDeleteConflict, mergeCategory } from '@/store/slices/categorySlice'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchBudget } from '@/store/slices/budgetSlice'

const DeleteCategory = ({ isOpen, onClose, category }) => {
  const dispatch = useDispatch();
  const { loading, deleteConflict, categories } = useSelector((state) => state.category);
  const [showMergeForm, setShowMergeForm] = useState(false);

  // Filter available categories (same type, exclude current category)
  const availableCategories = categories.filter(
    c => c._id !== category?._id && c.type === category?.type && !c.isDefault
  );

  const schema = Yup.object().shape({
    targetCategoryId: Yup.string().required("Please select a category")
  })

  const { handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      targetCategoryId: ""
    }
  })

  // Handle simple delete (no conflicts)
  const handleDelete = async () => {
    try {
      if (category) {
        await dispatch(deleteCategory(category._id)).unwrap();
        onClose();
        toast.success("Category deleted successfully");
      }
    } catch (error) {
      console.log("Delete error:", error)
      // Error will trigger deleteConflict state
    }
  }

  // Handle merge & delete
  const onMergeSubmit = async (data) => {
    try {
      await dispatch(mergeCategory({
        id: category._id,
        targetCategoryId: data.targetCategoryId
      })).unwrap();

      toast.success("Category merged successfully");
      dispatch(clearDeleteConflict());
      dispatch(fetchBudget())
      reset();
      onClose();
    } catch (error) {
      toast.error(error || "Failed to merge category");
    }
  }

  const handleClose = () => {
    dispatch(clearDeleteConflict());
    setShowMergeForm(false);
    reset();
    onClose();
  };

  // Show merge form when deleteConflict is detected
  useEffect(() => {
    if (deleteConflict) {
      setShowMergeForm(true);
    }
  }, [deleteConflict])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowMergeForm(false);
      dispatch(clearDeleteConflict());
    }
  }, [isOpen, dispatch])

  if (!isOpen || !category) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      {showMergeForm ? (
        // MERGE FORM - Show when category has records
        <div className='flex flex-col gap-4 bg-black border border-amber-900/50 p-6 rounded-xl shadow-2xl shadow-amber-900/20 w-full max-w-md'>
          <div className="space-y-2">
            <h3 className='text-amber-600 font-bold text-xl'>Merge Category</h3>
            <p className='text-amber-500/80 text-sm'>
              This category cannot be deleted because it's being used.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className='text-red-500 font-bold text-lg'>Category In Use</h3>
            <p className='text-amber-500/80 text-sm'>
              This category is used in:
            </p>
            <ul className="text-sm text-amber-400 space-y-1">
              {deleteConflict?.expense > 0 && <li>• Expenses: {deleteConflict.expense}</li>}
              {deleteConflict?.income > 0 && <li>• Income: {deleteConflict.income}</li>}
              {deleteConflict?.budget > 0 && <li>• Budgets: {deleteConflict.budget}</li>}
            </ul>
            <p className='text-amber-500/80 text-sm mt-2'>
              Select a category to move all records to, then the old category will be deleted.
            </p>
          </div>

          <form onSubmit={handleSubmit(onMergeSubmit)} className='space-y-4'>
            <div className="space-y-2">
              <label className='text-sm font-medium text-amber-600'>
                Move to Category
              </label>
              <Controller
                control={control}
                name="targetCategoryId"
                render={({ field }) => (
                  <Select
                    key={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full border-amber-800 text-amber-500 focus:ring-amber-600 focus:ring-offset-0 bg-transparent">
                      <SelectValue placeholder="Select category to merge into" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-amber-800 text-amber-500">
                      {availableCategories && availableCategories.length > 0 ? (
                        availableCategories.map((cat) => (
                          <SelectItem
                            key={cat._id}
                            value={cat._id}
                            className="focus:bg-amber-900/20 focus:text-amber-600 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span>{cat.icon}</span>
                              <span>{cat.name}</span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-amber-500/60">
                          No other {category.type} categories available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.targetCategoryId && (
                <p className='text-red-500 text-xs'>{errors.targetCategoryId.message}</p>
              )}
            </div>

            <div className='flex justify-end gap-3 mt-4'>
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className='text-amber-600 hover:bg-amber-900/20 hover:text-amber-700 cursor-pointer'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={loading || availableCategories.length === 0}
                className='bg-amber-600 text-black hover:bg-amber-700 cursor-pointer border-none'
              >
                {loading ? "Merging..." : "Merge & Delete"}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        // SIMPLE DELETE CONFIRMATION
        <div className='flex flex-col gap-4 bg-black border border-amber-900/50 p-6 rounded-xl shadow-2xl shadow-amber-900/20 w-full max-w-md'>
          <div className="space-y-2">
            <h3 className='text-amber-600 font-bold text-xl'>Delete Category</h3>
            <p className='text-amber-500/80 text-sm'>
              Are you sure you want to delete the category <span className="text-amber-400 font-semibold">"{category.name}"</span>?
            </p>
            <p className='text-amber-500/60 text-xs mt-2'>
              This action cannot be undone.
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
      )}
    </div>
  )
}

export default DeleteCategory