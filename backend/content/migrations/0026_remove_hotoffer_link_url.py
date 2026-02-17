# Удалить поле link_url из HotOffer

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0025_hotoffer_sample_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hotoffer',
            name='link_url',
        ),
    ]
