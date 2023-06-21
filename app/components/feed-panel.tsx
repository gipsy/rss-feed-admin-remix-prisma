import { Post }              from '~/utils/types.server'
import { Link, useNavigate } from '@remix-run/react'
import Pagination            from "~/components/pagination";
import { useMemo, useState } from "react";

let PageSize = 15

export function FeedPanel({ posts }: { posts: Post[] }) {
  const navigate = useNavigate()
  
  const [currentPage, setCurrentPage] = useState(1)
  
  const currentPostsData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return posts.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);
  
  return (
    <div className="w-full bg-gray-200 flex flex-col">
      <div className="text-center bg-gray-300 h-20 flex items-center justify-center">
        <h2 className="text-xl text-blue-600 font-semibold">Posts</h2>
      </div>
      <div className="flex-1 overflow-y-scroll py-4 flex flex-col gap-y-5">
        <div className="container mx-auto">
          <ul>
            { currentPostsData.map(post => (
              <li
                key={post.id}
                className="w-full mb-3 bg-white hover:bg-sky-500 px-5 py-2 cursor cursor:pointer"
                onClick={() => navigate(`posts/${post.id}`)}
              >
                <p>Title: {post.title}</p>
                <p>Creator: {post.creator}</p>
              </li>
            )) }
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
            to={'posts/create'}
          >
            Create new post
          </Link>
        </div>
      </div>
    </div>
  )
}
