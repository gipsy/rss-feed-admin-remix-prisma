import { Post } from '~/utils/types.server'
import { useNavigate } from '@remix-run/react'

export function FeedPanel({ posts }: { posts: Post[] }) {
  const navigate = useNavigate()
  return (
    <div className="w-full bg-gray-200 flex flex-col">
      <div className="text-center bg-gray-300 h-20 flex items-center justify-center">
        <h2 className="text-xl text-blue-600 font-semibold">Posts</h2>
      </div>
      <div className="flex-1 overflow-y-scroll py-4 flex flex-col gap-y-5">
        <div className="container mx-auto">
          { posts.map(post => (
            <button
              className="w-full mb-3 bg-white hover:bg-sky-500 cursor cursor:pointer"
              key={post.id}
              onClick={() => navigate(`posts/${post.id}`)}
            >
              {post.title}
            </button>
          )) }
        </div>
      </div>
      <div className="text-center p-6 bg-gray-300">
        <form action="/logout" method="post">
          <button
            type="submit"
            className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}

// app/components/user-panel.ts

// ...

export function UserPanel({ users }: props) {
  return (
    <div className="w-1/6 bg-gray-200 flex flex-col">
      {/* ... */}
      <div className="text-center p-6 bg-gray-300">
        <form action="/logout" method="post">
          <button type="submit" className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1">
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
