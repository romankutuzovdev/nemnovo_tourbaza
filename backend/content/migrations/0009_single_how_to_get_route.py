# Рефакторинг: одна модель маршрута вместо City + Block

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0008_how_to_get'),
    ]

    operations = [
        migrations.CreateModel(
            name='HowToGetRoute',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('city_slug', models.SlugField(max_length=80, verbose_name='Код города')),
                ('transport_type', models.CharField(
                    choices=[('plane', 'На самолёте'), ('bus', 'На автобусе'), ('train', 'На поезде'), ('car', 'На собственном транспорте')],
                    max_length=20,
                    verbose_name='Способ',
                )),
                ('order', models.PositiveIntegerField(default=0, verbose_name='Порядок')),
            ],
            options={
                'verbose_name': 'Маршрут (как добраться)',
                'verbose_name_plural': 'Маршруты (как добраться)',
                'ordering': ['city_slug', 'order', 'id'],
                'unique_together': {('city_slug', 'transport_type')},
            },
        ),
        migrations.CreateModel(
            name='HowToGetRouteTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('city_name', models.CharField(max_length=120, verbose_name='Название кнопки города')),
                ('title', models.CharField(max_length=200, verbose_name='Заголовок способа')),
                ('content', models.TextField(blank=True, verbose_name='Описание')),
                ('route', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.howtogetroute')),
            ],
            options={
                'ordering': ['route', 'locale'],
                'unique_together': {('route', 'locale')},
            },
        ),
        migrations.DeleteModel(name='HowToGetBlockTranslation'),
        migrations.DeleteModel(name='HowToGetBlock'),
        migrations.DeleteModel(name='HowToGetCityTranslation'),
        migrations.DeleteModel(name='HowToGetCity'),
    ]
