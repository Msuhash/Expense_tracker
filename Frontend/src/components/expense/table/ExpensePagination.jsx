import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchExpenses } from '../../../store/slices/expenseSlice'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

const ExpensePagination = () => {
    const dispatch = useDispatch()
    const { pagination, filters } = useSelector((state) => state.expense)
    const { currentPage, totalPages, limit } = pagination

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return

        // Dispatch fetch with new page
        dispatch(fetchExpenses({ ...filters, page, limit }))

        // Scroll to top of the table smoothly (optional, good UX)  
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const renderPageNumbers = () => {
        const pages = []
        const maxVisible = 5 // Max buttons to show

        // If total pages is small, show all
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Show current, prev, next, first, last and ellipses
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 'ellipsis', totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages)
            }
        }

        return pages.map((page, index) => {
            if (page === 'ellipsis') {
                return (
                    <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis className="text-amber-800" />
                    </PaginationItem>
                )
            }

            return (
                <PaginationItem key={page}>
                    <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className={`cursor-pointer border-2 border-amber-950 hover:bg-amber-950 hover:text-black transition-colors duration-200 ${currentPage === page
                            ? 'bg-amber-800 text-black border-amber-800'
                            : 'text-amber-800'
                            }`}
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            )
        })
    }

    // Don't render pagination if there are no pages or just 1 page
    if (!totalPages || totalPages <= 1) return null

    return (
        <div>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={`transition-colors duration-200 cursor-pointer ${currentPage === 1
                                ? 'pointer-events-none opacity-50 text-gray-500'
                                : 'text-amber-800 hover:bg-amber-800 hover:text-black'
                                }`}
                        />
                    </PaginationItem>

                    {renderPageNumbers()}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={`transition-colors duration-200 cursor-pointer ${currentPage === totalPages
                                ? 'pointer-events-none opacity-50 text-gray-500'
                                : 'text-amber-800 hover:bg-amber-800 hover:text-black'
                                }`}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default ExpensePagination