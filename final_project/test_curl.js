const fs = require('fs');
const axios = require('axios');

async function runTest(filename, curlCmd, method, url, data, headers) {
    let output = `${curlCmd}\n`;
    try {
        const config = { method, url, headers, data };
        const response = await axios(config);
        output += JSON.stringify(response.data) + '\n';
        if (response.headers['set-cookie']) {
            output += `Set-Cookie: ${response.headers['set-cookie']}\n`;
        }
    } catch (err) {
        if (err.response) {
            output += JSON.stringify(err.response.data) + '\n';
        } else {
            output += err.message + '\n';
        }
    }
    fs.writeFileSync(filename, output);
    console.log(`Created ${filename}`);
}

async function runAll() {
    await runTest('getallbooks.txt', 'curl http://localhost:5000/', 'GET', 'http://localhost:5000/');
    await runTest('getbooksbyISBN.txt', 'curl http://localhost:5000/isbn/1', 'GET', 'http://localhost:5000/isbn/1');
    await runTest('getbooksbyauthor.txt', 'curl http://localhost:5000/author/Jane%20Austen', 'GET', 'http://localhost:5000/author/Jane Austen');
    await runTest('getbooksbytitle.txt', 'curl http://localhost:5000/title/Things%20Fall%20Apart', 'GET', 'http://localhost:5000/title/Things Fall Apart');
    await runTest('getbookreview.txt', 'curl http://localhost:5000/review/1', 'GET', 'http://localhost:5000/review/1');
    await runTest('register.txt', 'curl -X POST -H "Content-Type: application/json" -d "{\\"username\\":\\"user1\\",\\"password\\":\\"pass1\\"}" http://localhost:5000/register', 'POST', 'http://localhost:5000/register', {username: 'user1', password: 'pass1'});
    
    // Login to get token
    let loginOutput = `curl -X POST -H "Content-Type: application/json" -d "{\\"username\\":\\"user1\\",\\"password\\":\\"pass1\\"}" http://localhost:5000/customer/login\n`;
    let cookie = '';
    try {
        const res = await axios.post('http://localhost:5000/customer/login', {username: 'user1', password: 'pass1'});
        loginOutput += res.data + '\n';
        cookie = res.headers['set-cookie'][0];
    } catch (err) {
        loginOutput += err.message + '\n';
    }
    fs.writeFileSync('login.txt', loginOutput);
    console.log('Created login.txt');

    // Add review
    let reviewCmd = `curl -X PUT -H "Cookie: ${cookie.split(';')[0]}" http://localhost:5000/customer/auth/review/1?review=Great!`;
    let reviewOutput = `${reviewCmd}\n`;
    try {
        const res = await axios.put('http://localhost:5000/customer/auth/review/1?review=Great!', null, {headers: {'Cookie': cookie}});
        reviewOutput += res.data + '\n';
    } catch (err) {
        reviewOutput += err.message + '\n';
    }
    fs.writeFileSync('reviewadded.txt', reviewOutput);
    console.log('Created reviewadded.txt');

    // Delete review
    let delCmd = `curl -X DELETE -H "Cookie: ${cookie.split(';')[0]}" http://localhost:5000/customer/auth/review/1`;
    let delOutput = `${delCmd}\n`;
    try {
        const res = await axios.delete('http://localhost:5000/customer/auth/review/1', {headers: {'Cookie': cookie}});
        delOutput += res.data + '\n';
    } catch (err) {
        delOutput += err.message + '\n';
    }
    fs.writeFileSync('deletereview.txt', delOutput);
    console.log('Created deletereview.txt');
}

runAll();
