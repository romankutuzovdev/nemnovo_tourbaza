# Добавить image_url в HotOffer (URL картинки для примера или без загрузки файла)

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0023_remove_hotoffer_countdown_start'),
    ]

    operations = [
        migrations.AddField(
            model_name='hotoffer',
            name='image_url',
            field=models.URLField(blank=True, help_text='URL картинки, если не загружен файл'),
        ),
    ]
