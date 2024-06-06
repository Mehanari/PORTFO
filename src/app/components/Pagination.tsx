import React from 'react';

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4">
      <ul className="flex justify-center space-x-2">
        {pageNumbers.map(number => (
          <li key={number} className="page-item">
            <button
              onClick={() => paginate(number)}
              className={`w-12 h-12 flex items-center justify-center border rounded transition-colors duration-200 ${
                number === currentPage ? 'bg-orange-400 text-white' : 'hover:bg-gray-200 hover:text-white'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;