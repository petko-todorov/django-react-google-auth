from django.urls import path

from accounts.views import VerifySessionView, LogoutView, GoogleLoginView

urlpatterns = [
    path('verify/', VerifySessionView.as_view(), name='verify_session'),
    path('google-login/', GoogleLoginView.as_view(), name='google_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
