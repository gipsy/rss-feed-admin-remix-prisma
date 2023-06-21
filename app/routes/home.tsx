import {
  ActionFunction, LoaderFunction,
  json, redirect }                           from '@remix-run/node'
import { requireUserId }                     from "~/utils/auth.server"
import { createPost, createPosts,
  getAllPosts, getFilteredPosts }            from '~/utils/post.server'
import { Layout }                            from '~/components/layout'
import { FeedPanel }                         from '~/components/feed-panel'
import { SearchBar }                         from '~/components/search-bar'
import { useEffect, useState }               from "react"
import { useLoaderData }                     from "react-router"
import { Outlet, useFetcher }                from "@remix-run/react"
import usePollingEffect                      from "~/hooks/use-polling-effect"
import { Post }                              from "~/utils/types/post.server"
import Parser                                from 'rss-parser'
import pagination                            from "../styles/pagination.css"

export function links() {
  return [{ rel: "stylesheet", href: pagination }]
}

const parser = new Parser({
  headers: {
    'User-Agent': 'Chrome',
  }
});

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
    allPosts: await getAllPosts(userId),
    filteredPosts: await getFilteredPosts(userId, textFilter)
  }
  if (data.allPosts.length > 0) {
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
  const [rssData, setRssData] = useState({})
  const { allPosts, filteredPosts } = useLoaderData<LoaderData | undefined>()
  
  usePollingEffect(
    async () => setRssData(
      await parser.parseURL(rssUrl)
    ),
    [],
    {
      interval: 5000,
      onCleanUp: () => {console.log('clean up')}
    }
  )
  
  useEffect(() => {
    if (rssData.items !== undefined && allPosts?.length > 0) {
      const postGuids = allPosts.map(post => post.guid)
      
      const newPost = rssData.items.filter(item => postGuids.indexOf(item.guid) == -1)
      
      if (newPost.length > 0) {
        newPost.forEach(post => {
          fetcher.submit({
            //createdAt:      post.createdAt,
            //updatedAt:      post.updatedAt,
            title:          post.title,
            content:        post.content,
            //contentSnippet: post.contentSnippet,
            creator:        post.creator,
            //isoDate:        post.isoDate,
            link:           post.link,
            guid:           post.guid
          },
          {method: 'post'})
        })
      }
    }
  }, [rssData])
  
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
