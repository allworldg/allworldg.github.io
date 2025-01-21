---
title: custom neovim illuminate (highlight lsp reference)
excerpt: short description
publishDate: 2025-01-21T19:45:23+8:00
tags:
  - Guide
# seo:
# image:
#   src: '/post-11.jpg'
#   alt: A person standing at the window
---

Sometimes I find some astro configs don't use vim-illuminate (I only know this plugin) but can “illuminate” the reference. So I was curious about how to achieve this. After searching the keyword for a long time and learning, I finally came up with a simple and useless code (compare with some great plugins) , just for fun and want to use this approach to learn neovim.

```lua
  vim.api.nvim_create_autocmd('LspAttach', {
      desc = 'LSP actions',
      callback = function(event)
        local bufnr = event.buf        
        local client = vim.lsp.get_client_by_id(event.data.client_id)
        if client and client.server_capabilities.documentHighlightProvider
        then
          vim.api.nvim_create_augroup("lsp_document_hightlight", 
          { clear = true })
          vim.api.nvim_create_autocmd("CursorHold", {
            callback = function()
              vim.defer_fn(function()
                vim.lsp.buf.document_highlight()
              end, 100)
            end,
            buffer = bufnr,
            group = "lsp_document_hightlight",
            desc = "highlight lsp document highlight"
          })
          vim.api.nvim_create_autocmd("CursorMoved", {
            callback = function()
              vim.defer_fn(function()
                vim.lsp.buf.clear_references()
              end, 100)
            end,
            buffer = bufnr,
            group = "lsp_document_hightlight",
            desc = "clear lsp document hightlight"
          })
        end    
        ......
}
```