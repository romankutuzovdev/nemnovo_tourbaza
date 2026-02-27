from django.db import migrations

STATIC_AREAS = [
    {'area_id': 'berloga',        'number': '9',    'name': 'Берлога',         'left': 42.1, 'top': 7.1,  'order': 9},
    {'area_id': 'paparats-kvetka','number': '10',   'name': 'Папараць-кветка', 'left': 35.9, 'top': 16.1, 'order': 10},
    {'area_id': 'kolobok',        'number': '8',    'name': 'Колобок',         'left': 44.0, 'top': 24.1, 'order': 8},
    {'area_id': 'ladya',          'number': '7',    'name': 'Ладья',           'left': 43.3, 'top': 32.4, 'order': 7},
    {'area_id': 'cherny-voron',   'number': '11',   'name': 'Черный ворон',    'left': 32.9, 'top': 34.6, 'order': 11},
    {'area_id': 'stolik-bobra',   'number': '12',   'name': 'Столик бобра',    'left': 34.9, 'top': 44.7, 'order': 12},
    {'area_id': 'berezki',        'number': '6',    'name': 'Березки',         'left': 42.4, 'top': 47.8, 'order': 6},
    {'area_id': 'ochag-bylin',    'number': '14',   'name': 'Очаг былин',      'left': 28.3, 'top': 47.3, 'order': 14},
    {'area_id': 'ogon-peruna',    'number': '12+1', 'name': 'Огонь Перуна',    'left': 22.0, 'top': 57.8, 'order': 13},
    {'area_id': 'tihaya-zatoka',  'number': '15',   'name': 'Тихая затока',    'left': 28.5, 'top': 73.7, 'order': 15},
    {'area_id': 'zeleny-dyatel',  'number': '16',   'name': 'Зеленый дятел',   'left': 16.7, 'top': 80.3, 'order': 16},
    {'area_id': 'buhta-gerodota', 'number': '18',   'name': 'Бухта Геродота',  'left': 38.5, 'top': 60.9, 'order': 18},
    {'area_id': 'tent-23',        'number': '23',   'name': 'Палатка 23',      'left': 42.2, 'top': 54.4, 'order': 23},
    {'area_id': 'tent-22',        'number': '22',   'name': 'Палатка 22',      'left': 48.5, 'top': 47.9, 'order': 22},
    {'area_id': 'syabry',         'number': '5',    'name': 'Сябры',           'left': 53.5, 'top': 57.0, 'order': 5},
    {'area_id': 'polka',          'number': '4',    'name': 'Полька',          'left': 64.3, 'top': 59.4, 'order': 4},
    {'area_id': 'karchma',        'number': '3',    'name': 'Карчма',          'left': 65.3, 'top': 75.8, 'order': 3},
    {'area_id': 'gavan',          'number': '2',    'name': 'Тихая гавань',    'left': 65.6, 'top': 82.5, 'order': 2},
    {'area_id': 'mokry-kot',      'number': '19',   'name': 'Мокрый кот',      'left': 59.3, 'top': 84.7, 'order': 19},
    {'area_id': 'uzhyk',          'number': '1',    'name': 'Ужик',            'left': 89.8, 'top': 64.6, 'order': 1},
    {'area_id': 'melnitsa',       'number': '24',   'name': 'Мельница',        'left': 83.6, 'top': 69.1, 'order': 24},
]


def populate(apps, schema_editor):
    MapArea = apps.get_model('content', 'MapArea')
    for data in STATIC_AREAS:
        MapArea.objects.get_or_create(area_id=data['area_id'], defaults=data)


def depopulate(apps, schema_editor):
    MapArea = apps.get_model('content', 'MapArea')
    ids = [d['area_id'] for d in STATIC_AREAS]
    MapArea.objects.filter(area_id__in=ids).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0032_add_map_area_model'),
    ]

    operations = [
        migrations.RunPython(populate, depopulate),
    ]
