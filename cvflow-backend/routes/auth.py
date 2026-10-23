from datetime import datetime, timedelta, timezone
from models.user import User
from models.curriculo import Curriculo

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

# Atualização dos dados do perfil

@auth_bp.route("/profile", methods=["PUT"])
@token_required
def update_profile(user_id):
    try:
        data = request.get_json() or {}

        print("[PROFILE] Dados recebidos:", data)
        print("[PROFILE] ID do usuário:", user_id)

        nome = data.get("nome", "").strip()
        email = data.get("email", "").strip().lower()

        if not nome or not email:
            return jsonify({
                "erro": "Nome e email são obrigatórios."
            }), 400

        usuario = db.session.get(User, user_id)

        if not usuario:
            return jsonify({
                "erro": "Usuário não encontrado."
            }), 404

        email_existente = User.query.filter(
            User.email == email,
            User.id != user_id
        ).first()

        if email_existente:
            return jsonify({
                "erro": "Este email já está sendo utilizado."
            }), 409

        print(
            "[PROFILE] Dados antigos:",
            usuario.nome,
            usuario.email
        )

        usuario.nome = nome
        usuario.email = email

        db.session.commit()
        db.session.refresh(usuario)

        print(
            "[PROFILE] Dados após commit:",
            usuario.nome,
            usuario.email
        )

        return jsonify({
            "mensagem": "Perfil atualizado com sucesso!",
            "usuario": {
                "id": usuario.id,
                "nome": usuario.nome,
                "email": usuario.email
            }
        }), 200

    except Exception as erro:
        db.session.rollback()

        print("[PROFILE ERROR]", repr(erro))

        return jsonify({
            "erro": "Não foi possível atualizar o perfil."
        }), 500

# Exclusão da conta

@auth_bp.route("/profile", methods=["DELETE"])
@token_required
def delete_profile(user_id):
    try:
        usuario = db.session.get(User, user_id)

        if not usuario:
            return jsonify({
                "erro": "Usuário não encontrado."
            }), 404

        db.session.delete(usuario)
        db.session.commit()

        print(f"[PROFILE] Usuário {user_id} excluído.")

        return jsonify({
            "mensagem": "Conta excluída com sucesso!"
        }), 200

    except Exception as erro:
        db.session.rollback()

        print("[PROFILE DELETE ERROR]", repr(erro))

        return jsonify({
            "erro": "Não foi possível excluir a conta."
        }), 500

# Configurações

@auth_bp.route("/settings", methods=["GET"])
@token_required
def get_settings(user_id):
    usuario = db.session.get(User, user_id)

    if not usuario:
        return jsonify({
            "erro": "Usuário não encontrado."
        }), 404

    return jsonify({
        "configuracoes": {
            "curriculo_principal_id": usuario.curriculo_principal_id,
            "formato_padrao": usuario.formato_padrao
        }
    }), 200


@auth_bp.route("/settings", methods=["PUT"])
@token_required
def update_settings(user_id):
    try:
        data = request.get_json() or {}

        curriculo_principal_id = data.get(
            "curriculo_principal_id"
        )

        formato_padrao = data.get(
            "formato_padrao",
            "pdf"
        )

        usuario = db.session.get(User, user_id)

        if not usuario:
            return jsonify({
                "erro": "Usuário não encontrado."
            }), 404

        if formato_padrao != "pdf":
            return jsonify({
                "erro": "Formato inválido."
            }), 400

        if curriculo_principal_id is not None:
            curriculo = Curriculo.query.filter_by(
                id=curriculo_principal_id,
                user_id=user_id
            ).first()

            if not curriculo:
                return jsonify({
                    "erro": "Currículo não encontrado."
                }), 404

        usuario.curriculo_principal_id = curriculo_principal_id
        usuario.formato_padrao = formato_padrao

        db.session.commit()

        return jsonify({
            "mensagem": "Configurações atualizadas com sucesso!",
            "configuracoes": {
                "curriculo_principal_id": usuario.curriculo_principal_id,
                "formato_padrao": usuario.formato_padrao
            }
        }), 200

    except Exception as erro:
        db.session.rollback()

        print("[SETTINGS ERROR]", repr(erro))

        return jsonify({
            "erro": "Não foi possível atualizar as configurações."
        }), 500

# Rota de alteração de Senha - Configurações

@auth_bp.route("/password", methods=["PUT"])
@token_required
def update_password(user_id):
    try:
        data = request.get_json() or {}

        senha_atual = data.get("senha_atual")
        nova_senha = data.get("nova_senha")

        if not senha_atual or not nova_senha:
            return jsonify({
                "erro": "Senha atual e nova senha são obrigatórias."
            }), 400

        if len(nova_senha) < 6:
            return jsonify({
                "erro": "A nova senha deve ter pelo menos 6 caracteres."
            }), 400

        usuario = db.session.get(User, user_id)

        if not usuario:
            return jsonify({
                "erro": "Usuário não encontrado."
            }), 404

        if not check_password_hash(
            usuario.senha_hash,
            senha_atual
        ):
            return jsonify({
                "erro": "A senha atual está incorreta."
            }), 401

        usuario.senha_hash = generate_password_hash(
            nova_senha
        )

        db.session.commit()

        return jsonify({
            "mensagem": "Senha alterada com sucesso!"
        }), 200

    except Exception as erro:
        db.session.rollback()

        print("[PASSWORD ERROR]", repr(erro))

        return jsonify({
            "erro": "Não foi possível alterar a senha."
        }), 500