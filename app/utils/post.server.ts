import { prisma } from "./prisma.server"
import { Post }   from "~/utils/types.server";
import Parser     from 'rss-parser'

export const createPosts = async (userId: string, rssUrl: string) => {
  const parser = new Parser({
    headers: { 'User-Agent': 'Chrome' }
  });
  
  try {
    const feed = await parser.parseURL(rssUrl)
    const posts = feed.items.map((item) => {
      return {
        title: item.title,
        guid: item.guid
      }
    })
    const result = await prisma.post.createMany({
      data: posts
    })
    return result
  } catch(err) {
    console.log(err)
    return null
  }
};

export const createPost = async (post: Post) => {
  try {
    return await prisma.post.create({
      data: post
    })
  } catch(err) {
    console.log(err)
  }
}

export const getPosts = async (userId: string) => {
  try {
    return await prisma.post.findMany()
  } catch (error) {
    console.log('No feeds available', error)
  }
};
