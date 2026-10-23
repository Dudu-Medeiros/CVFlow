from flask import Blueprint, request, jsonify

from extensions import db
from models.curriculo import Curriculo
from utils.jwt_utils import token_required


curriculos_bp = Blueprint("curriculos", __name__)

MODELOS_VALIDOS = ["ats", "moderno", "executivo"]


def formatar_curriculo(curriculo):
    return {
        "id": curriculo.id,
        "titulo": curriculo.titulo,
        "modelo": curriculo.modelo,
        "dados": curriculo.dados,
        "created_at": curriculo.created_at.isoformat(),
        "updated_at": curriculo.updated_at.isoformat()
    }


@curriculos_bp.route("", methods=["POST"])
@token_required
def criar_curriculo(user_id):
    try:
        data = request.get_json(silent=True) or {}

        if not isinstance(data, dict):
            return jsonify({
                "erro": "Os dados enviados devem ser um objeto JSON."
            }), 400

        titulo = data.get("titulo", "Meu currículo")
        modelo = data.get("modelo")
        dados = data.get("dados")

        if not isinstance(titulo, str):
            return jsonify({
                "erro": "O título deve ser um texto."
            }), 400

        titulo = titulo.strip() or "Meu currículo"

        if not modelo or dados is None:
            return jsonify({
                "erro": "Modelo e dados são obrigatórios."
            }), 400

        if modelo not in MODELOS_VALIDOS:
            return jsonify({
                "erro": "Modelo de currículo inválido."
            }), 400

        if not isinstance(dados, dict):
            return jsonify({
                "erro": "Os dados do currículo devem ser um objeto."
            }), 400

        novo_curriculo = Curriculo(
            user_id=user_id,
            titulo=titulo,
            modelo=modelo,
            dados=dados
        )

        db.session.add(novo_curriculo)
        db.session.commit()

        return jsonify({
            "mensagem": "Currículo criado com sucesso!",
            "curriculo": formatar_curriculo(novo_curriculo)
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
                formatar_curriculo(curriculo)
                for curriculo in curriculos
            ]
        }), 200

    except Exception as erro:
        print("[LISTAR CURRICULOS ERROR]", repr(erro))

        return jsonify({
            "erro": "Não foi possível listar os currículos."
        }), 500


@curriculos_bp.route("/<int:curriculo_id>", methods=["PUT"])
@token_required
def editar_curriculo(user_id, curriculo_id):
    try:
        curriculo = Curriculo.query.filter_by(
            id=curriculo_id,
            user_id=user_id
        ).first()

        if not curriculo:
            return jsonify({
                "erro": "Currículo não encontrado."
            }), 404

        data = request.get_json(silent=True) or {}

        if not isinstance(data, dict):
            return jsonify({
                "erro": "Os dados enviados devem ser um objeto JSON."
            }), 400

        titulo = data.get("titulo")
        modelo = data.get("modelo")
        dados = data.get("dados")

        if titulo is not None:
            if not isinstance(titulo, str):
                return jsonify({
                    "erro": "O título deve ser um texto."
                }), 400

            curriculo.titulo = titulo.strip() or "Meu currículo"

        if modelo is not None:
            if modelo not in MODELOS_VALIDOS:
                return jsonify({
                    "erro": "Modelo de currículo inválido."
                }), 400

            curriculo.modelo = modelo

        if dados is not None:
            if not isinstance(dados, dict):
                return jsonify({
                    "erro": "Os dados do currículo devem ser um objeto."
                }), 400

            curriculo.dados = dados

        db.session.commit()

        return jsonify({
            "mensagem": "Currículo atualizado com sucesso!",
            "curriculo": formatar_curriculo(curriculo)
        }), 200

    except Exception as erro:
        db.session.rollback()

        print("[EDITAR CURRICULO ERROR]", repr(erro))

        return jsonify({
            "erro": "Não foi possível editar o currículo."
        }), 500


@curriculos_bp.route("/<int:curriculo_id>", methods=["DELETE"])
@token_required
def excluir_curriculo(user_id, curriculo_id):
    try:
        curriculo = Curriculo.query.filter_by(
            id=curriculo_id,
            user_id=user_id
        ).first()

        if not curriculo:
            return jsonify({
                "erro": "Currículo não encontrado."
            }), 404

        db.session.delete(curriculo)
        db.session.commit()

        return jsonify({
            "mensagem": "Currículo excluído com sucesso!"
        }), 200

    except Exception as erro:
        db.session.rollback()

        print("[EXCLUIR CURRICULO ERROR]", repr(erro))

        return jsonify({
            "erro": "Não foi possível excluir o currículo."
        }), 500