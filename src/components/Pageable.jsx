
export const Pageable = ({ page, totalPages, setPage }) => {
  return (
    <div className="flex gap-4 my-4">
      <button
        disabled={page === 0}
        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        className="flex items-center justify-center px-2 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
      > <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-1"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <span>Página {page + 1} de {totalPages}</span>

      <button
        disabled={page + 1 >= totalPages}
        onClick={() => setPage((prev) => prev + 1)}
        className="flex items-center justify-center px-2 py-1 bg-violet-500 hover:bg-violet-600 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}
