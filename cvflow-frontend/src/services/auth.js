const TOKEN_KEY = "token";

export function getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token, lembrar = true) {
    if (lembrar) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        sessionStorage.setItem(TOKEN_KEY, token);
    }
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
}