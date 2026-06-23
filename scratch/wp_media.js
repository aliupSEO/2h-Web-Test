const username = 'hartleb@2hws.at';
const password = '9dzk Jyhh RdZ2 DMLs UzFf AvF6';
const url = 'https://silvioh23.sg-host.com/wp-json/wp/v2/media?per_page=100';

fetch(url, {
    headers: {
        'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
    }
})
.then(res => res.json())
.then(data => {
    if (Array.isArray(data)) {
        console.log("Media:");
        data.forEach(m => console.log(`ID: ${m.id}, Title: ${m.title.rendered}, URL: ${m.source_url}`));
    } else {
        console.log(data);
    }
})
.catch(err => console.error(err));
