from django.urls import path

from accounts.views import VerifySessionView, GooglePopupLoginView, LogoutView

urlpatterns = [
    path('verify/', VerifySessionView.as_view(), name='verify_session'),
    path('google-popup-login/', GooglePopupLoginView.as_view(), name='google_popup_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
