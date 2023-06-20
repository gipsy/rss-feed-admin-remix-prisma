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
        createdAt:      item.createdAt,
        updatedAt:      item.updatedAt,
        title:          item.title,
        content:        item.content,
        contentSnippet: item.contentSnippet,
        creator:        item.creator,
        isoDate:        item.isoDate,
        link:           item.link,
        guid:           item.guid
      }
    })
    const result = await prisma.post.createMany({
      data: posts
    })
    return result
  } catch(err) {
    console.log('Can not create feed: ', err)
    return null
  }
};

export const createPost = async (post: Post) => {
  try {
    return await prisma.post.create({
      data: post
    })
  } catch(err) {
    console.log('Can not create post: ', err)
    return null
  }
}

export const updatePost = async (post) => {
  try {
    console.log('link',post.link)
    return await prisma.post.update({
      where: {
        id: post.id
      },
      data: {
        link: post.link,
        title: post.title,
        content: post.content
      }
    })
  } catch(err) {
    console.log('Can not update post: ', err)
    return null
  }
}

export const getPosts = async (userId: string) => {
  try {
    return await prisma.post.findMany()
  } catch (err) {
    console.log('No feeds available: ', err)
    return null
  }
};

export const getPostById = async (postId: string) => {
  try {
    return await prisma.post.findUnique({
      where: {
        id: postId,
      },
    })
  } catch (err) {
    console.log('Can not get post by id: ', err)
  }
}
