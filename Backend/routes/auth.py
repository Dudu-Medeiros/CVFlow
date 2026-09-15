from datetime import datetime, timedelta, timezone

# Imports de validação/autenticação
import jwt
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

# Import de configurações/db
from config import Config
from extensions import db
from models.user import User

# Import da validação do JWT
from utils.jwt_utils import token_required


auth_bp = Blueprint("auth", __name__)


# Fluxo de Registro

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")

    if not nome or not email or not senha:
        return jsonify({
            "erro": "Nome, email e senha são obrigatórios."
        }), 400

    usuario_existente = User.query.filter_by(email=email).first()

    if usuario_existente:
        return jsonify({
            "erro": "Este email já está cadastrado."
        }), 409

    senha_hash = generate_password_hash(senha)

    novo_usuario = User(
        nome=nome,
        email=email,
        senha_hash=senha_hash
    )

    db.session.add(novo_usuario)
    db.session.commit()

    return jsonify({
        "mensagem": "Usuário cadastrado com sucesso!"
    }), 201


# Fluxo de Login

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({
            "erro": "Email e senha são obrigatórios."
        }), 400

    usuario = User.query.filter_by(email=email).first()

    if not usuario:
        return jsonify({
            "erro": "Email ou senha inválidos."
        }), 401

    senha_correta = check_password_hash(
        usuario.senha_hash,
        senha
    )

    if not senha_correta:
        return jsonify({
            "erro": "Email ou senha inválidos."
        }), 401

    # Criação do JWT

    agora = datetime.now(timezone.utc)

    token = jwt.encode(
        {
            "user_id": usuario.id,
            "iat": agora,
            "exp": agora + timedelta(hours=2)
        },
        Config.SECRET_KEY,
        algorithm="HS256"
    )

    return jsonify({
        "mensagem": "Login realizado com sucesso!",
        "token": token,
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email
        }
    }), 200

# Rota protegida - usuário autenticado

@auth_bp.route("/me", methods=["GET"])
@token_required
def me(user_id):
    usuario = User.query.get(user_id)

    if not usuario:
        return jsonify({
            "erro": "Usuário não encontrado."
        }), 404

    return jsonify({
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email
        }
    }), 200