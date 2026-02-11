"""
Заполняет «Как добраться»: одна модель — один маршрут (город + способ), переводы в одной таблице.
Редактирование: /admin/content/howtogetroute/
Запуск: python manage.py load_sample_how_to_get
"""
from django.core.management.base import BaseCommand
from content.models import HowToGetRoute, HowToGetRouteTranslation

LOCALES = ['ru', 'be', 'en', 'pl', 'zh']

CITIES = [
    ('minsk', 'ИЗ МИНСКА', 1),
    ('moscow', 'ИЗ МОСКВЫ', 2),
    ('spb', 'ИЗ САНКТ-ПЕТЕРБУРГА', 3),
    ('europe', 'ИЗ ЕВРОПЫ', 4),
]

CITY_NAMES = {
    'ru': {'minsk': 'ИЗ МИНСКА', 'moscow': 'ИЗ МОСКВЫ', 'spb': 'ИЗ САНКТ-ПЕТЕРБУРГА', 'europe': 'ИЗ ЕВРОПЫ'},
    'be': {'minsk': 'З МІНСКА', 'moscow': 'З МАСКВЫ', 'spb': 'З САНКТ-ПЕЦЕРБУРГА', 'europe': 'З ЕУРОПЫ'},
    'en': {'minsk': 'FROM MINSK', 'moscow': 'FROM MOSCOW', 'spb': 'FROM ST. PETERSBURG', 'europe': 'FROM EUROPE'},
    'pl': {'minsk': 'Z MIŃSKA', 'moscow': 'Z MOSKWY', 'spb': 'Z PETERSBURGA', 'europe': 'Z EUROPY'},
    'zh': {'minsk': '从明斯克', 'moscow': '从莫斯科', 'spb': '从圣彼得堡', 'europe': '从欧洲'},
}

# Заголовки способов по языкам (plane, bus, train, car)
TRANSPORT_TITLES = {
    'ru': {'plane': 'НА САМОЛЕТЕ', 'bus': 'НА АВТОБУСЕ', 'train': 'НА ПОЕЗДЕ', 'car': 'НА СОБСТВЕННОМ ТРАНСПОРТЕ'},
    'en': {'plane': 'BY PLANE', 'bus': 'BY BUS', 'train': 'BY TRAIN', 'car': 'BY CAR'},
    'be': {'plane': 'НА САМАЛЁТЕ', 'bus': 'НА АВТАБУСЕ', 'train': 'НА ЦЯГНІКУ', 'car': 'НА УЛАСНЫМ ТРАНСПАРТЕ'},
    'pl': {'plane': 'SAMOLOTEM', 'bus': 'AUTOBUSEM', 'train': 'POCIĄGIEM', 'car': 'WŁASNYM TRANSPORTEM'},
    'zh': {'plane': '乘飞机', 'bus': '乘大巴', 'train': '乘火车', 'car': '自驾'},
}

