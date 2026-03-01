from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0034_add_service_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='ServiceVariant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='Название')),
                ('description', models.TextField(blank=True, verbose_name='Описание')),
                ('order', models.PositiveIntegerField(default=0)),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='variants', to='content.service')),
            ],
            options={
                'verbose_name': 'Вариант услуги',
                'verbose_name_plural': 'Варианты услуги',
                'ordering': ['order', 'id'],
            },
        ),
    ]
