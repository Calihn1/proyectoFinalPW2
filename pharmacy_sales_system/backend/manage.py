#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pharmacy_sales_system.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    if 'runserver' in sys.argv or 'runserver_prod' in sys.argv:
        import django
        django.setup()
        from django.contrib.auth import get_user_model
        User = get_user_model()
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')

    execute_from_command_line(sys.argv)

if __name__ == "__main__":
    main()

    # --- Crear usuario propietario si no existe ---
    import django
    django.setup()
    from django.contrib.auth import get_user_model

    User = get_user_model()
    username = "propietario"

    if not User.objects.filter(username=username).exists():
        User.objects.create_user(
            username=username,
            email="propietario@example.com",
            password="propietario123",
            first_name="Prop",
            last_name="Ietario",
            rol="propietario"  # Asegúrate de que este campo exista en tu modelo
        )
        print("✅ Usuario propietario creado.")
    else:
        print("ℹ️ Usuario propietario ya existe.")