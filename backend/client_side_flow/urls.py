from django.urls import path

from client_side_flow.views import GoogleLoginView, VerifySessionView, LogoutView

urlpatterns = [
    path('google-popup-login/', GoogleLoginView.as_view(), name='google_login'),
    path('verify/', VerifySessionView.as_view(), name='verify_session'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
