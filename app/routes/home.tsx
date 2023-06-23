import {
  ActionFunction, LoaderFunction,
  json, redirect, ActionArgs
} from '@remix-run/node'
import { requireUserId }      from "~/utils/auth.server"
import { createPost, initPostsFromFeed,
  getFilteredPosts }          from '~/utils/post.server'
import { Layout }             from '~/components/layout'
import { FeedPanel }          from '~/components/feed-panel'
import { SearchBar }          from '~/components/search-bar'
import { useEffect }          from "react"
import { useLoaderData }      from "react-router"
import { Outlet, useFetcher } from "@remix-run/react"
import pagination             from "../styles/pagination.css"
import { Post }               from "~/utils/types.server";

export function links() {
  return [{ rel: "stylesheet", href: pagination }]
}

const rssUrl = 'https://lifehacker.com/rss'

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
    loaderPosts: await getFilteredPosts(userId, textFilter),
    filter
  }
  if (data.loaderPosts && data.loaderPosts.length > 0) {
    return json(data)
  }
  if (filter === null) {
    return await initPostsFromFeed(userId, rssUrl)
  } else {
    return []
  }
}

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const postData = Object.fromEntries(formData)
  
  return await createPost(postData) && redirect('/home')
}

export default function Home() {
  const fetcher = useFetcher()
  const { loaderPosts, filter } = useLoaderData() as Partial<Post>[]
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetcher.submit(
          { rssUrl },
          { method: "post", action: "/home/posts/poll" }
        );
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
        <FeedPanel posts={loaderPosts} filter={filter} />
      </div>
    </Layout>
  )
}
