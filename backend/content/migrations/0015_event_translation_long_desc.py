# Add long_desc to EventTranslation for event detail page

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0014_event_eventtranslation'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventtranslation',
            name='long_desc',
            field=models.TextField(blank=True, help_text='Расширенное описание для страницы мероприятия'),
        ),
    ]
