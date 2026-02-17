# HotOffer: убрать image_url, добавить delay_seconds и valid_until

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0019_add_hot_offer'),
    ]

    operations = [
        migrations.AddField(
            model_name='hotoffer',
            name='delay_seconds',
            field=models.PositiveIntegerField(default=5, help_text='Через сколько секунд после захода на сайт показать попап'),
        ),
        migrations.AddField(
            model_name='hotoffer',
            name='valid_until',
            field=models.DateTimeField(blank=True, help_text='До какой даты действует предложение (для таймера обратного отсчёта)', null=True),
        ),
        migrations.RemoveField(
            model_name='hotoffer',
            name='image_url',
        ),
    ]
