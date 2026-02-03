<script setup lang="ts">
import type { CollectionEntry, SearchEntry } from '../types';
import { BLOG_URL } from '../constants';
import { ref } from 'vue';
import { Document, Index, type EnrichedDocumentSearchResults, type EnrichedResults } from 'flexsearch';
import { remark } from 'remark';
import strip from 'strip-markdown';
import { FIELD_SEARCH_CONTENT, FIELD_SEARCH_EXCERPT, FIELD_SEARCH_TITLE } from '../constants';

const props = defineProps<{
    blogs: Array<CollectionEntry<'blog'>>;
}>();

const searchText = ref<string>('');
const titleResult = ref<EnrichedResults<SearchEntry>>([]);
const contentResult = ref<EnrichedResults<SearchEntry>>([]);

const docSearch = new Document<SearchEntry>({
    tokenize: 'full',
    document: {
        id: 'id',
        index: [FIELD_SEARCH_TITLE, FIELD_SEARCH_CONTENT],
        store: ['id', FIELD_SEARCH_TITLE, FIELD_SEARCH_CONTENT, FIELD_SEARCH_EXCERPT]
    }
});

async function init() {
    for (let blog of props.blogs) {
        let contentStr = String(await remark().use(strip).process(blog.body));
        contentStr = contentStr.replace(/\n/g, ' ');
        docSearch.add({ id: blog.id, title: blog.data.title, content: contentStr, excerpt: blog.data.excerpt });
    }
}

function handleSearch() {
    const result = docSearch.search(searchText.value, {
        highlight: {
            template: '<b>$1</b>',
            boundary: 150,
            ellipsis: '...'
        },
        enrich: true
    });
    titleResult.value = [];
    contentResult.value = [];
    for (const e of result) {
        if (e.field == FIELD_SEARCH_TITLE) {
            titleResult.value = e.result;
        } else if (e.field == FIELD_SEARCH_CONTENT) {
            contentResult.value = e.result;
        }
    }
}

init();
</script>

<template>
    <div class="mt-10">
        <div class="flex justify-center flex-wrap">
            <input class="border-black rounded-md border-2 max-w-[300px] w-full" v-model="searchText" @keyup.enter="handleSearch" />
            <button class="bg-[#4d90fe] hover:bg-[#357ae8] ml-5 rounded-md px-7" @click="handleSearch">
                <svg class="text-white" width="13" height="13" viewBox="0 0 13 13">
                    <title>搜索</title>
                    <path
                        fill="currentColor"
                        d="m4.8495 7.8226c0.82666 0 1.5262-0.29146 2.0985-0.87438 0.57232-0.58292 0.86378-1.2877 0.87438-2.1144 0.010599-0.82666-0.28086-1.5262-0.87438-2.0985-0.59352-0.57232-1.293-0.86378-2.0985-0.87438-0.8055-0.010599-1.5103 0.28086-2.1144 0.87438-0.60414 0.59352-0.8956 1.293-0.87438 2.0985 0.021197 0.8055 0.31266 1.5103 0.87438 2.1144 0.56172 0.60414 1.2665 0.8956 2.1144 0.87438zm4.4695 0.2115 3.681 3.6819-1.259 1.284-3.6817-3.7 0.0019784-0.69479-0.090043-0.098846c-0.87973 0.76087-1.92 1.1413-3.1207 1.1413-1.3553 0-2.5025-0.46363-3.4417-1.3909s-1.4088-2.0686-1.4088-3.4239c0-1.3553 0.4696-2.4966 1.4088-3.4239 0.9392-0.92727 2.0864-1.3969 3.4417-1.4088 1.3553-0.011889 2.4906 0.45771 3.406 1.4088 0.9154 0.95107 1.379 2.0924 1.3909 3.4239 0 1.2126-0.38043 2.2588-1.1413 3.1385l0.098834 0.090049z"
                    ></path>
                </svg>
            </button>
        </div>
        <div class="w-full max-w-[500px] mx-auto pt-8 wrap-break-word">
            <div class="mt-6 first:mt-0" v-for="(blog, _) in titleResult" :key="blog.id">
                <h2 class="text-lg">
                    <a class="text-base-green" v-html="blog.highlight" :href="`${BLOG_URL}/${blog.doc!.id}`"></a>
                </h2>
                <div>{{ blog.doc?.excerpt }}</div>
            </div>

            <div class="mt-6 first:mt-0" v-for="(blog, _) in contentResult" :key="blog.id">
                <h2 class="text-lg">
                    <a class="text-base-green" :href="`${BLOG_URL}/${blog.doc!.id}`">{{ blog.doc!.title }}</a>
                </h2>
                <div></div>
                <div v-html="blog.highlight"></div>
            </div>
        </div>
    </div>
</template>
