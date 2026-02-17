# Добавить пример горячего предложения, чтобы попап мог отображаться

from django.db import migrations
from django.utils import timezone
from datetime import timedelta


def create_sample_hot_offer(apps, schema_editor):
    HotOffer = apps.get_model('content', 'HotOffer')
    HotOfferTranslation = apps.get_model('content', 'HotOfferTranslation')
    if HotOffer.objects.filter(slug='special-offer').exists():
        return
    offer = HotOffer.objects.create(
        slug='special-offer',
        order=0,
        is_active=True,
        delay_seconds=5,
        valid_until=timezone.now() + timedelta(days=30),
        link_url='',
    )
    for locale, data in [
        ('ru', {'title': 'Специальное предложение', 'short_desc': 'Скидка 10% при бронировании до конца месяца. Оставьте заявку — мы перезвоним.', 'button_text': 'Подробнее'}),
        ('be', {'title': 'Спецыяльная прапанова', 'short_desc': 'Зніжка 10% пры браніраванні да канца месяца. Пакіньце заяўку — мы патэлефануем.', 'button_text': 'Падрабязней'}),
        ('en', {'title': 'Special offer', 'short_desc': '10% discount when booking before the end of the month. Leave a request and we will call you back.', 'button_text': 'Learn more'}),
        ('pl', {'title': 'Oferta specjalna', 'short_desc': '10% zniżki przy rezerwacji do końca miesiąca. Zostaw zapytanie — oddzwonimy.', 'button_text': 'Więcej'}),
        ('zh', {'title': '特别优惠', 'short_desc': '月底前预订享九折。留下咨询，我们会回电。', 'button_text': '了解更多'}),
    ]:
        HotOfferTranslation.objects.create(
            hot_offer=offer,
            locale=locale,
            title=data['title'],
            short_desc=data['short_desc'],
            button_text=data['button_text'],
        )


def remove_sample_hot_offer(apps, schema_editor):
    HotOffer = apps.get_model('content', 'HotOffer')
    HotOffer.objects.filter(slug='special-offer').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0020_hotoffer_delay_valid_remove_image_url'),
    ]

    operations = [
        migrations.RunPython(create_sample_hot_offer, remove_sample_hot_offer),
    ]
