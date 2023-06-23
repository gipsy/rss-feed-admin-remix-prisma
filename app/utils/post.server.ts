import { prisma }   from "./prisma.server"
import Parser       from 'rss-parser'
import { redirect } from "@remix-run/node";

const parser = new Parser({
  headers: { 'User-Agent': 'Chrome' }
});

export const initPostsFromFeed = async (userId: string, rssUrl: string) => {
  try {
    const feed = await parser.parseURL(rssUrl)
    const posts = feed.items.map((item) => {
      return {
        title:          item.title,
        content:        item.content,
        creator:        item.creator,
        link:           item.link,
        guid:           item.guid,
        published:      true
      }
    })
    const results = await prisma.post.createMany({
      data: posts
    })
    console.log('posts initialized: ',results)
    return posts
  } catch(err) {
    console.log('Can not create feed: ', err)
    return null
  }
};

export const updatePostsFromFeed = async (rssUrl: string) => {
  const feed = await parser.parseURL(rssUrl)
  const feedPosts = feed.items.map( (item) => {
    return {
      title: item.title,
      content: item.content,
      creator: item.creator,
      link: item.link,
      guid: item.guid,
      published: true
    }
  } );
  const posts = await prisma.post.findMany( {
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  } );
  if (feedPosts?.length > 0 && posts?.length > 0){
    const postGuids = posts.map( post => post.guid );
    const newPost = feedPosts.filter( item => {
      if (item.guid !== undefined){
        return postGuids.indexOf( item.guid ) == -1
      }
    } );
    if (newPost.length > 0){
      await newPost.forEach( post => createPost( post ) );
    }
  }
  return null
}

export const getFilteredPosts = async (
  userId: string,
  whereFilter: {}
) => {
  try {
    return await prisma.post.findMany({
      select: {
        id: true,
        createdAt: true,
        title: true,
        published: true,
        creator: true,
        content: true,
        link: true,
        guid: true,
      },
      where: {
        published: true,
        ...whereFilter,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
  } catch (err) {
    console.log('Can not get filtered posts: ', err)
    return null;
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
    return null;
  }
}

export const createPost = async (post) => {
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

export const unPublishPost = async (postId: string | undefined) => {
  try {
    await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        published: false
      }
    })
    return redirect('/home')
  } catch (err) {
    console.log('Can not unpublish post: ', err)
    return null
  }
}
