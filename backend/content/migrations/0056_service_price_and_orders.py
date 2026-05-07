from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0055_add_rental_agreement_legal_page'),
    ]

    operations = [
        migrations.AddField(
            model_name='service',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Цена услуги в BYN. Если пусто — цена не показывается и услуга недоступна для корзины.', max_digits=10, null=True, verbose_name='Цена'),
        ),
        migrations.CreateModel(
            name='ServiceOrder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('customer_name', models.CharField(max_length=200, verbose_name='Имя заказчика')),
                ('customer_email', models.EmailField(blank=True, max_length=254, verbose_name='Email')),
                ('customer_phone', models.CharField(blank=True, max_length=50, verbose_name='Телефон')),
                ('comment', models.TextField(blank=True, verbose_name='Комментарий')),
                ('total_amount', models.DecimalField(decimal_places=2, default=0, max_digits=12, verbose_name='Сумма заказа')),
                ('status', models.CharField(choices=[('new', 'Новый'), ('in_progress', 'В работе'), ('done', 'Завершён'), ('cancelled', 'Отменён')], default='new', max_length=20, verbose_name='Статус')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
            ],
            options={
                'verbose_name': 'Заказ услуги',
                'verbose_name_plural': 'Заказы услуг',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ServiceOrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=1, verbose_name='Количество')),
                ('unit_price', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Цена за единицу')),
                ('line_total', models.DecimalField(decimal_places=2, max_digits=12, verbose_name='Сумма позиции')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='content.serviceorder')),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='order_items', to='content.service')),
            ],
            options={
                'verbose_name': 'Позиция заказа',
                'verbose_name_plural': 'Позиции заказа',
            },
        ),
    ]
