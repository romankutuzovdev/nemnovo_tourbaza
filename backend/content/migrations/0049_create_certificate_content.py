# Создание записи подарочного сертификата по умолчанию

from django.db import migrations


def create_certificate(apps, schema_editor):
    CertificateContent = apps.get_model('content', 'CertificateContent')
    CertificateContentTranslation = apps.get_model('content', 'CertificateContentTranslation')
    if CertificateContent.objects.exists():
        return
    cert = CertificateContent.objects.create()
    CertificateContentTranslation.objects.create(
        certificate=cert,
        locale='ru',
        title='Подарочный сертификат',
        content='',
    )


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0048_certificate_content'),
    ]

    operations = [
        migrations.RunPython(create_certificate, migrations.RunPython.noop),
    ]
