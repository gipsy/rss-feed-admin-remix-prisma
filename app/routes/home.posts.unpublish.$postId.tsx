import type { ActionFunction } from "@remix-run/node"
import { unPublishPost } from "~/utils/post.server"

export const action: ActionFunction = async ({ request, params }) => {
  const { postId } = params
  return unPublishPost(postId)
}
