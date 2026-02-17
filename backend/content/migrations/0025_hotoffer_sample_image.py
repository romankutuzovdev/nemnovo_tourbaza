# Установить картинку для примера «Специальное предложение»

from django.db import migrations

# Уютный домик/природа — подходит для турбазы
SAMPLE_IMAGE_URL = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80'


def set_sample_offer_image(apps, schema_editor):
    HotOffer = apps.get_model('content', 'HotOffer')
    offer = HotOffer.objects.filter(slug='special-offer').first()
    if offer:
        offer.image_url = SAMPLE_IMAGE_URL
        offer.save(update_fields=['image_url'])


def clear_sample_offer_image(apps, schema_editor):
    HotOffer = apps.get_model('content', 'HotOffer')
    offer = HotOffer.objects.filter(slug='special-offer').first()
    if offer:
        offer.image_url = ''
        offer.save(update_fields=['image_url'])


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0024_hotoffer_image_url'),
    ]

    operations = [
        migrations.RunPython(set_sample_offer_image, clear_sample_offer_image),
    ]
