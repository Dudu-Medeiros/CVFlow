from datetime import datetime, timezone

from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    nome = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    senha_hash = db.Column(
        db.String(255),
        nullable=False
    )

    curriculo_principal_id = db.Column(
        db.Integer,
        db.ForeignKey(
            "curriculos.id",
            ondelete="SET NULL"
        ),
        nullable=True
    )

    formato_padrao = db.Column(
        db.String(20),
        nullable=False,
        default="pdf"
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )