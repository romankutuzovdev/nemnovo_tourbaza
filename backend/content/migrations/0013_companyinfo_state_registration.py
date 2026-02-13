# Add state_registration field and update requisites

from django.db import migrations, models


def update_company_info(apps, schema_editor):
    CompanyInfo = apps.get_model('content', 'CompanyInfo')
    for obj in CompanyInfo.objects.all():
        obj.legal_address = '231734, Гродненская область, Гродненский район д. Немново, 15 – 7'
        obj.office_address = 'Республика Беларусь, 230002 г. Гродно, ул. Богуцкого, 2/1'
        obj.state_registration = 'Свидетельство о государственной регистрации и юридического лица №591535043 от 31.01.2025'
        obj.trade_register = 'Дата и номер регистрации в торговом реестре Республики Беларусь: 03.04.2025 г. №746010'
        obj.services_register = 'Дата и номер регистрации в реестре бытовых услуг Республики Беларусь: 27.03.2025 г. №100797'
        obj.save()
        break  # only first record


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0012_remove_news'),
    ]

    operations = [
        migrations.AddField(
            model_name='companyinfo',
            name='state_registration',
            field=models.CharField(blank=True, max_length=300, verbose_name='Свидетельство о госрегистрации'),
        ),
        migrations.RunPython(update_company_info, noop),
    ]
