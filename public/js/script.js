(function () {

    function uniqueId() {
        return new Date().getTime().toString();
    }

    function showThankYou() {
        var form = document.querySelector('.contact__form');
        var thu = document.querySelector('.thank__you');

        form.classList.toggle('hidden');
        thu.classList.toggle('hidden');
        form.reset();

        setTimeout(function () {
            setFormKey();
            form.classList.toggle('hidden');
            thu.classList.toggle('hidden');
        }, 3000);
    }

    function post(data) {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open("POST", "/save", true);
            request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            request.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(JSON.parse(request.responseText));
                } else {
                    reject(request.status + ': ' + request.statusText)
                }
            };
            request.onerror = function () {
                reject(request.status + ': ' + request.statusText)
            };
            request.send(data);
        });
    }

    function validate(data) {
        return data.phone || data.email;
    }

    function onFormSubmit(e) {
        console.log('form submition');
        e.preventDefault();

        var inputs = document.querySelectorAll('input');
        var data = {};

        if (location.search.indexOf('=slide') > -1) {
            data.from_slide = 1;
        }

        inputs.forEach(function (input) {
            var value = input.value;
            if (value && ('prefix' in input.dataset)) {
                value = input.dataset.prefix + input.value;
            }
            data[input.name] = value;
        });

        if (validate(data)) {
            var json = JSON.stringify(data);
            post(json)
                .catch(function () {
                    localStorage[data.key] = json;
                });

            try {
                yaCounter49947028.reachGoal('FORM_DATA', data);
            } catch (e) {
                console.warn('ym error', e.message);
            }

            showThankYou();
        }

        return false;
    }

    function setFormKey() {
        var key = document.querySelector('#form_key');
        key.value = 'form__' + uniqueId();
    }

    function onDomReady() {

        var form = document.querySelector('[data-js="js--contact-form-submit"]');

        form &&
        form.addEventListener('submit', onFormSubmit);

        setFormKey();

        console.log('Dom ready...');

        setTimeout(function () {
            var viewHeight = window.visualViewport.height;
            var viewWidth = window.visualViewport.width;
            var viewport = document.querySelector("meta[name=viewport]");
            viewport.setAttribute("content", "height=" + viewHeight + "px, width=" + viewWidth + "px, initial-scale=1.0, user-scalable=no");
        }, 300);

    }

    document.addEventListener('DOMContentLoaded', onDomReady);

    setInterval(function () {
        for ( var i = 0, len = localStorage.length; i < len; ++i ) {
            var key = localStorage.key(i);
            if (key.indexOf('form__') > -1) {
                var data = localStorage.getItem( key );
                post(data)
                    .then(function(response) {
                        localStorage.removeItem(response.key);
                    });
            }
        }
    }, 60 * 1000)
})();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker
            .register('/sw.js')
            .then(
                function (registration) {
                    // Registration was successful
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                },
                function (err) {
                    // registration failed :(
                    console.log('ServiceWorker registration failed: ', err);
                }
            );

        navigator.serviceWorker.addEventListener('message', function (evt) {
            var message = JSON.parse(evt.data);

            console.log('Service worker message ', message);

            if (message.type === 'refresh') {
                var pageRefresh = document.querySelector('.page__refresh');
                pageRefresh.classList.add('refresh--visible');

                pageRefresh.addEventListener('click', function () {
                    location.reload();
                });
            }
        })
    });
}

if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}