# Для каждого города — свой текст по каждому виду транспорта (русский).
CONTENT_BY_CITY = {
    'minsk': {
        'plane': ('НА САМОЛЕТЕ', 'Поможем организовать трансфер из Национального аэропорта «Минск» до деревни Немново. Время в пути около 1,5 часов.'),
        'bus': ('НА АВТОБУСЕ', 'Поможем арендовать автобус для компании. Из Гродно можно добраться рейсовым транспортом до Сопоцкино, далее до д. Немново.'),
        'train': ('НА ПОЕЗДЕ', 'На поезде можно добраться до Гродно, далее — трансфер или аренда авто до д. Немново.'),
        'car': ('НА СОБСТВЕННОМ ТРАНСПОРТЕ', 'Введите в навигатор адрес: деревня Немново, 15 (Гродненский район) или GPS: 53.863078, 23.762146. От Минска около 270 км, время в пути 3–3,5 часа.'),
    },
    'moscow': {
        'plane': ('НА САМОЛЕТЕ', 'Рейсы Москва — Минск регулярные. После прилёта в Национальный аэропорт «Минск» организуем трансфер до деревни Немново (около 1,5 ч).'),
        'bus': ('НА АВТОБУСЕ', 'Междугородние автобусы Москва — Гродно. Из Гродно — рейсовый транспорт до Сопоцкино или заказ трансфера до д. Немново.'),
        'train': ('НА ПОЕЗДЕ', 'Поезда Москва — Гродно. Далее трансфер или аренда авто до д. Немново (около 30 км от Гродно).'),
        'car': ('НА СОБСТВЕННОМ ТРАНСПОРТЕ', 'По трассе М1 до Минска, далее в сторону Гродно. Адрес: деревня Немново, 15. GPS: 53.863078, 23.762146. От Москвы около 750 км.'),
    },
    'spb': {
        'plane': ('НА САМОЛЕТЕ', 'Перелёт Санкт-Петербург — Минск. В аэропорту Минска — трансфер до Немново (1,5 ч).'),
        'bus': ('НА АВТОБУСЕ', 'Автобусы СПб — Гродно/Минск. Из Гродно — до Сопоцкино и д. Немново рейсом или трансфером.'),
        'train': ('НА ПОЕЗДЕ', 'Поезд до Гродно или Минска, затем трансфер или аренда авто до деревни Немново.'),
        'car': ('НА СОБСТВЕННОМ ТРАНСПОРТЕ', 'Через Псков и Вильнюс или через Минск. Адрес: д. Немново, 15. GPS: 53.863078, 23.762146. От СПб около 850 км.'),
    },
    'europe': {
        'plane': ('НА САМОЛЕТЕ', 'Рейсы в Минск из многих городов Европы. Из аэропорта Минска — трансфер до Немново (1,5 ч).'),
        'bus': ('НА АВТОБУСЕ', 'Международные автобусы до Гродно или Минска. Далее трансфер до д. Немново.'),
        'train': ('НА ПОЕЗДЕ', 'Ж/д до Гродно или Минска (в т.ч. из Польши, Литвы). Из Гродно — трансфер до Немново.'),
        'car': ('НА СОБСТВЕННОМ ТРАНСПОРТЕ', 'Через Польшу/Литву в Гродно, далее по указателям. Адрес: д. Немново, 15. GPS: 53.863078, 23.762146.'),
    },
}

