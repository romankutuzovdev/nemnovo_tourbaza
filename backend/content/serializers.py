from django.conf import settings as django_settings
from rest_framework import serializers
from .models import (
    Service, ServiceTranslation,
    Event, EventTranslation,
    News, NewsTranslation,
    Promo, PromoTranslation,
    HotOffer, HotOfferTranslation,
    PortfolioItem, PortfolioItemImage, PortfolioItemTranslation,
    Review,
    Partner,
    HowToGetRoute, HowToGetRouteTranslation,
    CompanyInfo,
)


def _build_media_url(request, image_field):
    """Полный URL загруженного изображения. Путь всегда /media/ + name (name = news/file.png)."""
    if not image_field:
        return None
    name = (getattr(image_field, 'name', None) or '').strip().lstrip('/')
    if not name and hasattr(image_field, 'url'):
        try:
            raw = (image_field.url or '').strip().lstrip('/')
            if raw and not raw.startswith(('http://', 'https://')):
                prefix = django_settings.MEDIA_URL.strip('/')
                name = raw[len(prefix):].lstrip('/') if raw.startswith(prefix) else raw
        except Exception:
            pass
    if not name:
        return None
    media = django_settings.MEDIA_URL.strip('/')
    path = '/' + media + '/' + name
    if request:
        return request.build_absolute_uri(path)
    return path


class ServiceTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceTranslation
        fields = ['locale', 'title', 'short_desc', 'long_desc']


class ServiceListSerializer(serializers.ModelSerializer):
    """Список услуг: один объект с полями перевода для запрошенной локали."""
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc']

    def _get_locale(self):
        return self.context.get('locale', 'ru')

    def _get_translation(self, obj):
        trans = obj.translations.filter(locale=self._get_locale()).first()
        if not trans:
            trans = obj.translations.filter(locale='ru').first()
        return trans

    def get_title(self, obj):
        t = self._get_translation(obj)
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = self._get_translation(obj)
        return t.short_desc if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


class ServiceDetailSerializer(serializers.ModelSerializer):
    """Одна услуга с полным переводом для локали."""
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    long_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc', 'long_desc']

    def _get_locale(self):
        return self.context.get('locale', 'ru')

    def _get_translation(self, obj):
        t = obj.translations.filter(locale=self._get_locale()).first()
        return t or obj.translations.filter(locale='ru').first()

    def get_title(self, obj):
        t = self._get_translation(obj)
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = self._get_translation(obj)
        return t.short_desc if t else ''

    def get_long_desc(self, obj):
        t = self._get_translation(obj)
        return t.long_desc if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


def _locale_translation(queryset, locale):
    t = queryset.filter(locale=locale).first()
    return t or queryset.filter(locale='ru').first()


class EventListSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.short_desc if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


class EventDetailSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    long_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc', 'long_desc']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.short_desc if t else ''

    def get_long_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.long_desc if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


class NewsListSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S', read_only=True)

    class Meta:
        model = News
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc', 'created_at']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.short_desc if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


class NewsDetailSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    long_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S', read_only=True)

    class Meta:
        model = News
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc', 'long_desc', 'created_at']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.short_desc if t else ''

    def get_long_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.long_desc if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


class PromoListSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Promo
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.short_desc if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


class PromoDetailSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    long_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Promo
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc', 'long_desc']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.short_desc if t else ''

    def get_long_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.long_desc if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


class HotOfferListSerializer(serializers.ModelSerializer):
    """Горячее предложение для попапа: заголовок, описание, кнопка, картинка, ссылка, задержка, дата окончания."""
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    button_text = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    valid_until = serializers.SerializerMethodField()

    class Meta:
        model = HotOffer
        fields = ['slug', 'image', 'order', 'delay_seconds', 'valid_until', 'title', 'short_desc', 'button_text']

    def get_valid_until(self, obj):
        valid_until = obj.get_valid_until()
        if valid_until is None:
            return None
        return valid_until.isoformat()

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.short_desc if t else ''

    def get_button_text(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return (t.button_text or 'Подробнее') if t else 'Подробнее'

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return None


class PortfolioItemListSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioItem
        fields = ['slug', 'image', 'image_url', 'image_urls', 'event_date', 'order', 'is_pinned', 'title', 'description']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_description(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.description if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


def _portfolio_image_urls(item, request):
    """Список URL всех фото: приоритет у загруженного image, затем image_url, image_urls, PortfolioItemImage."""
    urls = []
    if request:
        if item.image:
            u = _build_media_url(request, item.image)
            if u:
                urls.append(u)
        elif item.image_url:
            urls.append(item.image_url)
    if not urls and item.image_url:
        urls.append(item.image_url)
    urls.extend(item.image_urls or [])
    for img in item.images.all():
        if img.image and request:
            u = _build_media_url(request, img.image)
            if u:
                urls.append(u)
        elif img.image_url:
            urls.append(img.image_url)
    return urls


class PortfolioItemDetailSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioItem
        fields = ['slug', 'image', 'image_url', 'event_date', 'order', 'is_pinned', 'title', 'description', 'images']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_description(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.description if t else ''

    def get_images(self, obj):
        return _portfolio_image_urls(obj, self.context.get('request'))


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'author', 'text', 'rating', 'order']


class PartnerSerializer(serializers.ModelSerializer):
    logo_display = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = ['id', 'name', 'logo_display', 'link', 'order']

    def get_logo_display(self, obj):
        return _build_media_url(self.context.get('request'), obj.logo) if obj.logo else None


def _locale_translation_how(queryset, locale):
    t = queryset.filter(locale=locale).first()
    return t or queryset.filter(locale='ru').first()


def how_to_get_cities_from_routes(routes_queryset, locale):
    """Группирует маршруты по city_slug в структуру cities с blocks для API."""
    from collections import OrderedDict
    cities = OrderedDict()
    for route in routes_queryset:
        t = _locale_translation_how(route.translations, locale)
        slug = route.city_slug
        if slug not in cities:
            cities[slug] = {
                'slug': slug,
                'name': t.city_name if t else slug,
                'order': route.order,
                'blocks': [],
            }
        cities[slug]['name'] = t.city_name if t else slug
        cities[slug]['blocks'].append({
            'transport_type': route.transport_type,
            'title': t.title if t else route.get_transport_type_display(),
            'content': t.content if t else '',
        })
    return sorted(cities.values(), key=lambda c: (c['order'], c['slug']))


class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = [
            'company_name', 'legal_address', 'office_address',
            'unp', 'okpo', 'state_registration', 'trade_register', 'services_register', 'contact_email',
        ]
