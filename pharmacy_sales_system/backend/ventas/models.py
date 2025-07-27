from django.db import models
from accounts.models import User
from productos.models import Producto
from decimal import Decimal

class Venta(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    fecha = models.DateTimeField(auto_now_add=True)
    descuento = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total_bruto = models.DecimalField(max_digits = 10, decimal_places = 2, default=0.00)
    total_neto = models.DecimalField(max_digits = 10, decimal_places = 2, default=0.00)

class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, null=False, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, null=False)
    cantidad = models.PositiveIntegerField(null=False)
    precio_unitario = models.DecimalField(max_digits = 10, decimal_places = 2, null = False, blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=True)

    def save(self, *args, **kwargs):
        self.precio_unitario = self.producto.precio
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)
        self.actualizar_total_venta()

    def actualizar_total_venta(self):
        total = self.venta.total_bruto
        total_neto = self.venta.total_neto
        subtotal_neto = self.subtotal * (1 - self.venta.descuento / 100)

        self.venta.total_bruto = Decimal(str(total)) + self.subtotal
        self.venta.total_neto = Decimal(str(subtotal_neto)) + Decimal(str(total_neto))

        self.venta.save(update_fields=['total_bruto', 'total_neto'])