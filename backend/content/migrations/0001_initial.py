# Generated manually for content app

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=120, unique=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='services/')),
                ('image_url', models.URLField(blank=True, help_text='Если нет загрузки файла')),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='ServiceTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('title', models.CharField(max_length=200)),
                ('short_desc', models.TextField(blank=True)),
                ('long_desc', models.TextField(help_text='Список пунктов через • или перенос строки')),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.service')),
            ],
            options={
                'ordering': ['service', 'locale'],
                'unique_together': {('service', 'locale')},
            },
        ),
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=120, unique=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='news/')),
                ('image_url', models.URLField(blank=True)),
                ('published_at', models.DateTimeField(blank=True, null=True)),
                ('is_published', models.BooleanField(default=False)),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'ordering': ['-published_at', '-id'],
            },
        ),
        migrations.CreateModel(
            name='NewsTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('title', models.CharField(max_length=300)),
                ('excerpt', models.TextField(blank=True)),
                ('content', models.TextField(blank=True)),
                ('news', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.news')),
            ],
            options={
                'ordering': ['news', 'locale'],
                'unique_together': {('news', 'locale')},
            },
        ),
    ]
