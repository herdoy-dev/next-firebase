"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

type PaginateButtonProps = {
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
};

const PaginateButton = ({
  children,
  disabled,
  onClick,
}: PaginateButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-md bg-green-600 text-white disabled:bg-green-800/50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
};

interface Props {
  currentPage: number;
  pageSize: number;
  itemCount: number;
}

const Pagination = ({ currentPage, pageSize, itemCount }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const pageCount = Math.ceil(itemCount / pageSize);

  if (pageCount <= 1) return null;

  const handlePageChange = (page: number) => {
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="px-3 text-sm text-gray-700 font-medium">
        Page {currentPage} of {pageCount}
      </span>
      <PaginateButton
        disabled={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        <MdKeyboardDoubleArrowLeft />
      </PaginateButton>

      <PaginateButton
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <MdKeyboardArrowLeft />
      </PaginateButton>

      <PaginateButton
        disabled={currentPage === pageCount}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <MdKeyboardArrowRight />
      </PaginateButton>
      <PaginateButton
        disabled={currentPage === pageCount}
        onClick={() => handlePageChange(pageCount)}
      >
        <MdKeyboardDoubleArrowRight />
      </PaginateButton>
    </div>
  );
};

export default Pagination;
