from django.contrib import admin
from django.urls import path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static
from marketplace import views as marketplace_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('', include('accounts.urls')),
    path('marketplace/', include('marketplace.urls')),
    
    # cart
    path('cart/', marketplace_views.cart, name='cart'),
    # Search
    path('search/', marketplace_views.search, name='search'),
    # checkout
    path('checkout/', marketplace_views.checkout, name='checkout'),
    # Orders
    path('orders/', include('orders.urls')),
    
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
