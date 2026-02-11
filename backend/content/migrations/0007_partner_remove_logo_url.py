from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0006_add_partner'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='partner',
            name='logo_url',
        ),
    ]
