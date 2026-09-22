from flask import Blueprint, request, jsonify

from extensions import db
from models.curriculo import Curriculo
from utils.jwt_utils import token_required


curriculos_bp = Blueprint("curriculos", __name__)


@curriculos_bp.route("", methods=["POST"])
@token_required
def criar_curriculo(user_id):
    try:
        data = request.get_json() or {}

        titulo = data.get("titulo", "Meu currículo").strip()
        modelo = data.get("modelo")
        dados = data.get("dados")

        if not modelo or dados is None:
            return jsonify({
                "erro": "Modelo e dados são obrigatórios."
            }), 400

        modelos_validos = ["ats", "moderno", "executivo"]

        if modelo not in modelos_validos:
            return jsonify({
                "erro": "Modelo de currículo inválido."
            }), 400

        if not isinstance(dados, dict):
            return jsonify({
                "erro": "Os dados do currículo devem ser um objeto."
            }), 400

        novo_curriculo = Curriculo(
            user_id=user_id,
            titulo=titulo or "Meu currículo",
            modelo=modelo,
            dados=dados
        )

        db.session.add(novo_curriculo)
        db.session.commit()

        return jsonify({
            "mensagem": "Currículo criado com sucesso!",
            "curriculo": {
                "id": novo_curriculo.id,
                "titulo": novo_curriculo.titulo,
                "modelo": novo_curriculo.modelo,
                "dados": novo_curriculo.dados,
                "created_at": novo_curriculo.created_at.isoformat(),
                "updated_at": novo_curriculo.updated_at.isoformat()
            }
        }), 201

    except Exception as erro:
        db.session.rollback()

        print("[CURRICULO ERROR]", repr(erro))

        return jsonify({
            "erro": "Não foi possível criar o currículo."
        }), 500


@curriculos_bp.route("", methods=["GET"])
@token_required
def listar_curriculos(user_id):
    try:
        curriculos = Curriculo.query.filter_by(
            user_id=user_id
        ).order_by(
            Curriculo.updated_at.desc()
        ).all()

        return jsonify({
            "curriculos": [
                {
                    "id": curriculo.id,
                    "titulo": curriculo.titulo,
                    "modelo": curriculo.modelo,
                    "dados": curriculo.dados,
                    "created_at": curriculo.created_at.isoformat(),
                    "updated_at": curriculo.updated_at.isoformat()
                }
                for curriculo in curriculos
            ]
        }), 200

    except Exception as erro:
        print("[LISTAR CURRICULOS ERROR]", repr(erro))

        return jsonify({
            "erro": "Não foi possível listar os currículos."
        }), 500