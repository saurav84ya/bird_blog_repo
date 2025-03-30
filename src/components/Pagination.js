"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { GiNextButton } from "react-icons/gi";
import { GiPreviousButton } from "react-icons/gi";

const Pagination = ({ currentPage, totalPages }) => {
  const router = useRouter();
  const searchParams = useSearchParams();


  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`?page=${newPage}`);
    }
  };

  return (
    <div className="flex justify-center gap-4 my-6">
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="px-4 py-2 bg-gray-200 rounded text-black cursor-pointer disabled:opacity-50"
      >
        <GiPreviousButton />
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="px-4 py-2 bg-gray-200 rounded text-black cursor-pointer disabled:opacity-50"
      >
        <GiNextButton />
      </button>
    </div>
  );
};

export default Pagination;
