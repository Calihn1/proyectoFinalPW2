from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializer import ProductoSerializer
from .models import Producto

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Producto.objects.filter(estado=True)

    def destroy(self, request, *args, **kwargs):
        producto = self.get_object()

        producto.estado = False
        producto.save()
        return Response({"detail": "Producto Eliminado Exitosamente"}, status=status.HTTP_200_OK)