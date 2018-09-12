//This is the service worker with the Cache-first network

var cacheName = 'sipuni-crmday-nizhni-v1';
var files = [
    'https://fonts.googleapis.com/css?family=PT+Sans',
    'img/icons/apple-touch-icon.png',
    'img/icons/favicon.ico',
    'img/icons/favicon-32x32.png',
    'img/icons/favicon-16x16.png',
    'img/75.jpg',
    'img/logo.svg',
    'img/send.svg',
    'css/style.css',
    'js/script.js'
];

var noCache = [ '/check', '/save' , 'chrome-extension', 'yandex'];

self.addEventListener('install', function(event) {
    console.info('[ServiceWorker] Event: Install');

    event.waitUntil(
        caches.open(cacheName)
            .then(function(cache) {
                //[] of files to cache & if any of the file not present `addAll` will fail
                return cache.addAll(files)
                    .then(function() {
                        console.info('[ServiceWorker] All files are cached');
                        return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
                    })
                    .catch(function (error) {
                        console.error('[ServiceWorker] Failed to cache', error);
                    })
            })
    );
});

self.addEventListener('fetch', function(event) {
    var request = event.request;

    var stopCache = noCache.filter(function(url) {
        return request.url.indexOf(url) > -1
    });

    if (stopCache.length > 0) {
        return;
    }

    //Tell the browser to wait for newtwork request and respond with below
    event.respondWith(
        //If request is already in cache, return it
        caches.match(request).then(function(cache) {
            console.info('[ServiceWorker] Event: Fetch - ', request.url);

            if (cache) {
                return cache;
            }

            console.info('[ServiceWorker] Event: Fetch from server - ', request.url);

            var requestClone = request.clone();

            //if request is not cached, add it to cache
            return fetch(requestClone).then(function(response) {

                if (!response) {
                    console.log('[ServiceWorker] Event: Fetch - empty response from server');
                    return response;
                }

                var responseClone = response.clone();

                return caches
                    .open(cacheName)
                    .then(function (cache) {
                        return cache
                            .put(request, responseClone)
                            .then(function () {
                                return response;
                            })
                            .catch(function(err) {
                                console.warn(request.url + ': ' + err.message);
                            });
                    });
            });
        })
    );
});

/*
  ACTIVATE EVENT: triggered once after registering, also used to clean up caches.
*/

//Adding `activate` event listener
self.addEventListener('activate', function(event) {
    console.info('[ServiceWorker] Event: Activate');

    //Remove old and unwanted caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map((cache) => {
                if (cache !== cacheName) {//cacheName = 'cache-v1'
                    console.log('deleting cache: ', cache);
                    return caches.delete(cache); //Deleting the cache
                }
            }));
        }).then(() => {
            console.log('[ServiceWorker] Claiming clients for version', cacheName);
            self.clients.matchAll().then(function (clients) {
                clients.forEach(function (client) {
                    client.postMessage(JSON.stringify({type: 'refresh'}));
                })
            });
            return self.clients.claim();
        })
    );
});