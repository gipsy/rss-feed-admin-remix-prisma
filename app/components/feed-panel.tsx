import { Link, useNavigate } from '@remix-run/react'
import Pagination            from "~/components/pagination";
import { useMemo, useState } from "react";
import { Post }              from "~/utils/types.server";

let PageSize = 15

type FeedPanelProps = {
  posts: Partial<Post>[];
  filter: string;
};

export function FeedPanel({
  posts = [],
  filter
}: FeedPanelProps) {
  const navigate = useNavigate()
  
  const [currentPage, setCurrentPage] = useState(1)
  
  const currentPostsData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return posts.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, posts]);
  
  return (
    <div className="w-full bg-gray-200 flex flex-col">
      <div className="text-center bg-gray-300 h-20 flex items-center justify-center">
        <h2 className="text-xl text-blue-600 font-semibold">Posts</h2>
      </div>
      <div className="flex-1 overflow-y-scroll py-4 flex flex-col gap-y-5">
        <div className="container mx-auto">
          <ul>
            {currentPostsData.length > 0 ? currentPostsData.map((post,i) => (
              <li
                key={post.id || i}
                className="w-full mb-3 bg-white hover:bg-sky-500 px-5 py-2 cursor-pointer"
                onClick={() => navigate(`posts/${post.id}${!!filter ? '?filter=' + filter : ''}`)}
              >
                <p>Title: {post.title}</p>
                <p>Creator: {post.creator}</p>
              </li>
            )) : (
              <li className="w-full mb-3 bg-white py-2 px-5 text-center">
                No posts found with this search criteria
              </li>
            ) }
          </ul>
        </div>
      </div>
      <Pagination
        className="pagination-bar justify-center"
        currentPage={currentPage}
        totalCount={posts.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
      />
      <div className="text-center p-6 bg-gray-300">
        <div className="container mx-auto">
          <Link
            className="inline-block w-6/12 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
            to={`posts/create${!!filter ? '?filter=' + filter : ''}`}
          >
            Create new post
          </Link>
        </div>
      </div>
    </div>
  )
}
