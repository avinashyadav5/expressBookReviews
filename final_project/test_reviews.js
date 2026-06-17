const fs = require('fs');
const axios = require('axios');

async function runAll() {
    // Register user first
    await axios.post('http://localhost:5000/register', {username: 'user1', password: 'pass1'}).catch(()=>{});

    // Login to get session cookie
    let cookie = '';
    try {
        const res = await axios.post('http://localhost:5000/customer/login', {username: 'user1', password: 'pass1'});
        cookie = res.headers['set-cookie'][0];
    } catch (err) {
        console.log('Login error:', err.message);
    }

    // Add review - NO spaces in review text
    const reviewValue = 'Excellent';
    const reviewUrl = `http://localhost:5000/customer/auth/review/1?review=${reviewValue}`;
    let reviewCmd = `curl -X PUT -H "Cookie: ${cookie.split(';')[0]}" "${reviewUrl}"`;
    let reviewOutput = `${reviewCmd}\n`;
    try {
        const res = await axios.put(reviewUrl, null, {headers: {'Cookie': cookie}});
        reviewOutput += JSON.stringify(res.data) + '\n';
    } catch (err) {
        reviewOutput += err.message + '\n';
    }
    fs.writeFileSync('reviewadded', reviewOutput);
    console.log('reviewadded:\n', reviewOutput);

    // Delete review
    const deleteUrl = 'http://localhost:5000/customer/auth/review/1';
    let delCmd = `curl -X DELETE -H "Cookie: ${cookie.split(';')[0]}" "${deleteUrl}"`;
    let delOutput = `${delCmd}\n`;
    try {
        const res = await axios.delete(deleteUrl, {headers: {'Cookie': cookie}});
        delOutput += JSON.stringify(res.data) + '\n';
    } catch (err) {
        delOutput += err.message + '\n';
    }
    fs.writeFileSync('deletereview', delOutput);
    console.log('deletereview:\n', delOutput);
}

runAll();
