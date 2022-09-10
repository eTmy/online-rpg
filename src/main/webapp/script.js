const projectName = 'onlinerpg';
const authSendBtn = document.getElementById('authSendBtn');

let userNameInput = document.getElementById('floatingInput');
let userNamePassword = document.getElementById('floatingPassword');

authSendBtn.addEventListener('click', login);

async function login() {
    const username = userNameInput.value;
    const password = userNamePassword.value;

    if (!userNameInput.value || !userNamePassword.value) {
        return;
    }

    const data = {
        username: username,
        password: password
    }

    const response = await fetch(`/${projectName}/start?data`, {
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.redirected) {
        window.location.href = response.url;
    }
}



