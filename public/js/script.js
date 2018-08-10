(function () {

    function uniqueId() {
        return new Date().getUTCMilliseconds();
    }

    var KEY = uniqueId();

    function showThankYou() {
        var form = document.querySelector('.contact__form');
        var thu = document.querySelector('.thank__you');

        form.classList.toggle('hidden');
        thu.classList.toggle('hidden');
        form.reset();

        setTimeout(function () {
            location.reload(true);
        }, 3000);
    }

    function post(data) {
        localStorage.KEY = data;

        alert('start post');

        var request = new XMLHttpRequest();
        request.open("POST", "/save", true);
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.onreadystatechange = function () {
            if (request.readyState !== request.DONE) {
                console.log('Not done');
                return;
            }

            if (request.status !== 200) {
                alert(request.status + ': ' + request.statusText);
                console.log(request.status + ': ' + request.statusText);
            } else {
                alert('post completed');
                localStorage.removeItem(KEY);
                console.log(request.responseText);
            }
        };

        request.send(data);
        showThankYou();
    }


    function validate(data) {
        return !!data.contact;
    }

    function onFormSubmit(e) {
        console.log('form submition');
        e.preventDefault();

        var inputs = document.querySelectorAll('input');
        var data = {};

        inputs.forEach(function (input) {
            data[input.name] = input.value;
        });

        if (validate(data)) {
            post(JSON.stringify(data));
        }

        return false;
    }

    function onDomReady() {

        var form = document.querySelector('[data-js="js--contact-form-submit"]');
        var key = document.querySelector('#form_key');
        key.value = KEY;

        form &&
        form.addEventListener('submit', onFormSubmit);

        console.log('Dom ready...');

        setTimeout(function () {
            var viewHeight = window.visualViewport.height;
            var viewWidth = window.visualViewport.width;
            var viewport = document.querySelector("meta[name=viewport]");
            viewport.setAttribute("content", "height=" + viewHeight + "px, width=" + viewWidth + "px, initial-scale=1.0, user-scalable=no");
        }, 300);

    }

    document.addEventListener('DOMContentLoaded', onDomReady);
})();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker
            .register('/sw.js')
            .then(
                function (registration) {
                    // Registration was successful
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    registration.unregister().then(function () {
                        alert('unregistered');
                    }).catch(function(err) {
                        alert('unregister failed' + err.message);
                    })
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