# Тексты блоков по языкам: locale -> { city_slug -> { transport_type -> content } }
CONTENT_BY_LOCALE = {
    'ru': CONTENT_BY_CITY,
    'en': {
        'minsk': {
            'plane': ('BY PLANE', 'We can arrange transfer from Minsk National Airport to Nemnovo village. About 1.5 hours.'),
            'bus': ('BY BUS', 'We can help rent a bus. From Grodno you can reach Sopotskino by public transport, then to Nemnovo.'),
            'train': ('BY TRAIN', 'By train to Grodno, then transfer or car rental to Nemnovo.'),
            'car': ('BY CAR', 'Enter in your navigator: Nemnovo village, 15 (Grodno district) or GPS: 53.863078, 23.762146. From Minsk about 270 km.'),
        },
        'moscow': {
            'plane': ('BY PLANE', 'Regular flights Moscow — Minsk. From Minsk airport we arrange transfer to Nemnovo (about 1.5 h).'),
            'bus': ('BY BUS', 'Intercity buses Moscow — Grodno. From Grodno — public transport or transfer to Nemnovo.'),
            'train': ('BY TRAIN', 'Trains Moscow — Grodno. Then transfer or car rental to Nemnovo (about 30 km).'),
            'car': ('BY CAR', 'Via M1 to Minsk, then towards Grodno. Address: Nemnovo village, 15. GPS: 53.863078, 23.762146. From Moscow about 750 km.'),
        },
        'spb': {
            'plane': ('BY PLANE', 'Flight St. Petersburg — Minsk. Transfer from Minsk airport to Nemnovo (1.5 h).'),
            'bus': ('BY BUS', 'Buses SPb — Grodno/Minsk. From Grodno — to Nemnovo by bus or transfer.'),
            'train': ('BY TRAIN', 'Train to Grodno or Minsk, then transfer or car rental to Nemnovo.'),
            'car': ('BY CAR', 'Via Pskov and Vilnius or via Minsk. Address: Nemnovo village, 15. From SPb about 850 km.'),
        },
        'europe': {
            'plane': ('BY PLANE', 'Flights to Minsk from many European cities. Transfer from Minsk airport to Nemnovo (1.5 h).'),
            'bus': ('BY BUS', 'International buses to Grodno or Minsk. Then transfer to Nemnovo.'),
            'train': ('BY TRAIN', 'Rail to Grodno or Minsk (e.g. from Poland, Lithuania). From Grodno — transfer to Nemnovo.'),
            'car': ('BY CAR', 'Via Poland/Lithuania to Grodno, then follow signs. Address: Nemnovo village, 15. GPS: 53.863078, 23.762146.'),
        },
    },
    'zh': {
        'minsk': {
            'plane': ('乘飞机', '可安排从明斯克国家机场到涅姆诺沃村的接送。车程约1.5小时。'),
            'bus': ('乘大巴', '可协助租赁大巴。从格罗德诺可乘班车到索波茨基诺，再至涅姆诺沃村。'),
            'train': ('乘火车', '火车至格罗德诺，再乘接送或租车至涅姆诺沃村。'),
            'car': ('自驾', '导航输入：涅姆诺沃村15号（格罗德诺区）或 GPS：53.863078, 23.762146。距明斯克约270公里。'),
        },
        'moscow': {
            'plane': ('乘飞机', '莫斯科—明斯克航班频繁。抵达明斯克机场后可安排接送至涅姆诺沃（约1.5小时）。'),
            'bus': ('乘大巴', '莫斯科—格罗德诺长途大巴。从格罗德诺可乘班车或接送至涅姆诺沃。'),
            'train': ('乘火车', '莫斯科—格罗德诺火车。再乘接送或租车至涅姆诺沃（距格罗德诺约30公里）。'),
            'car': ('自驾', '经M1至明斯克，再往格罗德诺方向。地址：涅姆诺沃村15号。GPS：53.863078, 23.762146。距莫斯科约750公里。'),
        },
        'spb': {
            'plane': ('乘飞机', '圣彼得堡—明斯克航班。明斯克机场接送至涅姆诺沃（1.5小时）。'),
            'bus': ('乘大巴', '圣彼得堡—格罗德诺/明斯克大巴。从格罗德诺乘班车或接送至涅姆诺沃。'),
            'train': ('乘火车', '火车至格罗德诺或明斯克，再乘接送或租车至涅姆诺沃。'),
            'car': ('自驾', '经普斯科夫、维尔纽斯或经明斯克。地址：涅姆诺沃村15号。距圣彼得堡约850公里。'),
        },
        'europe': {
            'plane': ('乘飞机', '欧洲多城有航班至明斯克。明斯克机场接送至涅姆诺沃（1.5小时）。'),
            'bus': ('乘大巴', '国际大巴至格罗德诺或明斯克，再乘接送至涅姆诺沃。'),
            'train': ('乘火车', '铁路至格罗德诺或明斯克（含从波兰、立陶宛）。从格罗德诺接送至涅姆诺沃。'),
            'car': ('自驾', '经波兰/立陶宛至格罗德诺，按路标行驶。地址：涅姆诺沃村15号。GPS：53.863078, 23.762146。'),
        },
    },
    'be': CONTENT_BY_CITY,
    'pl': CONTENT_BY_CITY,
}


class Command(BaseCommand):
    help = 'Заполняет маршруты «Как добраться» (одна запись = город + способ). Админка: /admin/content/howtogetroute/'

    def handle(self, *args, **options):
        order = 0
        for slug, name_ru, _city_order in CITIES:
            city_content = CONTENT_BY_CITY.get(slug, CONTENT_BY_CITY['minsk'])
            for i, (transport_type, (title_ru, content_ru)) in enumerate(city_content.items()):
                order += 1
                route, created = HowToGetRoute.objects.update_or_create(
                    city_slug=slug,
                    transport_type=transport_type,
                    defaults={'order': order},
                )
                action = 'Создан' if created else 'Обновлён'
                self.stdout.write(f'{action} маршрут: {slug} — {transport_type}')

                for loc in LOCALES:
                    city_name = CITY_NAMES.get(loc, {}).get(slug, name_ru)
                    loc_content = CONTENT_BY_LOCALE.get(loc, CONTENT_BY_CITY)
                    city_loc = loc_content.get(slug, loc_content.get('minsk', city_content))
                    title_loc, content_loc = city_loc.get(transport_type, (TRANSPORT_TITLES.get(loc, {}).get(transport_type) or title_ru, content_ru))
                    HowToGetRouteTranslation.objects.update_or_create(
                        route=route,
                        locale=loc,
                        defaults={
                            'city_name': city_name,
                            'title': title_loc,
                            'content': content_loc,
                        },
                    )

        self.stdout.write(self.style.SUCCESS('Готово. Админка: /admin/content/howtogetroute/'))
