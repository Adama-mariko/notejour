#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script de migration pour ajouter le champ photo_profile à la table users
"""

from app import app
from extensions import db
from sqlalchemy import text

def apply_migration():
    """Applique la migration pour ajouter photo_profile"""
    with app.app_context():
        try:
            # Vérifier si la colonne existe déjà
            result = db.session.execute(text(
                "SELECT COUNT(*) FROM information_schema.columns "
                "WHERE table_name='users' AND column_name='photo_profile'"
            ))
            exists = result.scalar() > 0
            
            if exists:
                print("ℹ️  La colonne photo_profile existe déjà")
                return
            
            # Ajouter la colonne
            print("🔄 Ajout de la colonne photo_profile...")
            db.session.execute(text(
                "ALTER TABLE users ADD COLUMN photo_profile VARCHAR(255)"
            ))
            db.session.commit()
            print("✅ Migration appliquée avec succès!")
            print("   La colonne photo_profile a été ajoutée à la table users")
            
        except Exception as e:
            print(f"❌ Erreur lors de la migration: {e}")
            db.session.rollback()
            raise

if __name__ == "__main__":
    print("=" * 60)
    print("  MIGRATION: Ajout du champ photo_profile")
    print("=" * 60)
    apply_migration()
    print("=" * 60)
