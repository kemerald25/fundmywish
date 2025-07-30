export default function handler(req, res) {
    const { path } = req.query;
    
    // Extract wish ID from path
    const pathParts = path.split('/');
    const isWishPage = pathParts[0] === 'wish';
    const wishId = isWishPage ? pathParts[1] : null;
    
    // Construct the full URL for this specific page
    const baseUrl = 'https://fundmywish.vercel.app';
    const fullPath = isWishPage ? `/wish/${wishId}` : '/';
    const frameUrl = `${baseUrl}${fullPath}`;
    
    // Create dynamic frame metadata
    const frameMetadata = {
      version: "next",
      imageUrl: `${baseUrl}/wish.png`,
      button: {
        title: isWishPage ? "Fund This Wish" : "Fund A Wish",
        action: {
          type: "launch_frame",
          name: "FundMyWish",
          url: frameUrl,
          splashImageUrl: `${baseUrl}/wish2.png`,
          splashBackgroundColor: "#ffffff"
        }
      }
    };
    
    const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta property="fc:frame" content='${JSON.stringify(frameMetadata)}' />
    <link rel="icon" href="/wish2.png" sizes="any" />
    <link rel="icon" href="/wish2.png" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/wish2.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="manifest" href="/manifest.json" />
    <title>${isWishPage ? `Wish ${wishId}` : 'FundMyWish'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              'base-blue': '#0052FF',
              'base-blue-dark': '#003ebf',
              'brand-dark': '#1a1a1a',
              'brand-light': '#2a2a2a',
            }
          }
        }
      }
    </script>
    <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@^19.1.1",
          "react/": "https://esm.sh/react@^19.1.1/",
          "react-dom/": "https://esm.sh/react-dom@^19.1.1/",
          "@base-org/account": "https://esm.sh/@base-org/account@2.0.0",
          "@farcaster/miniapp-sdk": "https://esm.sh/@farcaster/miniapp-sdk",
          "firebase/": "https://esm.sh/firebase@10.12.2/",
          "@coinbase/": "https://esm.sh/@coinbase/onchainkit/minikit"
        }
      }
    </script>
    <link rel="stylesheet" href="/index.css">
  </head>
  <body class="bg-brand-dark text-gray-100 font-sans">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
  </html>`;
  
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  }