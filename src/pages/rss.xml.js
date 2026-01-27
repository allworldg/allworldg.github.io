import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../constants';
import { DateFormat } from '../utils';

export async function GET(context) {
    const posts = await getCollection('blog');
    console.log(posts[0].data.publishDate);
    console.log(DateFormat(posts[0].data.publishDate));
    return rss({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: context.site,
        items: posts.map((post) => ({
            title: post.data.title,
            link: `/blog/${post.id}/`,
            pubDate: post.data.publishDate,
            description: post.data.excerpt
        }))
    });
}
