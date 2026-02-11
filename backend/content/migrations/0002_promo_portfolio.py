# Promo (акции) и PortfolioItem (фотоотчёты с мероприятий, с закреплением)

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Promo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=120, unique=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='promos/')),
                ('image_url', models.URLField(blank=True)),
                ('order', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='PromoTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('title', models.CharField(max_length=200)),
                ('short_desc', models.TextField(blank=True)),
                ('long_desc', models.TextField(blank=True)),
                ('promo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.promo')),
            ],
            options={
                'ordering': ['promo', 'locale'],
                'unique_together': {('promo', 'locale')},
            },
        ),
        migrations.CreateModel(
            name='PortfolioItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=120, unique=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='portfolio/')),
                ('image_url', models.URLField(blank=True)),
                ('image_urls', models.JSONField(blank=True, default=list, help_text='Список URL дополнительных фото')),
                ('event_date', models.DateField(blank=True, null=True)),
                ('order', models.PositiveIntegerField(default=0)),
                ('is_pinned', models.BooleanField(default=False, help_text='Закрепить блок выше остальных')),
            ],
            options={
                'ordering': ['-is_pinned', 'order', '-event_date', 'id'],
            },
        ),
        migrations.CreateModel(
            name='PortfolioItemTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('title', models.CharField(max_length=300)),
                ('description', models.TextField(blank=True)),
                ('portfolio_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.portfolioitem')),
            ],
            options={
                'ordering': ['portfolio_item', 'locale'],
                'unique_together': {('portfolio_item', 'locale')},
            },
        ),
    ]
