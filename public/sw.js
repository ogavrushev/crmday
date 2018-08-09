//This is the service worker with the Cache-first network

const cacheName = 'sipuni-crmday-precache-v21';
let files = [
    'img/icons/apple-touch-icon.png',
    'img/icons/favicon.ico',
    'img/icons/favicon-32x32.png',
    'img/icons/favicon-16x16.png',
    'img/75.jpg',
    'img/logo.svg',
    'img/send.svg',
    'css/style.css?v21',
    'js/script.js'
];

const noCache = [ '/check', '/save' , 'chrome-extension'];


self.addEventListener('install', (event) => {
    console.info('Event: Install');

    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                //[] of files to cache & if any of the file not present `addAll` will fail
                return cache.addAll(files)
                    .then(() => {
                        console.info('All files are cached');
                        return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
                    })
                    .catch((error) =>  {
                        console.error('Failed to cache', error);
                    })
            })
    );
});


self.addEventListener('fetch', (event) => {
    let request = event.request;

    let stopCache = noCache.filter(url => request.url.indexOf(url) > -1);

    if (stopCache.length > 0) {
        return;
    }

    //Tell the browser to wait for newtwork request and respond with below
    event.respondWith(
        //If request is already in cache, return it
        caches.match(request).then((response) => {
            console.info('Event: Fetch - ', request.url);

            if (response) {
                return response;
            }

            console.info('Event: Fetch from server - ', request.url);

            //if request is not cached, add it to cache
            return fetch(request).then((response) => {
                let responseToCache = response.clone();
                caches.open(cacheName).then((cache) => {
                    cache.put(request, responseToCache).catch((err) => {
                        console.warn(request.url + ': ' + err.message);
                    });
                });

                return response;
            });
        })
    );
});

/*
  ACTIVATE EVENT: triggered once after registering, also used to clean up caches.
*/

//Adding `activate` event listener
self.addEventListener('activate', (event) => {
    console.info('Event: Activate');

    //Remove old and unwanted caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {     //cacheName = 'cache-v1'
                        return caches.delete(cache); //Deleting the cache
                    }
                })
            );
        })
    );
});


//
// //Install stage sets up the cache-array to configure pre-cache content
// self.addEventListener('install', function(evt) {
//     console.log('The service worker is being installed.');
//     evt.waitUntil(precache().then(function() {
//         console.log('Skip waiting on install');
//         return self.skipWaiting();
//     }));
// });
//
//
// //allow sw to control of current page
// self.addEventListener('activate', function(event) {
//     console.log('Claiming clients for current page');
//     return self.clients.claim();
// });
//
// self.addEventListener('fetch', function(evt) {
//     let stopCache = noCache.filter(url => evt.request.url.indexOf(url) > -1);
//
//     if (stopCache.length > 0) {
//         return;
//     }
//
//     if (evt.request.url.indexOf(location.host) > -1) {
//         console.log('The service worker is serving the asset.'+ evt.request.url);
//         evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
//         evt.waitUntil(update(evt.request));
//     }
// });
//
//
// function precache() {
//     return caches.open(CACHE).then(function (cache) {
//         return cache.addAll(precacheFiles);
//     });
// }
//
// function fromCache(request) {
//     //we pull files from the cache first thing so we can show them fast
//     return caches.open(CACHE).then(function (cache) {
//         return cache.match(request).then(function (matching) {
//             return matching || Promise.reject('no-match');
//         });
//     });
// }
//
// function update(request) {
//     //this is where we call the server to get the newest version of the
//     //file to use the next time we show view
//     return caches.open(CACHE).then(function (cache) {
//         return fetch(request).then(function (response) {
//             return cache.put(request, response);
//         }).catch(err => {
//             console.log('sw update failed', err.message);
//         });
//     });
// }
//
// function fromServer(request) {
//     //this is the fallback if it is not in the cache to go to the server and get it
//     return fetch(request)
//         .then(function(response) {
//             return response;
//         })
//         .catch(err => {
//             return Promise.reject(err.message);
//         });
// }
