
export type { CollectionEntry } from 'astro:content';

export interface SearchEntry{
  id:string,
  title:string,
  content:string
  excerpt:string
  [key:string]:any
}


