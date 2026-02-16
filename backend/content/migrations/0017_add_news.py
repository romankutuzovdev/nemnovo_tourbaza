# Add News and NewsTranslation models

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0016_set_default_event_image_urls'),
    ]

    operations = [
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=120, unique=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='news/')),
                ('image_url', models.URLField(blank=True, help_text='Если нет загрузки файла')),
                ('order', models.PositiveIntegerField(default=0)),
                ('is_published', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-created_at', 'order', 'id'],
                'verbose_name': 'Новость',
                'verbose_name_plural': 'Новости',
            },
        ),
        migrations.CreateModel(
            name='NewsTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('title', models.CharField(max_length=200)),
                ('short_desc', models.TextField(blank=True)),
                ('long_desc', models.TextField(blank=True, help_text='Полный текст новости')),
                ('news', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.news')),
            ],
            options={
                'ordering': ['news', 'locale'],
                'unique_together': {('news', 'locale')},
            },
        ),
    ]
