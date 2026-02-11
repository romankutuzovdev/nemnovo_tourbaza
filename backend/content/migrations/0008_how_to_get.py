from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0007_partner_remove_logo_url'),
    ]

    operations = [
        migrations.CreateModel(
            name='HowToGetCity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=80, unique=True, verbose_name='Код')),
                ('order', models.PositiveIntegerField(default=0, verbose_name='Порядок')),
            ],
            options={
                'verbose_name': 'Город (как добраться)',
                'verbose_name_plural': 'Города (как добраться)',
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='HowToGetCityTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('name', models.CharField(max_length=120, verbose_name='Название кнопки')),
                ('city', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.howtogetcity')),
            ],
            options={
                'ordering': ['city', 'locale'],
                'unique_together': {('city', 'locale')},
            },
        ),
        migrations.CreateModel(
            name='HowToGetBlock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transport_type', models.CharField(choices=[('plane', 'На самолёте'), ('bus', 'На автобусе'), ('train', 'На поезде'), ('car', 'На собственном транспорте')], max_length=20, verbose_name='Тип транспорта')),
                ('order', models.PositiveIntegerField(default=0, verbose_name='Порядок')),
                ('city', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blocks', to='content.howtogetcity')),
            ],
            options={
                'verbose_name': 'Блок способа (как добраться)',
                'verbose_name_plural': 'Блоки способов (как добраться)',
                'ordering': ['order', 'id'],
                'unique_together': {('city', 'transport_type')},
            },
        ),
        migrations.CreateModel(
            name='HowToGetBlockTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('title', models.CharField(max_length=200, verbose_name='Заголовок')),
                ('content', models.TextField(blank=True, verbose_name='Текст')),
                ('block', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.howtogetblock')),
            ],
            options={
                'ordering': ['block', 'locale'],
                'unique_together': {('block', 'locale')},
            },
        ),
        migrations.AddField(
            model_name='companyinfo',
            name='destination_address',
            field=models.TextField(blank=True, verbose_name='Адрес назначения (как добраться)'),
        ),
        migrations.AddField(
            model_name='companyinfo',
            name='destination_gps_lat',
            field=models.FloatField(blank=True, null=True, verbose_name='GPS широта'),
        ),
        migrations.AddField(
            model_name='companyinfo',
            name='destination_gps_lon',
            field=models.FloatField(blank=True, null=True, verbose_name='GPS долгота'),
        ),
    ]
