import {
  ActionFunction, LoaderFunction,
  json, redirect }                           from '@remix-run/node'
import { requireUserId }                     from "~/utils/auth.server"
import { createPost, createPosts,
  getFilteredPosts }                         from '~/utils/post.server'
import { Layout }                            from '~/components/layout'
import { FeedPanel }                         from '~/components/feed-panel'
import { SearchBar }                         from '~/components/search-bar'
import { useEffect }                         from "react"
import { useLoaderData }                     from "react-router"
import { Outlet, useFetcher }                from "@remix-run/react"
import { Post }                              from "~/utils/types/post.server"
import pagination                            from "../styles/pagination.css"

export function links() {
  return [{ rel: "stylesheet", href: pagination }]
}

const rssUrl = 'https://lifehacker.com/rss'

type LoaderData = {
  posts?: Partial<Post>[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  
  const url = new URL(request.url)
  const filter = url.searchParams.get('filter')
  
  let textFilter = {}
  if (filter) {
    textFilter = {
      OR: [
        {
          title: {
            mode: 'insensitive',
            contains: filter
          }
        },
        {
          creator: {
            mode: 'insensitive',
            contains: filter
          }
        }
      ]
    }
  }
  
  const data = {
    filteredPosts: await getFilteredPosts(userId, rssUrl, textFilter)
  }
  if (data.filteredPosts.length > 0) {
    return data.filteredPosts ? json(data) : null
  }
  return await createPosts(userId, rssUrl) && redirect('/')
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const postData = Object.fromEntries(formData)
  
  return await createPost(postData) && redirect('/')
}

export default function Home() {
  console.log('rerender')
  const fetcher = useFetcher()
  const { filteredPosts } = useLoaderData<LoaderData | undefined>()
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetcher.load("/home");
      }
    }, 30 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Layout>
      <Outlet />
      <div className="container mx-auto">
        <SearchBar />
      </div>
      <div className="h-full flex">
        <FeedPanel posts={filteredPosts} />
      </div>
    </Layout>
  )
}
