from django.urls import path, include
from rest_framework import routers
from .views import VentaViewSet

from .views_estadisticas import VentasPorFechaAPIView, TopProductosAPIView, StockStatusAPIView, ProductosPorEstadoAPIView
from .views_informes import EnviarInformeAPIView

router = routers.DefaultRouter()
router.register(r'ventas', VentaViewSet, basename='venta')

urlpatterns = [
    path('', include(router.urls)),

    path('estadisticas/ventas-por-fecha/', VentasPorFechaAPIView.as_view(), name='stats-ventas-fecha'),
    path('estadisticas/top-productos/', TopProductosAPIView.as_view(), name='stats-top-productos'),
    path('estadisticas/stock-status/', StockStatusAPIView.as_view(), name='stats-stock-status'),
    path('estadisticas/productos-por-estado/', ProductosPorEstadoAPIView.as_view(), name='stats-productos-por-estado'),
    path('informes/enviar/', EnviarInformeAPIView.as_view(), name='enviar-informe'),
]