<script setup lang="ts">
import type { CollectionEntry, SearchEntry } from '../types';
import { BLOG_URL } from '../constants';
import { computed, ref, watch } from 'vue';
import { Document, Index, type EnrichedDocumentSearchResults, type EnrichedResults } from 'flexsearch';
import { idText } from 'typescript';
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
            boundary: 200,
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
    <div>
        <input class="border-black border-2" v-model="searchText" />
        <button @click="handleSearch">search</button>
    </div>
    <div>
        <div v-for="(blog, _) in titleResult" :key="blog.id">
            <a v-html="blog.highlight" class="" :href="`${BLOG_URL}/${blog.doc!.id}`"></a>
            <div>{{ blog.doc?.excerpt }}</div>
        </div>

        <div v-for="(blog, index) in contentResult" :key="blog.id">
            <a class="" :href="`${BLOG_URL}/${blog.doc!.id}`">{{ blog.doc!.title }}</a>
            <div></div>
            <div v-html="blog.highlight"></div>
        </div>
    </div>
</template>
