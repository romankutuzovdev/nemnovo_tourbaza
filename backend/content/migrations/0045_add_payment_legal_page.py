# Добавление страницы «Условия оплаты» в юридические страницы

from django.db import migrations, models


def create_payment_page(apps, schema_editor):
    LegalPage = apps.get_model('content', 'LegalPage')
    if not LegalPage.objects.filter(page_key='payment').exists():
        LegalPage.objects.create(page_key='payment')


def remove_payment_page(apps, schema_editor):
    LegalPage = apps.get_model('content', 'LegalPage')
    LegalPage.objects.filter(page_key='payment').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0044_add_public_offer_gift_certificate_ckeditor'),
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
                    ('payment', 'Условия оплаты'),
                ],
                max_length=50,
                unique=True,
                verbose_name='Идентификатор',
            ),
        ),
        migrations.RunPython(create_payment_page, remove_payment_page),
    ]
