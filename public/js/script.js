(() => {

    const KEY = uniqueId();

    function uniqueId() {
        return Math.round((Math.random() * 36 ** 12)).toString(36);
    }

    function showThankYou() {
        let form = document.querySelector('.contact__form');
        let thu = document.querySelector('.thank__you');

        form.classList.toggle('hidden');
        thu.classList.toggle('hidden');
        form.reset();

        setTimeout(() => {
            location.reload(true);
        }, 3000);
    }

    function post(data) {
        localStorage.KEY = data;

        const request = new XMLHttpRequest();
        request.open("POST", "/save", true);
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.onreadystatechange = () => {
            if (request.readyState !== request.DONE) {
                console.log('Not done');
                return;
            }

            if (request.status !== 200) {
                console.log(request.status + ': ' + request.statusText);
            } else {
                localStorage.removeItem(KEY);
                console.log(request.responseText);
            }
        };

        request.send(data);
        showThankYou();
    }

    function sendContacts(data) {
        let dataJSON = {};

        data.forEach(function(value, key){
            dataJSON[key] = value;
        });

        post(JSON.stringify(dataJSON));
    }

    function validate(data) {
        let requiredFields = ['contact'].filter(field => {
            return data.has(field) && data.get(field);
        });

        return requiredFields.length !== 0;
    }

    function onFormSubmit (e) {
        console.log('form submition');
        e.preventDefault();

        let data = new FormData(this);

        if (validate(data)) {
            sendContacts(data);
        }

        return false;
    }

    function onDomReady() {

        let form = document.querySelector('[data-js="js--contact-form-submit"]');
        let key = document.querySelector('#form_key');
        key.value = KEY;

        form &&
            form.addEventListener('submit', onFormSubmit);

        console.log('Dom ready...');

        setTimeout(function () {
            let viewHeight = window.visualViewport.height;
            let viewWidth = window.visualViewport.width;
            let viewport = document.querySelector("meta[name=viewport]");
            viewport.setAttribute("content", "height=" + viewHeight + "px, width=" + viewWidth + "px, initial-scale=1.0, user-scalable=no");
        }, 300);

    }

    document.addEventListener('DOMContentLoaded', onDomReady);
})();


if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker
            .register('/sw.js')
            .then(
                function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                },
                function(err) {
                    // registration failed :(
                    console.log('ServiceWorker registration failed: ', err);
                }
            );
    });
}
