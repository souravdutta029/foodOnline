from django.contrib import admin
from .models import Order, OrderedFood, Payment


class OrderedFoodInline(admin.TabularInline):
    model = OrderedFood
    readonly_fields = ('payment', 'user', 'order', 'fooditem', 'quantity', 'price', 'amount')
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'name', 'phone', 'email', 'total', 'payment_method', 'status', 'is_ordered', 'created_at']
    inlines = [OrderedFoodInline]

admin.site.register(Payment)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderedFood)