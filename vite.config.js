import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Pesquisa Eleitoral Itacoatiara',
        short_name: 'Pesquisa Eleitoral',
        description: 'Coleta e análise de intenção de voto em pesquisa eleitoral de rua em Itacoatiara-AM.',
        lang: 'pt-BR',
        start_url: '/coleta',
        scope: '/',
        display: 'standalone',
        background_color: '#f5f4f0',
        theme_color: '#0f6e56',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        // O gerador de planilhas (exceljs) é usado só pelo admin, em
        // Dados > Exportar/Importar — não precisa entrar no pré-cache que
        // todo mundo baixa ao instalar o app (isso incluiria o pesquisador,
        // que nunca usa essa parte). Fica de fora do precache e é buscado
        // (e cacheado) só na primeira vez que for realmente usado.
        globIgnores: ['**/exceljs*.js'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.includes('/assets/exceljs'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'exceljs-sob-demanda',
              expiration: { maxEntries: 2, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
})
