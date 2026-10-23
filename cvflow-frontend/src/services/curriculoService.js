import { apiFetch } from "./api";

export async function listarCurriculos() {
    return await apiFetch("/curriculos", { method: "GET" });
}

export async function criarCurriculo(dados) {
    return await apiFetch("/curriculos", {
        method: "POST",
        body: JSON.stringify(dados),
    });
}

export async function atualizarCurriculo(id, dados) {
    return await apiFetch(`/curriculos/${id}`, {
        method: "PUT",
        body: JSON.stringify(dados),
    });
}

export async function deletarCurriculo(id) {
    return await apiFetch(`/curriculos/${id}`, { method: "DELETE" });
}