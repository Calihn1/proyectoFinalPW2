from django.db import models

class Producto (models.Model):
    codigo = models.CharField(max_length = 50, null = False, unique = True)
    nombre = models.CharField(max_length = 100, null = False)
    descripcion = models.TextField(null = True)
    precio = models.DecimalField(max_digits = 10, decimal_places = 2, null = False)
    fecha_vencimiento = models.DateField(null = False)
    cantidad = models.PositiveIntegerField(default = 0)
    estado = models.BooleanField(default = True)
    created_at = models.DateTimeField(auto_now_add = True)
    proveedor = models.CharField(max_length = 150, null = True)

    def __str__(self):
        return self.nombre