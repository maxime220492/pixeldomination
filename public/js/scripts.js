// Initialize Netlify Identity
netlifyIdentity.init();

// Function to update user data
const updateUserData = async (userData) => {
    const response = await fetch('/.netlify/functions/updateUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
};

// Function to get user data
const getUserData = async (userId) => {
    const response = await fetch('/.netlify/functions/getUserData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId }),
    });
    const data = await response.json();
    return data;
};

// Function to calculate experience needed for next level
const expForNextLevel = (level) => {
    return Math.floor(100 * Math.pow(1.2, level - 1));
};

// Function to handle user login
const handleUserLogin = async (user) => {
    let userData = await getUserData(user.id);
    if (!userData) {
        userData = {
            id: user.id,
            email: user.email,
            level: 1,
            experience: 0,
            badges: [],
        };
        await updateUserData(userData);
    }

    document.getElementById('welcome-message').innerText = `Welcome, ${user.user_metadata.full_name || user.email}`;
    document.getElementById('user-level').innerText = userData.level;
    document.getElementById('user-experience').innerText = userData.experience;
    const progress = (userData.experience / expForNextLevel(userData.level)) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
    document.getElementById('user-badges').innerText = userData.badges.join(', ') || 'None';

    userInfo.style.display = 'block';
    loginLinks.style.display = 'none';
};
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Netlify Identity
    if (window.netlifyIdentity) {
        window.netlifyIdentity.on('init', user => {
            if (user) {
                handleLogin(user);
            }
        });
    }

    // Radix Wallet login (assuming you have an implementation for Radix Wallet)
    document.getElementById('radix-login').addEventListener('click', function(event) {
        event.preventDefault();
        // Implement Radix login logic here
        // On successful login, call handleLogin(user)
    });

    // Google login
    document.getElementById('google-login').addEventListener('click', function(event) {
        event.preventDefault();
        netlifyIdentity.open('login');
    });

    // Logout
    document.getElementById('logout-button').addEventListener('click', function() {
        netlifyIdentity.logout();
    });

    function handleLogin(user) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('welcome-message').textContent = `Welcome, ${user.user_metadata.full_name}`;
        // Fetch user data and update UI
        fetchUserData(user);
    }

    async function fetchUserData(user) {
        const response = await fetch('/.netlify/functions/getUserData', {
            method: 'POST',
            body: JSON.stringify({ userId: user.id })
        });
        const data = await response.json();
        document.getElementById('user-level').textContent = data.level;
        document.getElementById('user-experience').textContent = data.experience;
        document.getElementById('progress').style.width = `${data.experience % 100}%`;
        document.getElementById('user-badges').textContent = data.badges.join(', ') || 'None';
    }

    // Function to create a clan
    document.getElementById('create-clan-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const name = document.getElementById('clan-name').value;
        const description = document.getElementById('clan-description').value;
        const status = document.getElementById('clan-status').value;

        const response = await fetch('/.netlify/functions/createClan', {
            method: 'POST',
            body: JSON.stringify({ name, description, status })
        });
        const result = await response.json();
        alert('Clan created successfully!');
        fetchClans();
    });

    // Function to join a clan
    document.getElementById('join-clan-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const clanCode = document.getElementById('clan-code').value;

        const response = await fetch('/.netlify/functions/joinClan', {
            method: 'POST',
            body: JSON.stringify({ clanCode })
        });
        const result = await response.json();
        alert('Joined clan successfully!');
    });

    // Function to fetch and display clans
    async function fetchClans() {
        const response = await fetch('/.netlify/functions/getClans');
        const clans = await response.json();

        const clanList = document.getElementById('clan-list');
        clanList.innerHTML = '';
        clans.forEach(clan => {
            const listItem = document.createElement('li');
            listItem.textContent = `${clan.name} - ${clan.description} (${clan.status})`;
            clanList.appendChild(listItem);
        });
    }

    // Fetch clans on page load
    fetchClans();
});


// Check if the user is logged in
const user = netlifyIdentity.currentUser();
const userInfo = document.getElementById('user-info');
const loginSection = document.getElementById('login-section');
const loginLinks = document.querySelector('.links');

if (user) {
    handleUserLogin(user);
} else {
    userInfo.style.display = 'none';
    loginLinks.style.display = 'block';
}

// Add event listener to Google login button
document.getElementById('google-login').addEventListener('click', () => {
    netlifyIdentity.open('login');
});

// Listen for login event
netlifyIdentity.on('login', user => {
    handleUserLogin(user);
});

// Listen for logout event
netlifyIdentity.on('logout', () => {
    userInfo.style.display = 'none';
    loginLinks.style.display = 'block';
});

// Radix DLT Wallet Login
document.getElementById('radix-login').addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const wallet = await RadixDLT.wallet();
        await wallet.connect();

        const account = await wallet.getAccount();
        document.getElementById('welcome-message').innerText = `Wallet Address: ${account.address}`;
        document.getElementById('user-level').innerText = '1';
        document.getElementById('user-experience').innerText = '0';
        document.getElementById('progress').style.width = '10%';
        document.getElementById('user-badges').innerText = 'None';

        userInfo.style.display = 'block';
        loginLinks.style.display = 'none';
    } catch (error) {
        console.error('Radix DLT login failed:', error);
    }
});

// Add event listener to logout button
document.getElementById('logout-button').addEventListener('click', () => {
    netlifyIdentity.logout();
    window.location.href = 'index.html';
});

// Function to fetch clans
const fetchClans = async () => {
    const response = await fetch('/.netlify/functions/getClans');
    const data = await response.json();
    data.forEach(clan => addClanToList(clan));
};

