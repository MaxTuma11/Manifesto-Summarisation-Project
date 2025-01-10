from rest_framework import serializers
from manifestos.models import Manifesto

class ManifestoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manifesto
        fields = '__all__'