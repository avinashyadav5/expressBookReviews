const fs = require('fs');
const axios = require('axios');

async function run() {
    // Step 1: Register
    await axios.post('http://localhost:5000/register', {username: 'user1', password: 'pass1'}).catch(()=>{});

    // Step 2: Get all books
    try {
        const res = await axios.get('http://localhost:5000/');
        const out = `curl http://localhost:5000/\n${JSON.stringify(res.data)}\n`;
        fs.writeFileSync('getallbooks', out);
        console.log('getallbooks done');
    } catch(e) { console.log('getallbooks error:', e.message); }

    // Step 3: Get book by ISBN
    try {
        const res = await axios.get('http://localhost:5000/isbn/1');
        const out = `curl http://localhost:5000/isbn/1\n${JSON.stringify(res.data)}\n`;
        fs.writeFileSync('getbooksbyISBN', out);
        console.log('getbooksbyISBN done');
    } catch(e) { console.log('getbooksbyISBN error:', e.message); }

    // Step 4: Get books by author
    try {
        const res = await axios.get('http://localhost:5000/author/Jane%20Austen');
        const out = `curl http://localhost:5000/author/Jane%20Austen\n${JSON.stringify(res.data)}\n`;
        fs.writeFileSync('getbooksbyauthor', out);
        console.log('getbooksbyauthor done');
    } catch(e) { console.log('getbooksbyauthor error:', e.message); }

    // Step 5: Get books by title
    try {
        const res = await axios.get('http://localhost:5000/title/Things%20Fall%20Apart');
        const out = `curl http://localhost:5000/title/Things%20Fall%20Apart\n${JSON.stringify(res.data)}\n`;
        fs.writeFileSync('getbooksbytitle', out);
        console.log('getbooksbytitle done');
    } catch(e) { console.log('getbooksbytitle error:', e.message); }

    // Step 6: Get book review
    try {
        const res = await axios.get('http://localhost:5000/review/1');
        const out = `curl http://localhost:5000/review/1\n${JSON.stringify(res.data)}\n`;
        fs.writeFileSync('getbookreview', out);
        console.log('getbookreview done');
    } catch(e) { console.log('getbookreview error:', e.message); }

    // Step 7: Register user
    try {
        const res = await axios.post('http://localhost:5000/register', {username: 'user2', password: 'pass2'});
        const out = `curl -X POST -H "Content-Type: application/json" -d "{\\"username\\":\\"user2\\",\\"password\\":\\"pass2\\"}" http://localhost:5000/register\n${JSON.stringify(res.data)}\n`;
        fs.writeFileSync('register', out);
        console.log('register done');
    } catch(e) { console.log('register error:', e.message); }

    // Step 8: Login
    let cookie = '';
    let loginUsername = 'user1';
    try {
        const res = await axios.post('http://localhost:5000/customer/login', {username: 'user1', password: 'pass1'});
        cookie = res.headers['set-cookie'][0];
        const out = `curl -X POST -H "Content-Type: application/json" -d "{\\"username\\":\\"user1\\",\\"password\\":\\"pass1\\"}" http://localhost:5000/customer/login\n${res.data}\n`;
        fs.writeFileSync('login', out);
        console.log('login done, cookie:', cookie.split(';')[0]);
    } catch(e) { console.log('login error:', e.message); }

    // Step 9: Add review
    try {
        const reviewUrl = 'http://localhost:5000/customer/auth/review/1?review=Excellent';
        const res = await axios.put(reviewUrl, {}, {headers: {'Cookie': cookie}});
        const cookieShort = cookie.split(';')[0];
        const out = `curl -X PUT -H "Cookie: ${cookieShort}" "${reviewUrl}"\n${res.data}\n`;
        fs.writeFileSync('reviewadded', out);
        console.log('reviewadded:', res.data);
    } catch(e) { console.log('reviewadded error:', e.message); }

    // Step 10: Delete review
    try {
        const deleteUrl = 'http://localhost:5000/customer/auth/review/1';
        const res = await axios.delete(deleteUrl, {headers: {'Cookie': cookie}});
        const cookieShort = cookie.split(';')[0];
        const out = `curl -X DELETE -H "Cookie: ${cookieShort}" "${deleteUrl}"\n${res.data}\n`;
        fs.writeFileSync('deletereview', out);
        console.log('deletereview:', res.data);
    } catch(e) { console.log('deletereview error:', e.message); }
}

run();
