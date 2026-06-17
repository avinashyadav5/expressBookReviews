const fs = require('fs');
const axios = require('axios');

async function runAll() {
    // Register user first
    await axios.post('http://localhost:5000/register', {username: 'user1', password: 'pass1'}).catch(()=>{});

    // Login to get session cookie
    let cookie = '';
    let loginOutput = `curl -X POST -H "Content-Type: application/json" -d "{\\"username\\":\\"user1\\",\\"password\\":\\"pass1\\"}" http://localhost:5000/customer/login\n`;
    try {
        const res = await axios.post('http://localhost:5000/customer/login', {username: 'user1', password: 'pass1'});
        loginOutput += res.data + '\n';
        cookie = res.headers['set-cookie'][0];
    } catch (err) {
        loginOutput += err.message + '\n';
    }
    fs.writeFileSync('login', loginOutput);
    console.log('login:', loginOutput);

    // Add review with ?review= in URL
    const reviewUrl = 'http://localhost:5000/customer/auth/review/1?review=Great book!';
    let reviewCmd = `curl -X PUT -H "Cookie: ${cookie.split(';')[0]}" "${reviewUrl}"`;
    let reviewOutput = `${reviewCmd}\n`;
    try {
        const res = await axios.put(reviewUrl, null, {headers: {'Cookie': cookie}});
        reviewOutput += JSON.stringify(res.data) + '\n';
    } catch (err) {
        reviewOutput += err.message + '\n';
    }
    fs.writeFileSync('reviewadded', reviewOutput);
    console.log('reviewadded:', reviewOutput);

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
    console.log('deletereview:', delOutput);
}

runAll();
