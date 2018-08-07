(() => {

    function sendContacts(data) {
        const request = new XMLHttpRequest();
        request.open("POST", "/save", true);
        request.send(data);

        request.onreadystatechange = () => {
            if (request.readyState !== request.DONE) {
                console.log('Not done');
                return;
            }

            if (request.status !== 200) {
                console.log(request.status + ': ' + request.statusText);
            } else {
                console.log(request.responseText);
            }
        };

        console.log('form send');
    }

    function validate(data) {
        let requiredFields = ['email', 'phone'].filter(field => {
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
        } else {
            console.log('Not passed validation');
            //todo show error
        }

        return false;
    }

    function onDomReady() {

        let form = document.querySelector('[data-js="js--contact-form-submit"]');

        form &&
            form.addEventListener('submit', onFormSubmit);

        console.log('Dom ready...');

    }

    document.addEventListener('DOMContentLoaded', onDomReady);
})();


