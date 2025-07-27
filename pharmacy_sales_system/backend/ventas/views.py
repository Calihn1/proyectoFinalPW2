from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import VentaSerializer, DetalleVentaSerializer
from .models import Venta, DetalleVenta

class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    
    serializer_class = VentaSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post']

    def get_queryset(self):

        queryset = super().get_queryset().order_by('-fecha')

        year = self.request.query_params.get('year')
        month = self.request.query_params.get('month')
        day = self.request.query_params.get('day')

        if year:
            queryset = queryset.filter(fecha__year=year)
        if month:
            queryset = queryset.filter(fecha__month=month)
        if day:
            queryset = queryset.filter(fecha__day=day)
            
        return queryset

class DetalleVentaViewSet(viewsets.ModelViewSet):
    queryset = DetalleVenta.objects.all()
    serializer_class = DetalleVentaSerializer
    permission_classes = [IsAuthenticated]