from django.contrib.auth import login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.models import User
from django.conf import settings
import requests


# Create your views here.
class VerifySessionView(APIView):
    permission_classes = [permissions.AllowAny]

    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        try:
            if request.user.is_authenticated:
                user = request.user
                return Response({
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                    }
                }, status=status.HTTP_200_OK)

            return Response({"user": None}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GooglePopupLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get("code")
        if not code:
            return Response(
                {"detail": "Authorization code is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token_response = requests.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": "postmessage",
                    "grant_type": "authorization_code",
                },
                timeout=10
            )
            token_response.raise_for_status()
            tokens = token_response.json()

            access_token = tokens.get("access_token")

            user_info_response = requests.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                params={"access_token": access_token}
            )
            user_info_response.raise_for_status()
            id_info = user_info_response.json()

        except requests.RequestException as e:
            return Response(
                {"detail": "Failed to exchange code or get user info."},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = id_info.get("email")
        if not email:
            return Response({"detail": "Email not provided by Google."}, status=status.HTTP_400_BAD_REQUEST)

        user, _ = User.objects.get_or_create(
            username=email,
            defaults={
                "email": email,
                "first_name": id_info.get("given_name", ""),
                "last_name": id_info.get("family_name", ""),
            }
        )

        login(request, user)

        return Response(
            {
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                }
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(
            {"message": "Successfully logged out"},
            status=status.HTTP_200_OK
        )
