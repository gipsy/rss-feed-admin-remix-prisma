import type { ActionFunction }      from "@remix-run/node"
import { updatePostsFromFeed }      from "~/utils/post.server"

const rssUrl = 'https://lifehacker.com/rss'
export const action: ActionFunction = async ({ request }) => await updatePostsFromFeed(rssUrl) || null
