// Recuperação do Token

function getToken() {
    let token = localStorage.getItem("token")

    if (token) {
        return token
    }
    else {
        token = sessionStorage.getItem("token")
        return token
    }
}

export { getToken };