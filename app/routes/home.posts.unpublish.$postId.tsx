import type { ActionFunction } from "@remix-run/node"
import { unPublishPost }       from "~/utils/post.server"
import { redirect }            from "@remix-run/node";
import { redirectBack }        from "remix-utils";

export const action: ActionFunction = async ({ request, params }) => {
  const { postId } = params
  
  const url = new URL(request.url)
  const filter = url.searchParams.get('filter')
  return await unPublishPost(postId) && redirect(`/home/${!!filter ? 'filter='+filter : ''}`)
}
