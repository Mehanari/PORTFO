import React from 'react';

interface PortfolioDeletePopUpProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const PortfolioDeletePopUp: React.FC<PortfolioDeletePopUpProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#ECEAE9] p-10 w-96 rounded shadow-md text-center">
        <p className="text-[#565564]">{message}</p>
        <div className=" pt-10 flex justify-center space-x-8">
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 text-[#565564] hover:text-white hover:bg-[#FD7343] rounded transition-colors duration-200"
          >
            Yes
          </button>
          <button 
            onClick={onCancel} 
            className="px-4 py-2 text-[#565564] hover:text-white hover:bg-[#FD7343] rounded transition-colors duration-200"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDeletePopUp;
