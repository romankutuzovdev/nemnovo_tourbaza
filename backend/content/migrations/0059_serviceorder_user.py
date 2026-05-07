from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('content', '0058_variant_price_and_order_item_variant'),
    ]

    operations = [
        migrations.AddField(
            model_name='serviceorder',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='service_orders', to=settings.AUTH_USER_MODEL, verbose_name='Пользователь'),
        ),
    ]
