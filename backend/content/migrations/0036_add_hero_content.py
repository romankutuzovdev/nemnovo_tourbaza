from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0035_add_service_variant'),
    ]

    operations = [
        migrations.CreateModel(
            name='HeroContent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to='hero/')),
                ('image_url', models.URLField(blank=True, help_text='Если нет загрузки файла')),
            ],
            options={
                'verbose_name': 'Главный блок (Hero)',
                'verbose_name_plural': 'Главный блок (Hero)',
            },
        ),
        migrations.CreateModel(
            name='HeroContentTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('badge', models.CharField(blank=True, max_length=200, verbose_name='Надпись-бейдж')),
                ('title1', models.CharField(blank=True, max_length=200, verbose_name='Заголовок строка 1')),
                ('title2', models.CharField(blank=True, max_length=200, verbose_name='Заголовок строка 2')),
                ('subtitle', models.TextField(blank=True, verbose_name='Подзаголовок')),
                ('hero', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.herocontent')),
            ],
            options={
                'verbose_name': 'Перевод Hero',
                'verbose_name_plural': 'Переводы Hero',
                'ordering': ['hero', 'locale'],
                'unique_together': {('hero', 'locale')},
            },
        ),
    ]
