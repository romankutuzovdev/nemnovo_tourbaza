# Создание записей «Главная страница» и «Страница «О нас»», если их нет

from django.db import migrations


def ensure_about_content_records(apps, schema_editor):
    AboutContent = apps.get_model('content', 'AboutContent')
    for place in ['main', 'about']:
        if not AboutContent.objects.filter(place=place).exists():
            AboutContent.objects.create(place=place)


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0046_aboutcontent_video_url'),
    ]

    operations = [
        migrations.RunPython(ensure_about_content_records, migrations.RunPython.noop),
    ]
