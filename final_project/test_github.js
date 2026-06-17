const fs = require('fs');
const axios = require('axios');

async function runTest() {
    let output = `curl -s https://api.github.com/repos/avinashyadav5/expressBookReviews\n`;
    try {
        const response = await axios.get('https://api.github.com/repos/avinashyadav5/expressBookReviews');
        output += JSON.stringify(response.data) + '\n';
    } catch (err) {
        if (err.response) {
            output += JSON.stringify(err.response.data) + '\n';
        } else {
            output += err.message + '\n';
        }
    }
    fs.writeFileSync('githubrepo', output);
    console.log(`Created githubrepo`);
}

runTest();
