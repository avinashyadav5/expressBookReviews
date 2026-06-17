const fs = require('fs');
const axios = require('axios');

async function run() {
    const cmd = `curl -s https://api.github.com/repos/avinashyadav5/expressBookReviews | jq '.parent.full_name'`;
    let output = `${cmd}\n`;
    try {
        const response = await axios.get('https://api.github.com/repos/avinashyadav5/expressBookReviews');
        const parentFullName = response.data.parent ? response.data.parent.full_name : null;
        output += JSON.stringify(parentFullName) + '\n';
    } catch (err) {
        output += err.message + '\n';
    }
    fs.writeFileSync('githubrepo', output);
    console.log('Created githubrepo');
    console.log(output);
}

run();
