import { usePagination, DOTS } from '~/hooks/use-pagination'
import classnames from 'classnames'

interface PaginationProps {
  onPageChange: (...args: any) => any,
  totalCount: number,
  siblingCount?: number,
  currentPage: number,
  pageSize: number,
  className: string
}

const Pagination = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className
}: PaginationProps) => {
  const paginationRange = usePagination({
    totalCount,
    pageSize,
    siblingCount,
    currentPage,
  });
  
  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange && paginationRange.length < 2) {
    return null;
  }
  
  const onNext = () => {
    onPageChange(currentPage + 1);
  };
  
  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };
  
  let lastPage = paginationRange ? paginationRange[paginationRange.length - 1] : 0;
  return (
    <ul
      className={classnames('pagination-container', { [className]: className })}
    >
      {/* Left navigation arrow */}
      <li
        className={classnames('pagination-item', {
          disabled: currentPage === 1
        })}
        onClick={onPrevious}
      >
        <div className="arrow left" />
      </li>
      {paginationRange?.map((pageNumber,i) => {
        
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return <li key={i} className="pagination-item dots">&#8230;</li>
        }
        
        // Render our Page Pills
        return (
          <li
            key={i}
            className={classnames('pagination-item', {
              selected: pageNumber === currentPage
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      {/*  Right Navigation arrow */}
      <li
        className={classnames('pagination-item', {
          disabled: currentPage === lastPage
        })}
        onClick={onNext}
      >
        <div className="arrow right" />
      </li>
    </ul>
  );
};

export default Pagination
