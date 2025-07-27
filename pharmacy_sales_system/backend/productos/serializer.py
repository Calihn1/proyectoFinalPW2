from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Producto

class ProductoSerializer (serializers.ModelSerializer):
    codigo = serializers.CharField(validators=[])
    
    class Meta:
        model = Producto
        exclude = ['estado']
    
    def validate_codigo(self, value):
        instance = getattr(self, 'instance', None)
        query = Producto.objects.filter(codigo=value, estado = True)
        if instance:
            query = query.exclude(pk = instance.pk)
        if query.exists():
            raise serializers.ValidationError("Ya existe otro producto con este código.")
        return value


    def create(self, validated_data):
        codigo = validated_data['codigo']
        
        producto, _ = Producto.objects.update_or_create(
            codigo = codigo,
            defaults = {**validated_data, 'estado': True}
        )

        return producto;