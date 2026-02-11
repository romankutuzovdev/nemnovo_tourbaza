from rest_framework import serializers
from .models import (
    Service, ServiceTranslation,
    News, NewsTranslation,
    Promo, PromoTranslation,
    PortfolioItem, PortfolioItemImage, PortfolioItemTranslation,
    Partner,
    HowToGetRoute, HowToGetRouteTranslation,
    CompanyInfo,
)


class ServiceTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceTranslation
        fields = ['locale', 'title', 'short_desc', 'long_desc']


class ServiceListSerializer(serializers.ModelSerializer):
    """Список услуг: один объект с полями перевода для запрошенной локали."""
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()

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


class ServiceDetailSerializer(serializers.ModelSerializer):
    """Одна услуга с полным переводом для локали."""
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    long_desc = serializers.SerializerMethodField()

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


class NewsTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsTranslation
        fields = ['locale', 'title', 'excerpt', 'content']


class NewsListSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = ['slug', 'image', 'image_url', 'published_at', 'order', 'title', 'excerpt']

    def _get_locale(self):
        return self.context.get('locale', 'ru')

    def _get_translation(self, obj):
        t = obj.translations.filter(locale=self._get_locale()).first()
        return t or obj.translations.filter(locale='ru').first()

    def get_title(self, obj):
        t = self._get_translation(obj)
        return t.title if t else obj.slug

    def get_excerpt(self, obj):
        t = self._get_translation(obj)
        return t.excerpt if t else ''


class NewsDetailSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = ['slug', 'image', 'image_url', 'published_at', 'order', 'title', 'excerpt', 'content']

    def _get_locale(self):
        return self.context.get('locale', 'ru')

    def _get_translation(self, obj):
        t = obj.translations.filter(locale=self._get_locale()).first()
        return t or obj.translations.filter(locale='ru').first()

    def get_title(self, obj):
        t = self._get_translation(obj)
        return t.title if t else obj.slug

    def get_excerpt(self, obj):
        t = self._get_translation(obj)
        return t.excerpt if t else ''

    def get_content(self, obj):
        t = self._get_translation(obj)
        return t.content if t else ''


def _locale_translation(queryset, locale):
    t = queryset.filter(locale=locale).first()
    return t or queryset.filter(locale='ru').first()


class PromoListSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()

    class Meta:
        model = Promo
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.short_desc if t else ''


class PromoDetailSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    long_desc = serializers.SerializerMethodField()

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


class PortfolioItemListSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioItem
        fields = ['slug', 'image', 'image_url', 'image_urls', 'event_date', 'order', 'is_pinned', 'title', 'description']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_description(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.description if t else ''


def _portfolio_image_urls(item, request):
    """Список URL всех фото мероприятия: главное + image_urls + PortfolioItemImage."""
    urls = []
    if request:
        if item.image:
            urls.append(request.build_absolute_uri(item.image.url))
        if item.image_url:
            urls.append(item.image_url)
    urls.extend(item.image_urls or [])
    for img in item.images.all():
        if img.image and request:
            urls.append(request.build_absolute_uri(img.image.url))
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


class PartnerSerializer(serializers.ModelSerializer):
    logo_display = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = ['id', 'name', 'logo_display', 'link', 'order']

    def get_logo_display(self, obj):
        request = self.context.get('request')
        if obj.logo and request:
            return request.build_absolute_uri(obj.logo.url)
        return None


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
            'unp', 'okpo', 'trade_register', 'services_register', 'contact_email',
        ]
