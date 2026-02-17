# Убрать поле countdown_start из HotOffer

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0022_hotoffer_time_until_end'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hotoffer',
            name='countdown_start',
        ),
    ]
