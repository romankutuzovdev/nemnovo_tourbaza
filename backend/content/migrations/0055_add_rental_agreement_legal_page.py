from django.db import migrations, models


def create_rental_agreement_page(apps, schema_editor):
    LegalPage = apps.get_model('content', 'LegalPage')
    if not LegalPage.objects.filter(page_key='rental-agreement').exists():
        LegalPage.objects.create(page_key='rental-agreement')


def remove_rental_agreement_page(apps, schema_editor):
    LegalPage = apps.get_model('content', 'LegalPage')
    LegalPage.objects.filter(page_key='rental-agreement').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0054_aboutcontent_presentation_pdf'),
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
                    ('rental-agreement', 'Договор аренды'),
                ],
                max_length=50,
                unique=True,
                verbose_name='Идентификатор',
            ),
        ),
        migrations.RunPython(create_rental_agreement_page, remove_rental_agreement_page),
    ]
