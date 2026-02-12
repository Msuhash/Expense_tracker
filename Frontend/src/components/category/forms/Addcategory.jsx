import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { addCategory } from '../../../store/slices/categorySlice'
import { toast } from 'react-toastify'
import { IoClose } from 'react-icons/io5'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { fetchRecentTransaction } from '@/store/slices/analyticsSlice'
import { fetchSummary, fetchMonthlyComparison, fetchCategoryDistribution, fetchTrend, fetchLineMonthlyComparison } from '@/store/slices/analyticsSlice';

const Addcategory = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.category)

  const ICON_OPTIONS = ['💰', '💼', '🍔', '🚗', '💡', '🎮', '🏠', '👕', '🏥', '📚', '✈️', '🎬', '☕', '🛒', '💊', '🎵'];
  const COLOR_OPTIONS = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#a855f7'
  ];

  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    type: Yup.string().oneOf(['income', 'expense'], "Type must be income or expense").required("Type is required"),
    description: Yup.string().max(100, "Description must be at most 100 characters").nullable(),
    icon: Yup.string().oneOf(ICON_OPTIONS, "Please choose one icon").required("Icon is required"),
    color: Yup.string().oneOf(COLOR_OPTIONS, "Please choose one color").required("Color is required")
  })

  const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      icon: "",
      color: "",
    }
  })

  const selectedIcon = watch("icon")
  const selectedColor = watch("color")

  const onSubmit = async (data) => {
    try {
      await dispatch(addCategory(data)).unwrap()
      reset()
      onClose()
      toast.success("Category Added Successfully")
      dispatch(fetchRecentTransaction())
      dispatch(fetchSummary());
      dispatch(fetchMonthlyComparison());
      dispatch(fetchCategoryDistribution());
      dispatch(fetchTrend());
      dispatch(fetchLineMonthlyComparison());
    } catch (error) {
      console.error("Failed to add category:", error)
      toast.error(error.message || "Failed to add Category")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-amber-900/50 bg-black p-6 shadow-2xl shadow-amber-900/20 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-amber-600">Add New Category</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-amber-600 hover:bg-amber-900/20 transition-colors cursor-pointer"
          >
            <IoClose size={24} />
          </button>
        </div>

        <p className="text-sm text-amber-800 mb-6">Create a new category for tracking income or expenses.</p>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>

          {/* Name */}
          <div className="space-y-2">
            <label className='text-sm font-medium text-amber-600'>Name</label>
            <input
              type="text"
              {...register("name")}
              className="flex h-10 w-full rounded-md border border-amber-800 bg-transparent px-3 py-2 text-sm text-amber-500 placeholder:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter category name"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className='text-sm font-medium text-amber-600'>Type</label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full border-amber-800 text-amber-500 focus:ring-amber-600 focus:ring-offset-0 bg-transparent">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-amber-800 text-amber-500">
                    <SelectItem value="income" className="focus:bg-amber-900/20 focus:text-amber-600 cursor-pointer">
                      Income
                    </SelectItem>
                    <SelectItem value="expense" className="focus:bg-amber-900/20 focus:text-amber-600 cursor-pointer">
                      Expense
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className='text-sm font-medium text-amber-600'>Description (Optional)</label>
            <input
              type="text"
              {...register("description")}
              className="flex h-10 w-full rounded-md border border-amber-800 bg-transparent px-3 py-2 text-sm text-amber-500 placeholder:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter description"
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          {/* Icon Selector */}
          <div className="space-y-2">
            <label className='text-sm font-medium text-amber-600'>Icon</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setValue("icon", icon)}
                  className={`h-12 w-12 rounded-md border-2 flex items-center justify-center text-2xl transition-all cursor-pointer hover:scale-110 ${selectedIcon === icon
                    ? 'border-amber-600 bg-amber-900/30 shadow-lg shadow-amber-600/20'
                    : 'border-amber-800 hover:border-amber-700 hover:bg-amber-900/10'
                    }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            {errors.icon && <p className="text-xs text-red-500">{errors.icon.message}</p>}
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <label className='text-sm font-medium text-amber-600'>Color</label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("color", color)}
                  className={`h-10 w-10 rounded-md border-2 transition-all cursor-pointer hover:scale-110 ${selectedColor === color
                    ? 'border-amber-600 shadow-lg shadow-amber-600/20 ring-2 ring-amber-600 ring-offset-2 ring-offset-black'
                    : 'border-amber-800 hover:border-amber-700'
                    }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            {errors.color && <p className="text-xs text-red-500">{errors.color.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-amber-600 hover:bg-amber-900/20 hover:text-amber-700 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-600 text-black hover:bg-amber-700 cursor-pointer border-none"
            >
              {loading ? "Adding..." : "Add Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Addcategory