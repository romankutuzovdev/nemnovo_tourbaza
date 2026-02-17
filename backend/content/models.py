from django.db import models

LOCALE_CHOICES = [
    ('ru', 'Русский'),
    ('be', 'Беларуская'),
    ('en', 'English'),
    ('pl', 'Polski'),
    ('zh', '中文'),
]


class Service(models.Model):
    """Услуга: slug и изображение общие, тексты — по локалям в ServiceTranslation."""
    slug = models.SlugField(max_length=120, unique=True)
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text='Если нет загрузки файла')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'

    def __str__(self):
        return self.slug


class ServiceTranslation(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField(max_length=200)
    short_desc = models.TextField(blank=True)
    long_desc = models.TextField(
        help_text='Блоки: строка-заголовок (без буллета), ниже строки с «• » — пункты списка. Новая строка без «• » начинает следующий блок.'
    )

    class Meta:
        unique_together = [('service', 'locale')]
        ordering = ['service', 'locale']

    def __str__(self):
        return f'{self.service.slug} ({self.locale})'


class Event(models.Model):
    """Мероприятие (Марафоны, Турслёт): slug и изображение общие, тексты — по локалям."""
    slug = models.SlugField(max_length=120, unique=True)
    image = models.ImageField(upload_to='events/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text='Если нет загрузки файла')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Мероприятие'
        verbose_name_plural = 'Мероприятия'

    def __str__(self):
        return self.slug


class EventTranslation(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField(max_length=200)
    short_desc = models.TextField(blank=True)
    long_desc = models.TextField(blank=True, help_text='Расширенное описание для страницы мероприятия')

    class Meta:
        unique_together = [('event', 'locale')]
        ordering = ['event', 'locale']

    def __str__(self):
        return f'{self.event.slug} ({self.locale})'


class Promo(models.Model):
    """Акция: изображение и порядок общие, тексты — по локалям."""
    slug = models.SlugField(max_length=120, unique=True)
    image = models.ImageField(upload_to='promos/', blank=True, null=True)
    image_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Акция'
        verbose_name_plural = 'Акции'

    def __str__(self):
        return self.slug


class PromoTranslation(models.Model):
    promo = models.ForeignKey(Promo, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField(max_length=200)
    short_desc = models.TextField(blank=True)
    long_desc = models.TextField(blank=True)

    class Meta:
        unique_together = [('promo', 'locale')]
        ordering = ['promo', 'locale']

    def __str__(self):
        return f'{self.promo.slug} ({self.locale})'


class PortfolioItem(models.Model):
    """Фотоотчёт с мероприятия: можно закреплять (is_pinned), порядок, галерея изображений."""
    slug = models.SlugField(max_length=120, unique=True)
    image = models.ImageField(upload_to='portfolio/', blank=True, null=True)
    image_url = models.URLField(blank=True)
    image_urls = models.JSONField(default=list, blank=True, help_text='Список URL дополнительных фото (устаревшее — используйте «Фото» ниже)')
    event_date = models.DateField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_pinned = models.BooleanField(default=False, help_text='Закрепить блок выше остальных')

    class Meta:
        ordering = ['-is_pinned', 'order', '-event_date', 'id']
        verbose_name = 'Элемент портфолио'
        verbose_name_plural = 'Элементы портфолио'

    def __str__(self):
        return self.slug


class PortfolioItemImage(models.Model):
    """Одно фото в рамках мероприятия (можно загружать много через админку)."""
    portfolio_item = models.ForeignKey(PortfolioItem, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='portfolio/gallery/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text='Если не загружаете файл')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f'{self.portfolio_item.slug} #{self.order}'


class PortfolioItemTranslation(models.Model):
    portfolio_item = models.ForeignKey(PortfolioItem, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = [('portfolio_item', 'locale')]
        ordering = ['portfolio_item', 'locale']

    def __str__(self):
        return f'{self.portfolio_item.slug} ({self.locale})'


class Review(models.Model):
    """Отзыв гостя: автор, текст, оценка 1–5 звёзд (как на Яндекс.Картах), порядок вывода."""
    author = models.CharField('Автор', max_length=200)
    text = models.TextField('Текст отзыва')
    rating = models.PositiveSmallIntegerField(
        'Оценка (звёзды)',
        default=5,
        choices=[(i, f'{i} из 5') for i in range(1, 6)],
    )
    order = models.PositiveIntegerField('Порядок', default=0)
    is_published = models.BooleanField('Опубликован', default=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'

    def __str__(self):
        return f'{self.author} — {self.rating}/5'


class Partner(models.Model):
    """Партнёр: название, логотип (загрузка файла в БД), ссылка на сайт, порядок."""
    name = models.CharField('Название', max_length=200)
    logo = models.ImageField('Логотип', upload_to='partners/', blank=True, null=True)
    link = models.URLField('Ссылка на сайт', blank=True)
    order = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Партнёр'
        verbose_name_plural = 'Партнёры'

    def __str__(self):
        return self.name


TRANSPORT_TYPE_CHOICES = [
    ('plane', 'На самолёте'),
    ('bus', 'На автобусе'),
    ('train', 'На поезде'),
    ('car', 'На собственном транспорте'),
]


class HowToGetRoute(models.Model):
    """
    Один маршрут «как добраться»: город + способ (на самолёте, автобусе и т.д.).
    Одна запись = одна связка «Из Москвы — на самолёте» с описанием. Переводы — в HowToGetRouteTranslation.
    """
    city_slug = models.SlugField('Код города', max_length=80)
    transport_type = models.CharField(
        'Способ',
        max_length=20,
        choices=TRANSPORT_TYPE_CHOICES,
    )
    order = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        ordering = ['city_slug', 'order', 'id']
        unique_together = [('city_slug', 'transport_type')]
        verbose_name = 'Маршрут (как добраться)'
        verbose_name_plural = 'Маршруты (как добраться)'

    def __str__(self):
        return f'{self.city_slug} — {self.get_transport_type_display()}'


class HowToGetRouteTranslation(models.Model):
    route = models.ForeignKey(HowToGetRoute, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    city_name = models.CharField('Название кнопки города', max_length=120)
    title = models.CharField('Заголовок способа', max_length=200)
    content = models.TextField('Описание', blank=True)

    class Meta:
        unique_together = [('route', 'locale')]
        ordering = ['route', 'locale']

    def __str__(self):
        return f'{self.route} ({self.locale})'


class News(models.Model):
    """Новость: slug и изображение общие, тексты — по локалям в NewsTranslation."""
    slug = models.SlugField(max_length=120, unique=True)
    image = models.ImageField(upload_to='news/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text='Если нет загрузки файла')
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at', 'order', 'id']
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'

    def __str__(self):
        return self.slug


class NewsTranslation(models.Model):
    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField(max_length=200)
    short_desc = models.TextField(blank=True)
    long_desc = models.TextField(blank=True, help_text='Полный текст новости')

    class Meta:
        unique_together = [('news', 'locale')]
        ordering = ['news', 'locale']

    def __str__(self):
        return f'{self.news.slug} ({self.locale})'


class HotOffer(models.Model):
    """Горячее предложение для всплывающего окна. Время до конца задаётся в формате ч:мм:сс (например 1:59:00)."""
    slug = models.SlugField(max_length=120, unique=True)
    image = models.ImageField(upload_to='hot_offers/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    delay_seconds = models.PositiveIntegerField(
        default=5,
        help_text='Через сколько секунд после захода на сайт показать попап',
    )
    duration_seconds = models.PositiveIntegerField(
        default=0,
        help_text='Время до конца акции в секундах (например 7140 = 1:59:00). 0 — таймер не показывать.',
    )

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Горячее предложение'
        verbose_name_plural = 'Горячие предложения'

    def __str__(self):
        return self.slug

    def get_valid_until(self):
        """Момент окончания акции для таймера (сейчас + duration_seconds)."""
        if not self.duration_seconds:
            return None
        from django.utils import timezone
        from datetime import timedelta
        return timezone.now() + timedelta(seconds=self.duration_seconds)


class HotOfferTranslation(models.Model):
    hot_offer = models.ForeignKey(HotOffer, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField(max_length=200)
    short_desc = models.TextField(blank=True)
    button_text = models.CharField(max_length=100, blank=True, default='Подробнее')

    class Meta:
        unique_together = [('hot_offer', 'locale')]
        ordering = ['hot_offer', 'locale']

    def __str__(self):
        return f'{self.hot_offer.slug} ({self.locale})'


class CompanyInfo(models.Model):
    """Одна запись — контактные/юридические данные для футера и страниц (редактируются в админке)."""
    company_name = models.CharField('Название', max_length=200, default='ООО «Немново Тур»')
    legal_address = models.TextField('Юридический адрес', blank=True)
    office_address = models.TextField('Адрес офиса', blank=True)
    unp = models.CharField('УНП', max_length=20, blank=True)
    okpo = models.CharField('ОКПО', max_length=30, blank=True)
    state_registration = models.CharField('Свидетельство о госрегистрации', max_length=300, blank=True)
    trade_register = models.CharField('Регистрация в торговом реестре', max_length=200, blank=True)
    services_register = models.CharField('Регистрация в реестре бытовых услуг', max_length=200, blank=True)
    contact_email = models.EmailField('Email для контакта', blank=True, default='office@nemnovotour.by')
    destination_address = models.TextField('Адрес назначения (как добраться)', blank=True)
    destination_gps_lat = models.FloatField('GPS широта', null=True, blank=True)
    destination_gps_lon = models.FloatField('GPS долгота', null=True, blank=True)

    class Meta:
        verbose_name = 'Реквизиты компании'
        verbose_name_plural = 'Реквизиты компании'

    def __str__(self):
        return self.company_name or 'Реквизиты'


