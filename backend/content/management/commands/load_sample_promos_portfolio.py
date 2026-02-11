"""
Добавляет примерные акции и блоки портфолио (фотоотчёты).
Запуск: python manage.py load_sample_promos_portfolio
"""
from datetime import date
from django.core.management.base import BaseCommand
from content.models import Promo, PromoTranslation, PortfolioItem, PortfolioItemTranslation

LOCALES = ['ru', 'be', 'en', 'pl', 'zh']

SAMPLE_PROMOS = [
    {
        'slug': 'budni-osenyu',
        'order': 0,
        'image_url': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        'translations': {
            'ru': {'title': 'Будни осенью', 'short_desc': 'Скидка на проживание в будние дни', 'long_desc': ''},
            'be': {'title': 'Будні восенню', 'short_desc': 'Зніжка на пражыванне ў буднія дні', 'long_desc': ''},
            'en': {'title': 'Weekdays in autumn', 'short_desc': 'Discount on weekday stays', 'long_desc': ''},
            'pl': {'title': 'Dni powszednie jesienią', 'short_desc': 'Zniżka na pobyt w dni powszednie', 'long_desc': ''},
            'zh': {'title': '秋季平日', 'short_desc': '平日住宿优惠', 'long_desc': ''},
        },
    },
    {
        'slug': 'zimniy-otdyh',
        'order': 1,
        'image_url': 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800',
        'translations': {
            'ru': {'title': 'Зимний отдых', 'short_desc': 'Тёплые домики и природа зимой', 'long_desc': ''},
            'be': {'title': 'Зімовы адпачынак', 'short_desc': 'Цёплыя дамы і прырода зімой', 'long_desc': ''},
            'en': {'title': 'Winter break', 'short_desc': 'Warm cottages and winter nature', 'long_desc': ''},
            'pl': {'title': 'Wypoczynek zimowy', 'short_desc': 'Ciepłe domki i zimowa przyroda', 'long_desc': ''},
            'zh': {'title': '冬季度假', 'short_desc': '温暖小屋与冬日自然', 'long_desc': ''},
        },
    },
]

SAMPLE_PORTFOLIO = [
    {
        'slug': 'den-turista-2024',
        'order': 0,
        'is_pinned': True,
        'event_date': '2024-09-27',
        'image_url': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
        # Дополнительные фото мероприятия (будут отображаться в галерее и попадать в ZIP)
        'image_urls': [
            'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
            'https://images.unsplash.com/photo-1526481280695-3c687fd543c0?w=800',
            'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
            'https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0?w=800',
            'https://images.unsplash.com/photo-1526481280693-3b113b1dfaf7?w=800',
        ],
        'translations': {
            'ru': {'title': 'День туриста 2024', 'description': 'Фото с праздника на территории турбазы.'},
            'be': {'title': 'Дзень турыста 2024', 'description': 'Фота з свята на тэрыторыі турбазы.'},
            'en': {'title': 'Tourist Day 2024', 'description': 'Photos from the event at the tour base.'},
            'pl': {'title': 'Dzień Turysty 2024', 'description': 'Zdjęcia z imprezy na terenie bazy.'},
            'zh': {'title': '旅游日 2024', 'description': '旅游基地活动现场照片。'},
        },
    },
    {
        'slug': 'korporativ-iyun',
        'order': 1,
        'is_pinned': False,
        'event_date': '2024-06-15',
        'image_url': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
        'image_urls': [
            'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800',
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
            'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        ],
        'translations': {
            'ru': {'title': 'Корпоратив, июнь', 'description': 'Выезд компании: баня, шашлыки, природа.'},
            'be': {'title': 'Карпаратыў, чэрвень', 'description': 'Выезд кампаніі: лазня, шашлыкі, прырода.'},
            'en': {'title': 'Corporate event, June', 'description': 'Company outing: sauna, barbecue, nature.'},
            'pl': {'title': 'Impreza firmowa, czerwiec', 'description': 'Wyjazd firmowy: sauna, grill, przyroda.'},
            'zh': {'title': '企业活动 六月', 'description': '公司出游：桑拿、烧烤、自然。'},
        },
    },
]


class Command(BaseCommand):
    help = 'Создаёт примерные акции и блоки портфолио'

    def handle(self, *args, **options):
        for data in SAMPLE_PROMOS:
            promo, created = Promo.objects.update_or_create(
                slug=data['slug'],
                defaults={
                    'order': data['order'],
                    'image_url': data['image_url'],
                    'is_active': True,
                },
            )
            self.stdout.write(f'{"Создана" if created else "Обновлена"} акция: {data["slug"]}')
            for loc in LOCALES:
                tr = data['translations'][loc]
                PromoTranslation.objects.update_or_create(
                    promo=promo,
                    locale=loc,
                    defaults={'title': tr['title'], 'short_desc': tr['short_desc'], 'long_desc': tr['long_desc']},
                )

        for data in SAMPLE_PORTFOLIO:
            item, created = PortfolioItem.objects.update_or_create(
                slug=data['slug'],
                defaults={
                    'order': data['order'],
                    'is_pinned': data['is_pinned'],
                    'event_date': date.fromisoformat(data['event_date']) if data.get('event_date') else None,
                    'image_url': data.get('image_url', ''),
                    'image_urls': data.get('image_urls', []),
                },
            )
            self.stdout.write(f'{"Создан" if created else "Обновлён"} блок портфолио: {data["slug"]}')
            for loc in LOCALES:
                tr = data['translations'][loc]
                PortfolioItemTranslation.objects.update_or_create(
                    portfolio_item=item,
                    locale=loc,
                    defaults={'title': tr['title'], 'description': tr['description']},
                )

        self.stdout.write(self.style.SUCCESS('Готово: акции и портфолио добавлены.'))
