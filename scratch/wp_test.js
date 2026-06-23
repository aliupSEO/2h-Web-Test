const username = 'hartleb@2hws.at';
const password = '9dzk Jyhh RdZ2 DMLs UzFf AvF6';
const url = 'https://silvioh23.sg-host.com/wp-json/wp/v2/pages?slug=home';

fetch(url, {
    headers: {
        'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
    }
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(err => console.error(err));
