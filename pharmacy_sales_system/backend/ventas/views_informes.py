from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils import timezone
from datetime import timedelta

from .models import Venta
from productos.models import Producto
from django.db.models import Sum, Count, F, Value, Case, When
from django.db.models.functions import TruncDay
import collections

class EnviarInformeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        periodo = request.data.get('periodo', 'dia')
        destinatario = request.data.get('destinatario')

        if not destinatario:
            return Response({"error": "El correo del destinatario es requerido."}, status=400)

        hoy = timezone.now().date()
        if periodo == 'mes':
            fecha_inicio = hoy.replace(day=1)
            fecha_fin = hoy
        elif periodo == 'semana':
            fecha_inicio = hoy - timedelta(days=hoy.weekday())
            fecha_fin = hoy
        else:
            fecha_inicio = hoy
            fecha_fin = hoy

        ventas_diarias = Venta.objects.filter(fecha__date__range=[fecha_inicio, fecha_fin]).annotate(fecha_dia=TruncDay('fecha')).values('fecha_dia').annotate(total=Sum('total_neto')).order_by('fecha_dia')
        gran_total = sum(item['total'] for item in ventas_diarias) if ventas_diarias else 0

        stock_queryset = Producto.objects.annotate(status=Case(When(cantidad=0, then=Value('agotado')), When(cantidad__lte=F('stock_minimo'), then=Value('critico')), When(cantidad__lte=F('stock_minimo') * 1.25, then=Value('bajo')), default=Value('suficiente'))).values('status').annotate(count=Count('id'))
        stock_counts = collections.defaultdict(int)
        for item in stock_queryset:
            stock_counts[item['status']] = item['count']

        context = {
            'ventas_diarias': [{'fecha': item['fecha_dia'], 'total': item['total']} for item in ventas_diarias],
            'gran_total': gran_total,
            'stock_counts': stock_counts,
            'fecha_inicio': fecha_inicio,
            'fecha_fin': fecha_fin,
            'fecha_generacion': timezone.now()
        }

        try:
            html_content = render_to_string('reporte_ventas.html', context)
            email = EmailMessage(
                subject=f"Informe de Ventas - {fecha_inicio.strftime('%d/%m/%Y')} a {fecha_fin.strftime('%d/%m/%Y')}",
                body=html_content,
                from_email=None,
                to=[destinatario]
            )
            email.content_subtype = "html"
            email.send()
        except Exception as e:
            return Response({"error": f"No se pudo enviar el correo: {e}"}, status=500)

        return Response({"message": "Informe enviado con éxito."})