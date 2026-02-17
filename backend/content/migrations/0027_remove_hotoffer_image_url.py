# Удалить поле image_url из HotOffer

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0026_remove_hotoffer_link_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hotoffer',
            name='image_url',
        ),
    ]
