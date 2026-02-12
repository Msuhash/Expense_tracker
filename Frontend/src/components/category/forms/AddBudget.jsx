import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { addBudget } from '../../../store/slices/budgetSlice'
import { fetchCategories } from '@/store/slices/categorySlice'
import { toast } from 'react-toastify'
import { IoClose } from 'react-icons/io5'
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
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

const AddBudget = ({ isOpen, onClose }) => {

  const dispatch = useDispatch()
  const { expenseCategories } = useSelector((state) => state.category)
  const { loading } = useSelector((state) => state.budget)

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories())
    }
  }, [isOpen, dispatch])

  const schema = Yup.object().shape({
    category: Yup.string().required("Category is required"),
    limit: Yup.number()
      .typeError('Limit must be a number')
      .required("Limit is required")
      .positive("Limit must be positive")
      .min(1, "Limit must be at least 1"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date must be after start date"),
  })

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      category: "",
      limit: "",
      startDate: new Date(),
      endDate: new Date(),
    }
  })

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        startDate: format(data.startDate, 'yyyy-MM-dd'),
        endDate: format(data.endDate, 'yyyy-MM-dd')
      }
      await dispatch(addBudget(formattedData)).unwrap()
      reset()
      onClose()
      toast.success("Budget added successfully")
    } catch (error) {
      console.error("Failed to add budget:", error)
      toast.error(error.message || "Failed to add budget")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-amber-900/50 bg-black p-6 shadow-2xl shadow-amber-900/20 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-amber-600">Add New Budget</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-amber-600 hover:bg-amber-900/20 transition-colors cursor-pointer"
          >
            <IoClose size={24} />
          </button>
        </div>

        <p className="text-sm text-amber-800 mb-6">Set a budget limit for an expense category.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Category and Limit */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-amber-600'>Category</label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full border-amber-800 text-amber-500 focus:ring-amber-600 focus:ring-offset-0 bg-transparent">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-amber-800 text-amber-500">
                      {expenseCategories && expenseCategories.length > 0 ? (
                        expenseCategories.map((cat) => (
                          <SelectItem
                            key={cat._id}
                            value={cat.name}
                            className="focus:bg-amber-900/20 focus:text-amber-600 cursor-pointer"
                          >
                            {cat.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground">No categories found</div>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-amber-600'>Limit</label>
              <input
                type="number"
                {...register("limit")}
                className="flex h-10 w-full rounded-md border border-amber-800 bg-transparent px-3 py-2 text-sm text-amber-500 placeholder:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter limit"
              />
              {errors.limit && <p className="text-xs text-red-500">{errors.limit.message}</p>}
            </div>

          </div>

          {/* Start Date and End Date */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>

            {/* Start Date Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-amber-600">Start Date</label>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal border-amber-800 text-amber-500 hover:bg-amber-900/10 hover:text-amber-600 bg-transparent",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-black border-amber-800" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date("1900-01-01")
                        }
                        initialFocus
                        className="text-amber-500 bg-black"
                        classNames={{
                          day_selected: "bg-amber-600 text-black hover:bg-amber-600 hover:text-black focus:bg-amber-600 focus:text-black",
                          day_today: "bg-amber-900/30 text-amber-600",
                          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-amber-900/20 hover:text-amber-600 cursor-pointer",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.startDate && <p className="text-xs text-red-500">{errors.startDate.message}</p>}
            </div>

            {/* End Date Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-amber-600">End Date</label>
              <Controller
                control={control}
                name="endDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal border-amber-800 text-amber-500 hover:bg-amber-900/10 hover:text-amber-600 bg-transparent",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-black border-amber-800" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date("1900-01-01")
                        }
                        initialFocus
                        className="text-amber-500 bg-black"
                        classNames={{
                          day_selected: "bg-amber-600 text-black hover:bg-amber-600 hover:text-black focus:bg-amber-600 focus:text-black",
                          day_today: "bg-amber-900/30 text-amber-600",
                          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-amber-900/20 hover:text-amber-600 cursor-pointer",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.endDate && <p className="text-xs text-red-500">{errors.endDate.message}</p>}
            </div>

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
              {loading ? "Adding..." : "Add Budget"}
            </Button>
          </div>
        </form>

      </div>

    </div>
  )
}

export default AddBudget