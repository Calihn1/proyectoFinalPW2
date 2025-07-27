from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLES = [
        ('propietario', 'Propietario'),
        ('admin', 'Administrador'),
        ('vendedor', 'Vendedor'),
    ]

    rol = models.CharField(max_length=20, choices=ROLES, default='vendedor')
