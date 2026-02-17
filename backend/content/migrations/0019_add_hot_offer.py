# HotOffer — горячие предложения для всплывающего окна

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0018_sample_news'),
    ]

    operations = [
        migrations.CreateModel(
            name='HotOffer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=120, unique=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='hot_offers/')),
                ('image_url', models.URLField(blank=True, help_text='Если нет загрузки файла')),
                ('link_url', models.URLField(blank=True, help_text='Ссылка кнопки (например на страницу услуги или акции)')),
                ('order', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'ordering': ['order', 'id'],
                'verbose_name': 'Горячее предложение',
                'verbose_name_plural': 'Горячие предложения',
            },
        ),
        migrations.CreateModel(
            name='HotOfferTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('title', models.CharField(max_length=200)),
                ('short_desc', models.TextField(blank=True)),
                ('button_text', models.CharField(blank=True, default='Подробнее', max_length=100)),
                ('hot_offer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.hotoffer')),
            ],
            options={
                'ordering': ['hot_offer', 'locale'],
                'unique_together': {('hot_offer', 'locale')},
            },
        ),
    ]
