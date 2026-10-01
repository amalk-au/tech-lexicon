# Vercel

- Setting for React Apps so routing is handled correctly as a single page application (SPA) Vercel: You need to add a vercel.json file at the root of your project and copy the following configuration. Similar to Netlify, this redirects all routes to the index page and lets react-router-dom handle the rest. More information can be found here at the Vercel documentation for SPAs and Vite. { "rewrites": [ { "source": "/(.*)", "destination": "/index.html" } ] }

[Back to Main Index](/topics-index.md)