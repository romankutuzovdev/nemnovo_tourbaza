# Generated manually for Partner model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0005_load_default_company_info'),
    ]

    operations = [
        migrations.CreateModel(
            name='Partner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='Название')),
                ('logo', models.ImageField(blank=True, null=True, upload_to='partners/', verbose_name='Логотип')),
                ('logo_url', models.URLField(blank=True, help_text='Если не загружаете файл', verbose_name='URL логотипа')),
                ('link', models.URLField(blank=True, verbose_name='Ссылка на сайт')),
                ('order', models.PositiveIntegerField(default=0, verbose_name='Порядок')),
            ],
            options={
                'verbose_name': 'Партнёр',
                'verbose_name_plural': 'Партнёры',
                'ordering': ['order', 'id'],
            },
        ),
    ]
