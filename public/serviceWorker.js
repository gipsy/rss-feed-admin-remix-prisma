self.addEventListener('install', () => {
  console.log('service worker installed')
});

self.addEventListener('activate', () => {
  console.log('service worker activated')
});

self.addEventListener("fetch", (event) => {
  console.log('Inside the fetch handler:', event);
  let url = new URL(event.request.url);
  let method = event.request.method;
  console.log('method', method)

  // any non GET request is ignored
  if (method.toLowerCase() !== "get") return;
  console.log('url',url)

  // If the request is for the favicons, fonts, or the built files (which are hashed in the name)
  if (
    url.pathname.startsWith("/favicons/") ||
    url.pathname.startsWith("/fonts/") ||
    url.pathname.startsWith("/build/")
  ) {
    event.respondWith(
      // we will open the assets cache
      caches.open("assets").then(async (cache) => {
        // if the request is cached we will use the cache
        let cacheResponse = await cache.match(event.request);
        if (cacheResponse) return cacheResponse;

        // if it's not cached we will run the fetch, cache it and return it
        // this way the next time this asset it's needed it will load from the cache
        let fetchResponse = await fetch(event.request);
        cache.put(event.request, fetchResponse.clone());

        return fetchResponse;
      })
    );
  }

  // if (url.pathname.startsWith("/home")) {
  //   event.respondWith(
  //     caches.match(event.request).then((cacheRes) => {
  //       if (cacheRes == undefined) {
  //         console.log(`MISSING ${event.request.url}`);
  //       }
  //       return cacheRes ||
  //         fetch(event.request).then((fetchResponse) => {
  //           let type = fetchResponse.headers.get( 'content-type' );
  //           if (type && type.match(/^application\/json/i)) {
  //             return caches.open( 'dynamicCache' ).then( ( cache ) => {
  //               cache.put( event.request, fetchResponse.clone() );
  //               return fetchResponse;
  //             } );
  //           }
  //         })
  //     })
  //   )
  // }

  return;
});
