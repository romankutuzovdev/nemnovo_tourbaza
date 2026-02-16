# Set default image_url for events (marathons, turslet) so images display on frontend

from django.db import migrations


# Placeholder images from Unsplash (allowed in Next.js remotePatterns)
MARATHONS_IMAGE = 'https://images.unsplash.com/photo-1452626038303-9f16cab761f6?w=800'
TURSLET_IMAGE = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'


def set_event_image_urls(apps, schema_editor):
    Event = apps.get_model('content', 'Event')
    for slug, url in [('marathons', MARATHONS_IMAGE), ('turslet', TURSLET_IMAGE)]:
        Event.objects.filter(slug=slug).update(image_url=url)


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0015_event_translation_long_desc'),
    ]

    operations = [
        migrations.RunPython(set_event_image_urls, noop),
    ]
