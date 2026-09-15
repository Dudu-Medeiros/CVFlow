from functools import wraps

import jwt
from flask import request, jsonify

from config import Config


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({
                "erro": "Token de autenticação não fornecido."
            }), 401

        partes = auth_header.split(" ")

        if len(partes) != 2 or partes[0] != "Bearer":
            return jsonify({
                "erro": "Formato do token inválido."
            }), 401

        token = partes[1]

        try:
            payload = jwt.decode(
                token,
                Config.SECRET_KEY,
                algorithms=["HS256"]
            )

            user_id = payload["user_id"]

        except jwt.ExpiredSignatureError:
            return jsonify({
                "erro": "Token expirado."
            }), 401

        except jwt.InvalidTokenError:
            return jsonify({
                "erro": "Token inválido."
            }), 401

        return f(user_id, *args, **kwargs)

    return decorated