"""
Добавляет 6 примерных услуг с картинками (image_url), как в макете.
Услуги можно добавлять и редактировать в админке: /admin/content/service/
Запуск: python manage.py load_sample_services
"""
from django.core.management.base import BaseCommand
from content.models import Service, ServiceTranslation

LOCALES = ['ru', 'be', 'en', 'pl', 'zh']

SAMPLE_SERVICES = [
    {
        'slug': 'razmeschenie',
        'order': 1,
        'image_url': 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
        'translations': {
            'ru': {
                'title': 'Размещение',
                'short_desc': 'Хостел, размещение домов на колёсах, размещение на палаточном поле.',
                'long_desc': 'Варианты:\n• Хостел с двухъярусными кроватями\n• Размещение автодомов (электричество, вода)\n• Палаточное поле\n\nУдобства:\n• Туалеты, душ\n• Кухня для гостей',
            },
            'be': {'title': 'Размяшченне', 'short_desc': 'Хостел, размяшченне дамоў на колах, палаточная пляцоўка.', 'long_desc': ''},
            'en': {'title': 'Accommodation', 'short_desc': 'Hostel, camper van accommodation, tent field.', 'long_desc': ''},
            'pl': {'title': 'Noclegi', 'short_desc': 'Hostel, miejsce na kampery, pole namiotowe.', 'long_desc': ''},
            'zh': {'title': '住宿', 'short_desc': '青旅、房车营地、帐篷区。', 'long_desc': ''},
        },
    },
    {
        'slug': 'besedki-i-shatry',
        'order': 2,
        'image_url': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
        'translations': {
            'ru': {
                'title': 'Беседки и шатры',
                'short_desc': 'Беседки на 12, 20 и 40 мест, шатры для мероприятий.',
                'long_desc': 'Беседки:\n• На 12 человек\n• На 20 человек\n• На 40 человек\n\nШатры:\n• Для праздников и корпоративов\n• Столы, скамейки, электричество',
            },
            'be': {'title': 'Беседкі і шатры', 'short_desc': 'Беседкі на 12, 20 і 40 месцаў, шатры для мерапрыемстваў.', 'long_desc': ''},
            'en': {'title': 'Arbours and marquees', 'short_desc': 'Arbours for 12, 20 and 40 people, marquees for events.', 'long_desc': ''},
            'pl': {'title': 'Altany i namioty', 'short_desc': 'Altany na 12, 20 i 40 osób, namioty na imprezy.', 'long_desc': ''},
            'zh': {'title': '凉亭与帐篷', 'short_desc': '12、20、40人凉亭，活动用帐篷。', 'long_desc': ''},
        },
    },
    {
        'slug': 'inventar-dlya-piknika-i-banya',
        'order': 3,
        'image_url': 'https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=800',
        'translations': {
            'ru': {
                'title': 'Инвентарь для пикника и баня',
                'short_desc': 'Мангал, решётки, казан, дрова, туристическая баня, столы, скамейки, сцена, звук.',
                'long_desc': 'Пикник:\n• Мангал, решётки, казан\n• Дрова\n• Столы и скамейки\n\nБаня:\n• Туристическая баня на дровах\n• Предварительная бронь\n\nМероприятия:\n• Сцена, звук',
            },
            'be': {'title': 'Інвентар для пікніка і лазня', 'short_desc': 'Мангал, рашоткі, казан, дровы, турыстычная лазня, сталы, лаўкі.', 'long_desc': ''},
            'en': {'title': 'Picnic and sauna equipment', 'short_desc': 'Barbecue, grates, cauldron, firewood, portable sauna, tables, benches, stage, sound.', 'long_desc': ''},
            'pl': {'title': 'Wyposażenie na piknik i sauna', 'short_desc': 'Grill, ruszt, kociołek, drewno, sauna turystyczna, stoły, ławki, scena, nagłośnienie.', 'long_desc': ''},
            'zh': {'title': '野餐与桑拿设备', 'short_desc': '烧烤架、大锅、柴火、便携桑拿、桌椅、舞台、音响。', 'long_desc': ''},
        },
    },
    {
        'slug': 'ploschadki-i-aktivnost',
        'order': 4,
        'image_url': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
        'translations': {
            'ru': {
                'title': 'Площадки и активность',
                'short_desc': 'Футбольная и волейбольная площадки, мячи, ТИР, настольные игры, детский батут.',
                'long_desc': 'Спорт:\n• Футбольная площадка\n• Волейбольная площадка\n• Мячи (футбол, волейбол)\n\nДосуг:\n• ТИР\n• Настольные игры\n• Детский батут',
            },
            'be': {'title': 'Пляцоўкі і актыўнасць', 'short_desc': 'Футбольная і валейбольная пляцоўкі, мячы, ТІР, настольныя гульні, дзіцячы батут.', 'long_desc': ''},
            'en': {'title': 'Playgrounds and activities', 'short_desc': 'Football and volleyball courts, balls, shooting range, board games, children\'s trampoline.', 'long_desc': ''},
            'pl': {'title': 'Boiska i aktywności', 'short_desc': 'Boisko do piłki nożnej i siatkówki, piłki, strzelnica, gry planszowe, trampolina dla dzieci.', 'long_desc': ''},
            'zh': {'title': '场地与活动', 'short_desc': '足球与排球场地、球类、射击、桌游、儿童蹦床。', 'long_desc': ''},
        },
    },
    {
        'slug': 'arenda-vodnogo-inventarya',
        'order': 5,
        'image_url': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        'translations': {
            'ru': {
                'title': 'Аренда водного инвентаря',
                'short_desc': 'Байдарки 2-х и 3-х местные, сапборды, жилет, весло, сидушки, гермомешок, прицеп. Доставка в д. Кады...',
                'long_desc': 'Водный инвентарь:\n• Байдарки 2- и 3-местные\n• Сапборды\n• Жилет, весло, сидушки\n• Гермомешок\n\nЛогистика:\n• Прицеп для перевозки\n• Доставка в д. Кады и другие точки сплава',
            },
            'be': {'title': 'Аренда ваднага інвентара', 'short_desc': 'Байдаркі 2- і 3-месныя, сапборды, жылет, вясло, сядзёлкі, гермамешок, прычэп.', 'long_desc': ''},
            'en': {'title': 'Water equipment rental', 'short_desc': '2- and 3-person kayaks, paddleboards, life jacket, paddle, seats, dry bag, trailer. Delivery to Kady village...', 'long_desc': ''},
            'pl': {'title': 'Wynajem sprzętu wodnego', 'short_desc': 'Kajaki 2- i 3-osobowe, deski SUP, kamizelka, wiosło, siedziska, worek suchy, przyczepa.', 'long_desc': ''},
            'zh': {'title': '水上装备租赁', 'short_desc': '2人/3人皮划艇、桨板、救生衣、桨、座垫、防水袋、拖车。可送至卡德村等。', 'long_desc': ''},
        },
    },
    {
        'slug': 'arenda-velosipedov-i-inventarya',
        'order': 6,
        'image_url': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800',
        'translations': {
            'ru': {
                'title': 'Аренда велосипедов и инвентаря',
                'short_desc': 'Велосипед, электровелосипед, тандем, самокат, ролики, каски, прицепы, велокресло.',
                'long_desc': 'Велосипеды:\n• Горный велосипед\n• Электровелосипед\n• Тандем\n\nДополнительно:\n• Самокат, ролики\n• Каски, прицепы, велокресло для ребёнка',
            },
            'be': {'title': 'Аренда ровараў і інвентара', 'short_desc': 'Ровар, электраровар, тандэм, самокат, ролікі, шлемы, прычэпы, роварнае крэсла.', 'long_desc': ''},
            'en': {'title': 'Bicycle and equipment rental', 'short_desc': 'Bicycle, e-bike, tandem, scooter, roller skates, helmets, trailers, child seat.', 'long_desc': ''},
            'pl': {'title': 'Wynajem rowerów i sprzętu', 'short_desc': 'Rower, rower elektryczny, tandem, hulajnoga, wrotki, kaski, przyczepki, fotelik.', 'long_desc': ''},
            'zh': {'title': '自行车与装备租赁', 'short_desc': '自行车、电动自行车、双人车、滑板车、轮滑、头盔、拖车、儿童座。', 'long_desc': ''},
        },
    },
]


class Command(BaseCommand):
    help = 'Создаёт 6 примерных услуг с картинками (как на макете). Услуги также добавляются в админке: /admin/content/service/'

    def handle(self, *args, **options):
        for data in SAMPLE_SERVICES:
            slug = data['slug']
            service, created = Service.objects.update_or_create(
                slug=slug,
                defaults={
                    'order': data['order'],
                    'image_url': data['image_url'],
                },
            )
            action = 'Создана' if created else 'Обновлена'
            self.stdout.write(f'{action} услуга: {slug}')

            for loc in LOCALES:
                tr = data['translations'][loc]
                ServiceTranslation.objects.update_or_create(
                    service=service,
                    locale=loc,
                    defaults={
                        'title': tr['title'],
                        'short_desc': tr['short_desc'],
                        'long_desc': tr.get('long_desc', ''),
                    },
                )
            self.stdout.write(f'  Переводы: {", ".join(LOCALES)}')

        self.stdout.write(self.style.SUCCESS('Готово. 6 услуг добавлены. Новые услуги можно добавлять в админке: /admin/content/service/'))
