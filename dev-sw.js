(global => {
  'use strict';

  // Load the sw-tookbox library.
  importScripts('./node_modules/sw-toolbox/sw-toolbox.js');

  // Turn on debug logging, visible in the Developer Tools' console.
  global.toolbox.options.debug = true;

  toolbox.precache([ './index.html',                        
                     './js/jquery-1.9.1.min.js',
                     './js/bootstrap.min.js',
                     './styles/bootstrap.min.css',
                     './styles/styles.css',                     
                     './js/app.js'                     
                     ]);

  // The route for the images
  toolbox.router.get('./images/(.*)', global.toolbox.cacheFirst, {
    cache: {
          name: 'jpg',
          maxEntries: 100,
          maxAgeSeconds: 86400 // cache for a day
        }
  });   
  
  toolbox.router.get('./css/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'stylesheets',
      maxEntries: 5,
      maxAgeSeconds: 604800
    },    
  });

  toolbox.router.get('./js/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'scripts',
      maxEntries: 5,
      maxAgeSeconds: 604800
    },    
  });

  toolbox.router.get('./data/(.*)', global.toolbox.cacheFirst, {
    cache: {
          name: 'data',
          maxEntries: 100,
          maxAgeSeconds: 86400 // cache for a day
        }
  }); 
    
  // By default, all requests that don't match our custom handler will use the toolbox.networkFirst
  // cache strategy, and their responses will be stored in the default cache.
  global.toolbox.router.default = global.toolbox.cacheFirst;

  // Boilerplate to ensure our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
})(self);

// this.addEventListener('fetch', event => {
//   // request.mode = navigate isn't supported in all browsers
//   // so include a check for Accept: text/html header.
//   if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
//         event.respondWith(
//           fetch(event.request.url).catch(error => {
//               var cachedFile = getFilenameFromUrl(event.request.url);
//               // Return the offline page
//               return caches.match(cachedFile);
//           })
//     );
//   }
// });

// this.addEventListener('fetch', function(event) {
//   console.log(event.request.url);

//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       return response || fetch(event.request);
//     })
//   );
// });


this.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function(res){
            if(res){
                return res;
            }
            requestBackend(event);
        })
    )
});

function requestBackend(event){
    var url = event.request.clone();
    return fetch(url).then(function(res){
        //if not a valid response send the error
        if(!res || res.status !== 200 || res.type !== 'basic'){
            return res;
        }

        var response = res.clone();

        caches.open(CACHE_VERSION).then(function(cache){
            cache.put(event.request, response);
        });

        return res;
    })
}


function getFilenameFromUrl(path){
    path = path.substring(path.lastIndexOf("/")+ 1);
    return (path.match(/[^.]+(\.[^?#]+)?/) || [])[0];
}