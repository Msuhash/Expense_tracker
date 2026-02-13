import { FourSquare } from 'react-loading-indicators'
import React from 'react'
import IncomeTableFilters from './IncomeTableFilters'
import { useSelector } from 'react-redux'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FaFileSignature } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { HiMiniCurrencyRupee } from "react-icons/hi2";
import { BsChatRightTextFill } from "react-icons/bs";
import { IoCalendarSharp } from "react-icons/io5";
import { Badge } from "@/components/ui/badge"
import { VscGithubAction } from "react-icons/vsc";
import { BiSolidCategory } from "react-icons/bi";
import IncomeTablePagination from "./IncomeTablePagination"
import UpdateIncomeForm from '../forms/UpdateIncomeForm'
import DeleteModal from '../forms/DeleteModal'
import { color } from 'framer-motion'



const IncomeTable = () => {
  const { loading, income } = useSelector((state) => state.income);
  const { incomeCategories } = useSelector((state) => state.category);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
  const [selectedIncome, setSelectedIncome] = React.useState(null);

  const handleEdit = (incomeItem) => {
    setSelectedIncome(incomeItem);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedIncome(null);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [incomeToDelete, setIncomeToDelete] = React.useState(null);

  const handleDelete = (id) => {
    setIncomeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIncomeToDelete(null);
  };

  return (
    <div className="relative">
      <IncomeTableFilters />
      {loading && (
        <div className='flex justify-center items-center py-10'>
          <FourSquare color="#ffea00" size="small" text="Loading Data..." textColor="" />
        </div>
      )}

      {income.length === 0 && !loading && (
        <div className='flex justify-center items-center py-10'>
          <p className='text-gray-500'>No income records found</p>
        </div>
      )}

      <div className='mt-6 border-2 border-amber-700 rounded-lg overflow-x-auto'>
        <Table className='w-full'>
          <TableHeader>
            <TableRow className='border-amber-700 hover:bg-gray-950'>
              <TableHead className='text-red-700'>S.No</TableHead>
              <TableHead className='text-red-700'>
                <div className='flex items-center gap-2'>
                  <HiMiniCurrencyRupee size={25} />
                  Amount
                </div>
              </TableHead>
              <TableHead className='text-red-700'>
                <div className='flex items-center gap-2'>
                  <BiSolidCategory size={25} />
                  Category
                </div>
              </TableHead>
              <TableHead className='text-red-700'>
                <div className='flex items-center gap-2'>
                  <BsChatRightTextFill size={25} />
                  Description
                </div>
              </TableHead>
              <TableHead className='text-red-700'>
                <div className='flex items-center gap-2'>
                  <IoCalendarSharp size={25} />
                  Created On
                </div>
              </TableHead>
              <TableHead className='text-red-700'>
                <div className='flex items-center gap-2'>
                  <VscGithubAction size={25} />
                  Actions
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {income.map((item, index) => (
              <TableRow key={index} className='border-amber-700 hover:bg-gray-900'>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <span className='text-lime-700'><HiMiniCurrencyRupee size={25} /></span>{item.amount}
                  </div>
                </TableCell>
                <TableCell>
                  {(() => {
                    const category = Array.isArray(incomeCategories) ? incomeCategories.find((cat) => cat.name === item.category) : null;
                    return (
                      <span className="flex items-center gap-2">
                        <span>{category?.icon || '💰'}</span>
                        <span>{category?.name || item.category}</span>
                      </span>
                    )
                  })()}
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-700'><BsChatRightTextFill size={25} /></span>{item.description}
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-700'><IoCalendarSharp size={25} /></span>{new Date(item.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex gap-5 items-center'>
                    <button className="text-lime-700 cursor-pointer" onClick={() => handleEdit(item)}><FaFileSignature size={25} /></button>
                    <button className="text-red-700 cursor-pointer" onClick={() => handleDelete(item._id)}><MdDeleteSweep size={25} /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='mt-6'>
        <IncomeTablePagination />
      </div>

      <UpdateIncomeForm
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        initialData={selectedIncome}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        incomeId={incomeToDelete}
      />
    </div>
  )
}

export default IncomeTable