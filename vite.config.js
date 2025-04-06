export default {
  server: {
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  publicDir: 'public',
  plugins: [
    {
      name: 'copy-json-files',
      async buildStart() {
        const fs = await import('fs/promises');
        const jsonContent = await fs.readFile('./src/search-engines.json', 'utf-8');
        this.emitFile({
          type: 'asset',
          fileName: 'search-engines.json',
          source: jsonContent
        });
      }
    }
  ]
} 