import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { updateExpense } from '../../../store/slices/expenseSlice'
import { fetchCategories } from '../../../store/slices/categorySlice'
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IoClose } from "react-icons/io5"
import { toast } from 'react-toastify'

const UpdateExpenseForm = ({ isOpen, onClose, initialData }) => {
  const dispatch = useDispatch()
  const { expenseCategories } = useSelector((state) => state.category)
  const { loading } = useSelector((state) => state.expense)

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories())
    }
  }, [isOpen, dispatch])

  const schema = Yup.object().shape({
    amount: Yup.number()
      .typeError('Amount must be a number')
      .required("Amount Is Required")
      .min(1, "Amount Must Be Greater Than 0"),
    category: Yup.string().required("Category Is Required"),
    description: Yup.string().required("Description Is Required"),
    date: Yup.date().required("Date Is Required")
  })

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date: new Date(),
      category: "",
      amount: "",
      description: ""
    }
  })

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        amount: initialData.amount,
        category: initialData.category,
        description: initialData.description,
        date: initialData.date ? new Date(initialData.date) : new Date()
      })
    }
  }, [initialData, reset])

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        date: format(data.date, 'yyyy-MM-dd')
      }

      await dispatch(updateExpense({ id: initialData._id, expenseData: formattedData })).unwrap()
      onClose()
      reset()
      toast.success("Expense Updated Successfully")
    } catch (error) {
      console.error("Failed to update expense:", error)
      toast.error(error.message || "Failed to update expense")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-amber-900/50 bg-black p-6 shadow-2xl shadow-amber-900/20 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-amber-600">Update Expense</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-amber-600 hover:bg-amber-900/20 transition-colors cursor-pointer"
          >
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-amber-600">Amount</label>
              <input
                type="number"
                {...register("amount")}
                className="flex h-10 w-full rounded-md border border-amber-800 bg-transparent px-3 py-2 text-sm text-amber-500 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter amount"
              />
              {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-amber-600">Type</label>
              <input type="text" placeholder='Expense' disabled className="flex h-10 w-full rounded-md border border-amber-800 bg-transparent px-3 py-2 text-sm text-amber-500 placeholder:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
          </div>


          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-amber-600">Category</label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    key={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

            {/* Date Picker */}
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium text-amber-600">Date</label>
              <Controller
                control={control}
                name="date"
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
                          date > new Date() || date < new Date("1900-01-01")
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
              {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
            </div>

          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-amber-600">Description</label>
            <input
              type="text"
              {...register("description")}
              className="flex h-10 w-full rounded-md border border-amber-800 bg-transparent px-3 py-2 text-sm text-amber-500 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter description"
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
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
              {loading ? "Updating..." : "Update Income"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateExpenseForm