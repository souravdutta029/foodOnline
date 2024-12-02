from django.urls import path
from . import views
from accounts import views as AccountsViews

urlpatterns = [
    path('', AccountsViews.custDashboard, name='customer'),
    path('profile/', views.cprofile, name='cprofile'),
]
