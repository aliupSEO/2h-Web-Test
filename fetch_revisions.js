const username = 'hartleb@2hws.at';
const password = '9dzk Jyhh RdZ2 DMLs UzFf AvF6';
const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');

fetch('https://silvioh23.sg-host.com/wp-json/wp/v2/pages/212/revisions', {
  headers: {
    'Authorization': `Basic ${encodedCredentials}`
  }
})
.then(res => res.json())
.then(data => {
  if (data && data.length > 0) {
    console.log('Revisions found:', data.length);
    console.log('Latest revision ID:', data[0].id);
    if (data[1]) {
      console.log('Original content length:', data[1].content.rendered.length);
      require('fs').writeFileSync('original_content.html', data[1].content.rendered);
      console.log('Saved original_content.html');
    }
  } else {
    console.log('No revisions found or error:', data);
  }
})
.catch(console.error);
