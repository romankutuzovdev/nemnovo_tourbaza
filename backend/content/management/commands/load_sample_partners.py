"""
Добавляет 5–10 примерных партнёров (без логотипов). Логотипы загружаются в админке как картинки.
Запуск: python manage.py load_sample_partners
"""
from django.core.management.base import BaseCommand
from content.models import Partner

SAMPLE_PARTNERS = [
    {'name': 'Белорусская федерация туризма', 'link': '', 'order': 1},
    {'name': 'Гроднотурист', 'link': '', 'order': 2},
    {'name': 'Агроусадьбы Беларуси', 'link': '', 'order': 3},
    {'name': 'Неман-тур', 'link': '', 'order': 4},
    {'name': 'Беларуськалий', 'link': '', 'order': 5},
    {'name': 'Гродненский облисполком', 'link': '', 'order': 6},
    {'name': 'Районный центр туризма', 'link': '', 'order': 7},
    {'name': 'Сплав по Неману', 'link': '', 'order': 8},
]

class Command(BaseCommand):
    help = 'Создаёт примерных партнёров. Логотипы загружайте в админке: /admin/content/partner/'

    def handle(self, *args, **options):
        for data in SAMPLE_PARTNERS:
            partner, created = Partner.objects.update_or_create(
                name=data['name'],
                defaults={
                    'link': data.get('link', ''),
                    'order': data['order'],
                },
            )
            action = 'Создан' if created else 'Обновлён'
            self.stdout.write(f'{action} партнёр: {partner.name}')
        self.stdout.write(self.style.SUCCESS(f'Готово. Партнёров: {len(SAMPLE_PARTNERS)}. Логотипы загружайте в админке.'))
