import { apiFetch } from "./api";
import { getToken, clearToken } from "./auth";

export async function getUser() {
    const token = getToken();

    if (!token) {
        return null;
    }

    try {
        const dados = await apiFetch("/auth/me", { method: "GET" });
        return dados?.usuario || null;
    } catch (erro) {
        clearToken();
        return null;
    }
}