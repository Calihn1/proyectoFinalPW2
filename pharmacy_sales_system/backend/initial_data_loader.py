import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pharmacy_sales_system.settings")
django.setup()

from django.core.management import call_command

try:
    call_command('loaddata', 'datos.json')
    print("Datos cargados exitosamente")
except Exception as e:
    print("Error al cargar datos:", e)