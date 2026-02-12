import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { exportData } from '../../store/slices/exportSlice'
import { Button } from "@/components/ui/button"
import { toast } from 'react-toastify'
import { X, FileText, FileSpreadsheet } from 'lucide-react'

const ExportDataModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.export)

    // State for selected data types
    const [selectedTypes, setSelectedTypes] = useState({
        incomeCategories: true,
        expenseCategories: true,
        budgets: true
    })

    // Reset selections when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedTypes({
                incomeCategories: true,
                expenseCategories: true,
                budgets: true
            })
        }
    }, [isOpen])

    // Toggle checkbox selection
    const handleToggle = (type) => {
        setSelectedTypes(prev => ({
            ...prev,
            [type]: !prev[type]
        }))
    }

    // Handle export
    const handleExport = async (format) => {
        // Get selected types as array
        const selectedTypesArray = Object.keys(selectedTypes).filter(key => selectedTypes[key])

        if (selectedTypesArray.length === 0) {
            toast.error('Please select at least one data type to export')
            return
        }

        // Map frontend type names to backend expected names
        const typeMapping = {
            incomeCategories: 'income',
            expenseCategories: 'expense',
            budgets: 'budget'
        }

        const types = selectedTypesArray.map(type => typeMapping[type])

        try {
            await dispatch(exportData({ types, format })).unwrap()
            toast.success(`Data exported successfully as ${format.toUpperCase()}`)
            onClose()
        } catch (error) {
            toast.error(error || 'Failed to export data')
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className='flex flex-col gap-6 bg-black border border-amber-900/50 p-6 rounded-xl shadow-2xl shadow-amber-900/20 w-full max-w-md relative'>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-amber-600 hover:text-amber-500 transition-colors"
                    disabled={loading}
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="space-y-2">
                    <h3 className='text-amber-600 font-bold text-2xl'>Export Data</h3>
                    <p className='text-amber-500/80 text-sm'>
                        Select the data you want to export and choose your preferred format.
                    </p>
                </div>

                {/* Checkboxes */}
                <div className='space-y-3'>
                    {/* Income Categories */}
                    <label className='flex items-center gap-3 cursor-pointer group'>
                        <input
                            type="checkbox"
                            checked={selectedTypes.incomeCategories}
                            onChange={() => handleToggle('incomeCategories')}
                            disabled={loading}
                            className='w-5 h-5 rounded border-2 border-amber-600 bg-black checked:bg-amber-600 checked:border-amber-600 focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-black cursor-pointer disabled:opacity-50'
                        />
                        <span className='text-amber-800 font-medium group-hover:text-amber-500 transition-colors'>
                            Income Categories
                        </span>
                    </label>

                    {/* Expense Categories */}
                    <label className='flex items-center gap-3 cursor-pointer group'>
                        <input
                            type="checkbox"
                            checked={selectedTypes.expenseCategories}
                            onChange={() => handleToggle('expenseCategories')}
                            disabled={loading}
                            className='w-5 h-5 rounded border-2 border-amber-600 bg-black checked:bg-amber-600 checked:border-amber-600 focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-black cursor-pointer disabled:opacity-50'
                        />
                        <span className='text-amber-800 font-medium group-hover:text-amber-500 transition-colors'>
                            Expense Categories
                        </span>
                    </label>

                    {/* Budgets */}
                    <label className='flex items-center gap-3 cursor-pointer group'>
                        <input
                            type="checkbox"
                            checked={selectedTypes.budgets}
                            onChange={() => handleToggle('budgets')}
                            disabled={loading}
                            className='w-5 h-5 rounded border-2 border-amber-600 bg-black checked:bg-amber-600 checked:border-amber-600 focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-black cursor-pointer disabled:opacity-50'
                        />
                        <span className='text-amber-800 font-medium group-hover:text-amber-500 transition-colors'>
                            Budgets
                        </span>
                    </label>
                </div>

                {/* Action Buttons */}
                <div className='flex justify-between gap-3 mt-2'>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={loading}
                        className='text-amber-600 hover:bg-amber-900/20 hover:text-amber-700 cursor-pointer flex-1'
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={() => handleExport('pdf')}
                        disabled={loading}
                        className='bg-amber-900/80 hover:bg-amber-900 text-amber-200 border border-amber-800 cursor-pointer flex-1 gap-2'
                    >
                        <FileText size={18} />
                        {loading ? 'Exporting...' : 'Export as PDF'}
                    </Button>

                    <Button
                        onClick={() => handleExport('excel')}
                        disabled={loading}
                        className='bg-amber-900/80 hover:bg-amber-900 text-amber-200 border border-amber-800 cursor-pointer flex-1 gap-2'
                    >
                        <FileSpreadsheet size={18} />
                        {loading ? 'Exporting...' : 'Export as Excel'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ExportDataModal