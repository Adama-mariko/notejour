"""Add photo_profile to users

Revision ID: add_photo_profile
Revises: 
Create Date: 2025-12-05

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_photo_profile'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Ajouter la colonne photo_profile à la table users
    op.add_column('users', sa.Column('photo_profile', sa.String(length=255), nullable=True))


def downgrade():
    # Supprimer la colonne photo_profile de la table users
    op.drop_column('users', 'photo_profile')
