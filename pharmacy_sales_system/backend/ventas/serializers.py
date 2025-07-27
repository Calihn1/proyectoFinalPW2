from rest_framework import serializers
from .models import Venta, DetalleVenta
from accounts.models import User
from django.db import transaction

class DetalleVentaSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)

    class Meta:
        model = DetalleVenta
        fields = ['id', 'producto', 'producto_nombre', 'cantidad', 'precio_unitario', 'subtotal']
        read_only_fields = ['precio_unitario', 'subtotal']

    def create(self, validated_data):
        detalle_venta = DetalleVenta(**validated_data)
        detalle_venta.save()
        return detalle_venta

    
class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name']
    
class VentaSerializer(serializers.ModelSerializer):
    detalles = DetalleVentaSerializer(many=True, required=False)
    usuario = UserSerializer(read_only=True)

    class Meta:
        model = Venta 
        fields = ['id', 'usuario', 'fecha', 'descuento', 'total_bruto', 'total_neto', 'detalles']
        read_only_fields = ['fecha', 'total_bruto', 'total_neto']

    @transaction.atomic
    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles', [])
        validated_data['usuario'] = self.context['request'].user
        venta = Venta.objects.create(**validated_data)
        
        for detalle_data in detalles_data:
            producto = detalle_data['producto']
            cantidad = detalle_data['cantidad']

            if producto.cantidad < cantidad:
                raise serializers.ValidationError("No Hay Stock de " + producto.nombre)
            
            producto.cantidad -= cantidad
            producto.save()
            DetalleVenta.objects.create(venta=venta, **detalle_data)

        return venta

    def validate_descuento(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Descuento Inválido")
        return value