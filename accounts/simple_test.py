from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


class SimpleTestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Test simple pour vérifier que l'API fonctionne"""
        return Response({
            "message": "API test successful",
            "user": request.user.username,
            "role": request.user.role
        })
