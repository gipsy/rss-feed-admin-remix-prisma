import type { V2_MetaFunction } from "@remix-run/node";

import { LoaderFunction, redirect } from '@remix-run/node'
import { requireUserId }            from '~/utils/auth.server'

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  return redirect('/home')
}
