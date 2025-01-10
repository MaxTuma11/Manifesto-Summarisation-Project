from manifestos.models import Manifesto
from django.http import JsonResponse
from manifestos.serializers import ManifestoSerializer

def manifestos(request):
    #invoke serializer and return to client
    data = Manifesto.objects.all()
    serializer = ManifestoSerializer(data, many=True)
    return JsonResponse({'manifestos': serializer.data})