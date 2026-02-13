# Create Event and EventTranslation models

from django.db import migrations, models
import django.db.models.deletion


def load_default_events(apps, schema_editor):
    Event = apps.get_model('content', 'Event')
    EventTranslation = apps.get_model('content', 'EventTranslation')
    if Event.objects.exists():
        return
    marathons = Event.objects.create(slug='marathons', order=0)
    turslet = Event.objects.create(slug='turslet', order=1)
    for locale, titles in [
        ('ru', {'marathons': 'Марафоны', 'turslet': 'Турслёт'}),
        ('be', {'marathons': 'Марафоны', 'turslet': 'Турслёт'}),
        ('en', {'marathons': 'Marathons', 'turslet': 'Tour camp'}),
        ('pl', {'marathons': 'Maratony', 'turslet': 'Biwak'}),
        ('zh', {'marathons': '马拉松', 'turslet': '露营'}),
    ]:
        EventTranslation.objects.create(
            event=marathons, locale=locale,
            title=titles['marathons'],
            short_desc='',
        )
        EventTranslation.objects.create(
            event=turslet, locale=locale,
            title=titles['turslet'],
            short_desc='',
        )


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0013_companyinfo_state_registration'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=120, unique=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='events/')),
                ('image_url', models.URLField(blank=True, help_text='Если нет загрузки файла')),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Мероприятие',
                'verbose_name_plural': 'Мероприятия',
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='EventTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('title', models.CharField(max_length=200)),
                ('short_desc', models.TextField(blank=True)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.event')),
            ],
            options={
                'ordering': ['event', 'locale'],
                'unique_together': {('event', 'locale')},
            },
        ),
        migrations.RunPython(load_default_events, noop),
    ]
