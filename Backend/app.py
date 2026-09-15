from flask import Flask

from config import Config
from extensions import db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    from routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/auth")

    @app.route("/")
    def home():
        return "CVFlow Backend funcionando!"

    @app.route("/db-test")
    def db_test():
        try:
            db.session.execute(db.text("SELECT 1"))
            return "Conexão com PostgreSQL funcionando!"
        except Exception as error:
            return f"Erro na conexão: {error}", 500

    return app


app = create_app()

from models.user import User

with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run(debug=True)