// Function to add clan to list
const addClanToList = (clan) => {
    const clanList = document.getElementById('clan-list');
    const li = document.createElement('li');
    li.innerHTML = `<a href="#" onclick="showClanDetails('${clan.id}')">${clan.name}</a> (${clan.status}): ${clan.description}`;
    clanList.appendChild(li);
};

// Function to show clan details
const showClanDetails = async (clanId) => {
    const response = await fetch('/.netlify/functions/getClans');
    const clans = await response.json();
    const clan = clans.find(c => c.id === clanId);
    if (clan) {
        document.getElementById('clan-name-details').textContent = `Name: ${clan.name}`;
        document.getElementById('clan-description-details').textContent = `Description: ${clan.description}`;
        document.getElementById('clan-status-details').textContent = `Status: ${clan.status}`;
        const membersList = document.getElementById('clan-members');
        membersList.innerHTML = '';
        clan.members.forEach(member => {
            const li = document.createElement('li');
            li.textContent = `${member.name} - Level ${member.level}`;
            membersList.appendChild(li);
        });
        document.getElementById('clan-details').style.display = 'block';

        if (currentUserClan && currentUserClan.id === clan.id) {
            document.getElementById('quit-clan-button').style.display = 'block';
            document.getElementById('join-clan-button').style.display = 'none';
        } else {
            document.getElementById('quit-clan-button').style.display = 'none';
            document.getElementById('join-clan-button').style.display = 'block';
        }
    }
};

// Event listener to create clan form
document.getElementById('create-clan-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('create-clan-name').value;
    const description = document.getElementById('create-clan-description').value;
    const status = document.getElementById('create-clan-status').value;

    const response = await fetch('/.netlify/functions/createClan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, status }),
    });

    const newClan = await response.json();
    addClanToList(newClan);
    document.getElementById('create-clan-form').reset();
});

// Event listener to join clan form
document.getElementById('join-clan-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const clanCode = document.getElementById('join-clan-code').value;

    const response = await fetch('/.netlify/functions/joinClan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clanCode }),
    });

    const clan = await response.json();
    showClanDetails(clan.id);
    document.getElementById('join-clan-form').reset();
});

// Event listener to quit clan button
document.getElementById('quit-clan-button').addEventListener('click', async () => {
    const response = await fetch('/.netlify/functions/quitClan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    if (result.success) {
        document.getElementById('clan-details').style.display = 'none';
        alert('You have successfully quit the clan.');
    }
});

// Event listener to payment form
document.getElementById('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvc = document.getElementById('cvc').value;

    const response = await fetch('/.netlify/functions/processPayment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, cardNumber, expiryDate, cvc }),
    });

    const result = await response.json();
    if (result.success) {
        alert('Payment processed successfully.');
    } else {
        alert('Payment failed. Please try again.');
    }
});

// Fetch clans on page load
if (document.getElementById('clan-list')) {
    fetchClans();
}
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Netlify Identity
    if (window.netlifyIdentity) {
        window.netlifyIdentity.on('init', user => {
            if (user) {
                handleLogin(user);
            }
        });

        window.netlifyIdentity.on('login', user => {
            handleLogin(user);
        });

        window.netlifyIdentity.on('logout', () => {
            handleLogout();
        });
    }

    // Radix Wallet login (assuming you have an implementation for Radix Wallet)
    document.getElementById('radix-login').addEventListener('click', function(event) {
        event.preventDefault();
        // Implement Radix login logic here
        // On successful login, call handleLogin(user)
    });

    // Google login
    document.getElementById('google-login').addEventListener('click', function(event) {
        event.preventDefault();
        netlifyIdentity.open('login');
    });

    // Logout
    document.getElementById('logout-button').addEventListener('click', function() {
        netlifyIdentity.logout();
    });

    function handleLogin(user) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('welcome-message').textContent = `Welcome, ${user.user_metadata.full_name}`;
        // Fetch user data and update UI
        fetchUserData(user);
    }

    function handleLogout() {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
    }

    async function fetchUserData(user) {
        const response = await fetch('/.netlify/functions/getUserData', {
            method: 'POST',
            body: JSON.stringify({ userId: user.id })
        });
        const data = await response.json();
        document.getElementById('user-level').textContent = data.level;
        document.getElementById('user-experience').textContent = data.experience;
        document.getElementById('progress').style.width = `${data.experience % 100}%`;
        document.getElementById('user-badges').textContent = data.badges.join(', ') || 'None';
    }

    // Function to create a clan
    document.getElementById('create-clan-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const name = document.getElementById('clan-name').value;
        const description = document.getElementById('clan-description').value;
        const status = document.getElementById('clan-status').value;

        const response = await fetch('/.netlify/functions/createClan', {
            method: 'POST',
            body: JSON.stringify({ name, description, status })
        });
        const result = await response.json();
        alert('Clan created successfully!');
        fetchClans();
    });

    // Function to join a clan
    document.getElementById('join-clan-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const clanCode = document.getElementById('clan-code').value;

        const response = await fetch('/.netlify/functions/joinClan', {
            method: 'POST',
            body: JSON.stringify({ clanCode })
        });
        const result = await response.json();
        alert('Joined clan successfully!');
    });

    // Function to fetch and display clans
    async function fetchClans() {
        const response = await fetch('/.netlify/functions/getClans');
        const clans = await response.json();

        const clanList = document.getElementById('clan-list');
        clanList.innerHTML = '';
        clans.forEach(clan => {
            const listItem = document.createElement('li');
            listItem.textContent = `${clan.name} - ${clan.description} (${clan.status})`;
            clanList.appendChild(listItem);
        });
    }

    // Fetch clans on page load
    fetchClans();
});
