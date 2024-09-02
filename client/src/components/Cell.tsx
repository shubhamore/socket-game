import React from "react";

type CellProps = {
  value: string;
  onClick: () => void;
  isPointer: boolean;
};

const Cell: React.FC<CellProps> = ({ value, onClick, isPointer }) => {
  return (
    <div
      className={`flex items-center justify-center h-20 w-20 border border-gray-300 ${
        isPointer ? "cursor-pointer hover:bg-gray-200" : "cursor-not-allowed"
      }`}
      onClick={isPointer ? onClick : undefined}
    >
      <span className={`text-3xl font-bold ${value === 'X' ? 'text-blue-500' : 'text-red-500'}`}>{value}</span>
    </div>
  );
};

export default Cell;
