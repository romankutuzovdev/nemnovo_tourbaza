# Data migration: заполнить реквизиты компании по умолчанию

from django.db import migrations


def load_company_info(apps, schema_editor):
    CompanyInfo = apps.get_model('content', 'CompanyInfo')
    if CompanyInfo.objects.exists():
        return
    CompanyInfo.objects.create(
        company_name='ООО «Немново Тур»',
        legal_address='Республика Беларусь, 230015 г. Гродно, ул. Богуцкого 2/1',
        office_address='Республика Беларусь, 230015 г. Гродно, ул. Богуцкого, 2/1',
        unp='591535043',
        okpo='508605124000',
        trade_register='Дата и номер регистрации в торговом реестре Республики Беларусь: 03.04.2025 г. № 746010',
        services_register='Дата и номер регистрации в реестре бытовых услуг Республики Беларусь: 27.03.2025 г. № 100797',
        contact_email='office@nemnovotour.by',
    )


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0004_companyinfo_alter_portfolioitem_image_urls_and_more'),
    ]

    operations = [
        migrations.RunPython(load_company_info, noop),
    ]
