# Заменить valid_until на countdown_start + duration_seconds (время до конца в формате ч:мм:сс)

from django.db import migrations, models
from django.utils import timezone
from datetime import timedelta


def convert_valid_until_to_duration(apps, schema_editor):
    HotOffer = apps.get_model('content', 'HotOffer')
    for offer in HotOffer.objects.all():
        valid_until = getattr(offer, 'valid_until', None)
        if valid_until:
            now = timezone.now()
            if valid_until > now:
                offer.countdown_start = now
                offer.duration_seconds = int((valid_until - now).total_seconds())
            else:
                offer.countdown_start = now
                offer.duration_seconds = 86400 * 30  # 30 дней по умолчанию
            offer.save()


def reverse_duration_to_valid_until(apps, schema_editor):
    # При откате поле valid_until ещё не добавлено в схему — оставляем no-op
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0021_sample_hot_offer'),
    ]

    operations = [
        migrations.AddField(
            model_name='hotoffer',
            name='countdown_start',
            field=models.DateTimeField(blank=True, help_text='С какого момента начинается отсчёт (по умолчанию — при сохранении)', null=True),
        ),
        migrations.AddField(
            model_name='hotoffer',
            name='duration_seconds',
            field=models.PositiveIntegerField(default=0, help_text='Время до конца акции в секундах (например 7140 = 1:59:00). 0 — таймер не показывать.'),
        ),
        migrations.RunPython(convert_valid_until_to_duration, reverse_duration_to_valid_until),
        migrations.RemoveField(
            model_name='hotoffer',
            name='valid_until',
        ),
    ]
