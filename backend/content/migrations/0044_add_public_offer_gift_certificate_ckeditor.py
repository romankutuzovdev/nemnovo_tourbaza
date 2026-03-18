# Публичная оферта, подарочный сертификат, CKEditor для юридических страниц

import django_ckeditor_5.fields
from django.db import migrations, models


def create_legal_pages(apps, schema_editor):
    LegalPage = apps.get_model('content', 'LegalPage')
    for key in ('public-offer', 'gift-certificate'):
        if not LegalPage.objects.filter(page_key=key).exists():
            LegalPage.objects.create(page_key=key)


def remove_legal_pages(apps, schema_editor):
    LegalPage = apps.get_model('content', 'LegalPage')
    LegalPage.objects.filter(page_key__in=('public-offer', 'gift-certificate')).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0043_ckeditor_long_desc'),
    ]

    operations = [
        migrations.AlterField(
            model_name='legalpage',
            name='page_key',
            field=models.CharField(
                choices=[
                    ('privacy', 'Политика обработки персональных данных'),
                    ('cookie-policy', 'Политика в отношении обработки cookie'),
                    ('public-offer', 'Публичная оферта'),
                    ('gift-certificate', 'Подарочный сертификат'),
                ],
                max_length=50,
                unique=True,
                verbose_name='Идентификатор',
            ),
        ),
        migrations.AlterField(
            model_name='legalpagetranslation',
            name='content',
            field=django_ckeditor_5.fields.CKEditor5Field(
                blank=True,
                config_name='default',
                help_text='Редактор с форматированием: заголовки, списки, жирный текст и т.д.',
                verbose_name='Содержание',
            ),
        ),
        migrations.RunPython(create_legal_pages, remove_legal_pages),
    ]
