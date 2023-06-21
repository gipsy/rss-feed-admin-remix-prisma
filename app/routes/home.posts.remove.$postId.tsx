import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { removePost } from "~/utils/post.server"

export const action: ActionFunction = async ({ request, params }) => {
  const { postId } = params
  return removePost(postId)
}
export const loader: LoaderFunction = async () => redirect("/")
