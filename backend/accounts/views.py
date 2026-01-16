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


class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get("code")
        flow = request.data.get("flow")

        if not code:
            return Response({"detail": "Code is required."}, status=400)

        if flow == 'popup':
            redirect_uri = "postmessage"
        elif flow == 'redirect':
            redirect_uri = "http://localhost:5173/google-callback"
        else:
            return Response({"detail": "Invalid or missing flow type."}, status=400)

        try:
            token_response = requests.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code",
                },
                timeout=10
            )
            token_response.raise_for_status()
            tokens = token_response.json()

            user_info = requests.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                params={"access_token": tokens.get("access_token")},
                timeout=10
            ).json()
            google_id = user_info.get("sub")
            email = user_info.get("email")

            user, _ = User.objects.get_or_create(
                username=google_id,
                defaults={
                    "email": email,
                    "first_name": user_info.get("given_name", ""),
                    "last_name": user_info.get("family_name", ""),
                }
            )

            login(request, user)

            return Response({
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "picture": user_info.get("picture", "")
                }
            }, status=200)

        except Exception as e:
            return Response({"detail": str(e)}, status=400)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(
            {"message": "Successfully logged out"},
            status=status.HTTP_200_OK
        )
