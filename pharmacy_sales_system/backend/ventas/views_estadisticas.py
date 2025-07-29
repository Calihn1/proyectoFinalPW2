from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, F, Value, Case, When, CharField, FloatField
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, Cast
from .models import Venta, DetalleVenta
from productos.models import Producto
from datetime import datetime, timedelta

class VentasPorFechaAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        periodo = request.query_params.get('periodo', 'daily')
        
        if periodo == 'weekly':
            trunc_func = TruncWeek
        elif periodo == 'monthly':
            trunc_func = TruncMonth
        else:
            trunc_func = TruncDay

        queryset = Venta.objects.filter(
            fecha__gte=datetime.now() - timedelta(days=90)
        ).annotate(
            periodo=trunc_func('fecha')
        ).values('periodo').annotate(
            total=Sum('total_neto')
        ).order_by('periodo')

        data = {
            'labels': [item['periodo'].strftime('%d/%m/%Y') for item in queryset],
            'datasets': [{
                'label': 'Ingresos por Ventas',
                'data': [item['total'] for item in queryset]
            }]
        }
        return Response(data)

class TopProductosAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        metrica = request.query_params.get('metrica', 'facturacion')
        
        if metrica == 'volumen':
            aggregation = Sum('cantidad')
        else:
            aggregation = Sum('subtotal')

        queryset = DetalleVenta.objects.values(
            'producto__nombre'
        ).annotate(
            total_agregado=aggregation
        ).order_by('-total_agregado')[:10]

        data = {
            'labels': [item['producto__nombre'] for item in queryset],
            'datasets': [{
                'label': 'Total' if metrica == 'facturacion' else 'Unidades',
                'data': [item['total_agregado'] for item in queryset]
            }]
        }
        return Response(data)

class StockStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        queryset = Producto.objects.filter(estado=True).annotate(
            status=Case(
                When(cantidad=0, then=Value('agotado')),
                When(cantidad__lte=F('stock_minimo'), then=Value('critico')),
                # Cast para que la multiplicacion sea compatible con PostgreSQL
                When(
                    cantidad__lte=Cast(F('stock_minimo'), FloatField()) * 1.25,
                    then=Value('bajo')
                ),
                default=Value('suficiente'),
                output_field=CharField(),
            )
        ).values('status').annotate(
            count=Count('id')
        ).order_by('status')

        return Response(list(queryset))

class ProductosPorEstadoAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        estado_solicitado = request.query_params.get('estado')
        if not estado_solicitado:
            return Response({"error": "El parámetro 'estado' es requerido."}, status=400)

        queryset = Producto.objects.filter(estado=True).annotate(
            status=Case(
                When(cantidad=0, then=Value('agotado')),
                When(cantidad__lte=F('stock_minimo'), then=Value('critico')),
                When(
                    cantidad__lte=Cast(F('stock_minimo'), FloatField()) * 1.25,
                    then=Value('bajo')
                ),
                default=Value('suficiente'),
                output_field=CharField(),
            )
        ).filter(
            status=estado_solicitado
        ).values(
            'nombre', 'cantidad', 'stock_minimo'
        ).order_by('nombre')

        return Response(list(queryset))
