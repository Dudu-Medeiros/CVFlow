from datetime import datetime, timezone

from extensions import db


class Curriculo(db.Model):
    __tablename__ = "curriculos"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    titulo = db.Column(
        db.String(150),
        nullable=False,
        default="Meu currículo"
    )

    modelo = db.Column(
        db.String(30),
        nullable=False
    )

    dados = db.Column(
        db.JSON,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    usuario = db.relationship(
        "User",
        foreign_keys=[user_id],
        backref=db.backref(
            "curriculos",
            lazy=True,
            cascade="all, delete-orphan"
        )
    )