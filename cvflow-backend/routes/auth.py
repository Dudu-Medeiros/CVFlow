import os
import re
import random
import requests
import resend
from datetime import datetime, timedelta, timezone
import jwt
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config
from extensions import db
from models.user import User
from models.curriculo import Curriculo
from utils.jwt_utils import token_required

auth_bp = Blueprint("auth", __name__)
resend.api_key = os.environ.get("RESEND_API_KEY")

def enviar_email_codigo(email_destino, codigo):
    print(f"\nCODIGO GERADO PARA {email_destino}: {codigo}\n")
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px; text-align: center;">
        <h2 style="color: #0F172A;">Confirme seu acesso</h2>
        <p style="color: #475569; line-height: 1.6;">Use o código abaixo para ativar sua conta no CVFlow:</p>
        <div style="margin: 32px 0; padding: 16px; background-color: #F1F5F9; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #2563EB;">
            {codigo}
        </div>
        <p style="color: #94A3B8; font-size: 12px;">Se você não solicitou este código, ignore este e-mail.</p>
    </div>
    """
    
    params = {
        "from": "Acme <onboarding@resend.dev>",
        "to": [email_destino],
        "subject": "Seu código de verificação CVFlow",
        "html": html_content
    }
    
    try:
        email_enviado = resend.Emails.send(params)
        print(f"E-mail disparado com sucesso via Resend! ID: {email_enviado.get('id')}")
    except Exception as e:
        print(f"Erro ao disparar Resend: {str(e)}")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")
    
    if not nome or not email or not senha:
        return jsonify({"erro": "Nome, email e senha são obrigatórios."}), 400

    padrao_senha = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
    if not re.match(padrao_senha, senha):
        return jsonify({"erro": "A senha não atende aos requisitos de segurança."}), 400
        
    usuario_existente = User.query.filter_by(email=email).first()
    if usuario_existente:
        return jsonify({"erro": "Este email já está cadastrado."}), 409
        
    codigo_gerado = str(random.randint(100000, 999999))
    senha_hash = generate_password_hash(senha)
    
    novo_usuario = User(
        nome=nome, 
        email=email, 
        senha_hash=senha_hash,
        codigo_verificacao=codigo_gerado
    )
    
    db.session.add(novo_usuario)
    db.session.commit()
    
    enviar_email_codigo(email, codigo_gerado)
    
    return jsonify({
        "mensagem": "Usuário cadastrado com sucesso!"
    }), 201

@auth_bp.route("/verify-code", methods=["POST"])
def verify_code():
    data = request.get_json()
    email = data.get("email")
    codigo = data.get("codigo")
    
    if not email or not codigo:
        return jsonify({"erro": "Email e código são obrigatórios."}), 400

    usuario = User.query.filter_by(email=email).first()
    
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado."}), 404
        
    if getattr(usuario, 'is_verified', False):
        return jsonify({"mensagem": "Conta já confirmada anteriormente."}), 200
        
    if usuario.codigo_verificacao != str(codigo):
        return jsonify({"erro": "Código de verificação incorreto."}), 400
        
    usuario.is_verified = True
    usuario.codigo_verificacao = None
    db.session.commit()
    
    return jsonify({"mensagem": "E-mail confirmado com sucesso! Você já pode fazer login."}), 200

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")
    
    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios."}), 400
        
    usuario = User.query.filter_by(email=email).first()
    
    if not usuario:
        return jsonify({"erro": "Email ou senha inválidos."}), 401
        
    senha_correta = check_password_hash(usuario.senha_hash, senha)
    
    if not senha_correta:
        return jsonify({"erro": "Email ou senha inválidos."}), 401

    if getattr(usuario, 'is_verified', False) == False:
        return jsonify({
            "erro": "Confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada ou terminal."
        }), 403
        
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
            "email": usuario.email,
            "plano": getattr(usuario, 'plano', 'Starter')
        }
    }), 200

@auth_bp.route("/google", methods=["POST"])
def google_login():
    data = request.get_json()
    token_google = data.get("token")
    
    if not token_google:
        return jsonify({"erro": "Token do Google não foi enviado."}), 400
        
    try:
        google_url = f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={token_google}"
        resposta_google = requests.get(google_url)
        
        if resposta_google.status_code != 200:
            return jsonify({"erro": "Token do Google inválido ou expirado."}), 401
            
        dados_google = resposta_google.json()
        email = dados_google.get('email')
        nome = dados_google.get('name')
        
        if not email:
            return jsonify({"erro": "Não foi possível obter o e-mail do Google."}), 400
            
        usuario = User.query.filter_by(email=email).first()
        
        if not usuario:
            senha_aleatoria = os.urandom(24).hex()
            senha_hash = generate_password_hash(senha_aleatoria)
            usuario = User(nome=nome, email=email, senha_hash=senha_hash)
            
            if hasattr(usuario, 'is_verified'):
                usuario.is_verified = True
                
            db.session.add(usuario)
            db.session.commit()
            
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
            "mensagem": "Login com Google realizado com sucesso!",
            "token": token,
            "usuario": {
                "id": usuario.id,
                "nome": usuario.nome,
                "email": usuario.email,
                "plano": getattr(usuario, 'plano', 'Starter')
            }
        }), 200
        
    except Exception as erro:
        print("[GOOGLE LOGIN ERROR]", repr(erro))
        return jsonify({"erro": "Ocorreu um erro interno ao processar o login social."}), 500

@auth_bp.route("/linkedin", methods=["POST"])
def linkedin_login():
    data = request.get_json()
    code = data.get("code")
    redirect_uri = data.get("redirect_uri")

    if not code:
        return jsonify({"erro": "Código do LinkedIn não fornecido."}), 400

    LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
    LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")

    if not LINKEDIN_CLIENT_ID or not LINKEDIN_CLIENT_SECRET:
        return jsonify({"erro": "Configuração do servidor incompleta para login com LinkedIn."}), 500

    try:
        token_url = "https://www.linkedin.com/oauth/v2/accessToken"
        token_data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
            "client_id": LINKEDIN_CLIENT_ID,
            "client_secret": LINKEDIN_CLIENT_SECRET
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        res_token = requests.post(token_url, data=token_data, headers=headers)
        
        if res_token.status_code != 200:
            print("Erro ao trocar token no LinkedIn:", res_token.text)
            return jsonify({"erro": "Falha ao validar código no LinkedIn."}), 401
            
        access_token = res_token.json().get("access_token")
        user_url = "https://api.linkedin.com/v2/userinfo"
        user_headers = {"Authorization": f"Bearer {access_token}"}
        
        res_user = requests.get(user_url, headers=user_headers)
        
        if res_user.status_code != 200:
            print("Erro ao obter perfil no LinkedIn:", res_user.text)
            return jsonify({"erro": "Falha ao obter dados do perfil do LinkedIn."}), 400
            
        user_info = res_user.json()
        nome = user_info.get("name")
        email = user_info.get("email")
        
        if not email:
            return jsonify({"erro": "E-mail não fornecido pelo LinkedIn."}), 400

        usuario = User.query.filter_by(email=email).first()
        
        if not usuario:
            senha_aleatoria = os.urandom(24).hex()
            senha_hash = generate_password_hash(senha_aleatoria)
            usuario = User(nome=nome, email=email, senha_hash=senha_hash)
            
            if hasattr(usuario, 'is_verified'):
                usuario.is_verified = True
                
            db.session.add(usuario)
            db.session.commit()

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
            "mensagem": "Login com LinkedIn realizado com sucesso!",
            "token": token,
            "usuario": {
                "id": usuario.id,
                "nome": usuario.nome,
                "email": usuario.email,
                "plano": getattr(usuario, 'plano', 'Starter')
            }
        }), 200
    except Exception as erro:
        print("[LINKEDIN LOGIN ERROR]", repr(erro))
        return jsonify({"erro": "Ocorreu um erro ao processar o login com LinkedIn."}), 500

@auth_bp.route("/me", methods=["GET"])
@token_required
def me(user_id):
    usuario = User.query.get(user_id)
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado."}), 404
        
    return jsonify({
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email,
            "plano": getattr(usuario, 'plano', 'Starter')
        }
    }), 200

@auth_bp.route("/profile", methods=["PUT"])
@token_required
def update_profile(user_id):
    try:
        data = request.get_json() or {}
        nome = data.get("nome", "").strip()
        email = data.get("email", "").strip().lower()
        
        if not nome or not email:
            return jsonify({"erro": "Nome e email são obrigatórios."}), 400
            
        usuario = db.session.get(User, user_id)
        if not usuario:
            return jsonify({"erro": "Usuário não encontrado."}), 404
            
        email_existente = User.query.filter(User.email == email, User.id != user_id).first()
        if email_existente:
            return jsonify({"erro": "Este email já está sendo utilizado."}), 409
            
        usuario.nome = nome
        usuario.email = email
        db.session.commit()
        db.session.refresh(usuario)
        
        return jsonify({
            "mensagem": "Perfil atualizado com sucesso!",
            "usuario": {
                "id": usuario.id,
                "nome": usuario.nome,
                "email": usuario.email,
                "plano": getattr(usuario, 'plano', 'Starter')
            }
        }), 200
        
    except Exception as erro:
        db.session.rollback()
        print("[PROFILE ERROR]", repr(erro))
        return jsonify({"erro": "Não foi possível atualizar o perfil."}), 500

@auth_bp.route("/profile", methods=["DELETE"])
@token_required
def delete_profile(user_id):
    try:
        usuario = db.session.get(User, user_id)
        if not usuario:
            return jsonify({"erro": "Usuário não encontrado."}), 404
            
        db.session.delete(usuario)
        db.session.commit()
        
        return jsonify({"mensagem": "Conta excluída com sucesso!"}), 200
        
    except Exception as erro:
        db.session.rollback()
        print("[PROFILE DELETE ERROR]", repr(erro))
        return jsonify({"erro": "Não foi possível excluir a conta."}), 500

@auth_bp.route("/settings", methods=["GET"])
@token_required
def get_settings(user_id):
    usuario = db.session.get(User, user_id)
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado."}), 404
        
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
        curriculo_principal_id = data.get("curriculo_principal_id")
        formato_padrao = data.get("formato_padrao", "pdf")
        
        usuario = db.session.get(User, user_id)
        if not usuario:
            return jsonify({"erro": "Usuário não encontrado."}), 404
            
        if formato_padrao != "pdf":
            return jsonify({"erro": "Formato inválido."}), 400
            
        if curriculo_principal_id is not None:
            curriculo = Curriculo.query.filter_by(id=curriculo_principal_id, user_id=user_id).first()
            if not curriculo:
                return jsonify({"erro": "Currículo não encontrado."}), 404
                
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
        return jsonify({"erro": "Não foi possível atualizar as configurações."}), 500

@auth_bp.route("/password", methods=["PUT"])
@token_required
def update_password(user_id):
    try:
        data = request.get_json() or {}
        senha_atual = data.get("senha_atual")
        nova_senha = data.get("nova_senha")
        
        if not senha_atual or not nova_senha:
            return jsonify({"erro": "Senha atual e nova senha são obrigatórias."}), 400
            
        if len(nova_senha) < 6:
            return jsonify({"erro": "A nova senha deve ter pelo menos 6 caracteres."}), 400
            
        usuario = db.session.get(User, user_id)
        if not usuario:
            return jsonify({"erro": "Usuário não encontrado."}), 404
            
        if not check_password_hash(usuario.senha_hash, senha_atual):
            return jsonify({"erro": "A senha atual está incorreta."}), 401
            
        usuario.senha_hash = generate_password_hash(nova_senha)
        db.session.commit()
        
        return jsonify({"mensagem": "Senha alterada com sucesso!"}), 200
        
    except Exception as erro:
        db.session.rollback()
        print("[PASSWORD ERROR]", repr(erro))
        return jsonify({"erro": "Não foi possível alterar a senha."}), 500