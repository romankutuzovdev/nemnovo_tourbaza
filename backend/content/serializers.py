from django.conf import settings as django_settings
from rest_framework import serializers
from .models import (
    Service, ServiceImage, ServiceVariant, ServiceTranslation,
    Event, EventTranslation,
    News, NewsTranslation,
    Promo, PromoTranslation,
    HotOffer, HotOfferTranslation,
    PortfolioItem, PortfolioItemImage, PortfolioItemTranslation,
    Review,
    Partner,
    HowToGetRoute, HowToGetRouteTranslation,
    CompanyInfo,
    MapArea,
    HeroContent,
    ReviewsStatsContent,
    LegalPage,
    CertificateContent,
    AgenciesPage,
    AboutContent,
)


def _build_media_url(request, image_field):
    """URL картинки в /media/... Относительный путь — чтобы в браузере грузилось с того же хоста, что и сайт
    (иначе при запросах API с Next SSR подставлялся http://127.0.0.1/...).
    Опционально PUBLIC_MEDIA_BASE_URL в settings — полный префикс (CDN / канонический домен)."""
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
    base = getattr(django_settings, 'PUBLIC_MEDIA_BASE_URL', '') or ''
    if isinstance(base, str):
        base = base.strip().rstrip('/')
    if base:
        return f'{base}{path}'
    return path


def _service_image_urls(obj, request):
    """Все фото услуги: сначала основное, затем gallery (ServiceImage), без дублей."""
    urls = []
    # основное изображение
    if obj.image:
        u = _build_media_url(request, obj.image)
        if u:
            urls.append(u)
    elif getattr(obj, 'image_url', None):
        urls.append(obj.image_url)
    # дополнительные фото
    for si in obj.images.all():
        if si.image:
            u = _build_media_url(request, si.image)
            if u:
                urls.append(u)
        elif si.image_url:
            urls.append(si.image_url)
    return urls


class ServiceTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceTranslation
        fields = ['locale', 'title', 'short_desc', 'long_desc']


class ServiceListSerializer(serializers.ModelSerializer):
    """Список услуг: один объект с полями перевода для запрошенной локали."""
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['slug', 'image', 'image_url', 'order', 'category', 'title', 'short_desc', 'images']

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

    def get_images(self, obj):
        return _service_image_urls(obj, self.context.get('request'))


class ServiceTreeSerializer(ServiceListSerializer):
    """Иерархический список услуг с вложенными children."""
    children = serializers.SerializerMethodField()

    class Meta(ServiceListSerializer.Meta):
        fields = ['slug', 'image', 'image_url', 'order', 'category', 'title', 'short_desc', 'images', 'children']

    def get_children(self, obj):
        children = obj.children.filter(is_active=True).order_by('order', 'id')
        return ServiceTreeSerializer(children, many=True, context=self.context).data


class ServiceDetailSerializer(serializers.ModelSerializer):
    """Одна услуга с полным переводом для локали. При наличии потомков — children. documents — для скачивания."""
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    long_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    variants = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()
    documents = serializers.SerializerMethodField()
    needs_questionnaire = serializers.BooleanField(read_only=True)
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['slug', 'image', 'image_url', 'order', 'category', 'title', 'short_desc', 'long_desc', 'images', 'variants', 'children', 'documents', 'needs_questionnaire', 'questions']

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

    def get_images(self, obj):
        return _service_image_urls(obj, self.context.get('request'))

    def get_variants(self, obj):
        return [{'name': v.name, 'description': v.description} for v in obj.variants.all()]

    def get_children(self, obj):
        children = obj.children.filter(is_active=True).order_by('order', 'id')
        return ServiceListSerializer(children, many=True, context=self.context).data

    def get_documents(self, obj):
        docs = getattr(obj, 'documents', None)
        if docs is None:
            return []
        docs = list(docs.all().order_by('order', 'id'))
        request = self.context.get('request')
        result = []
        for d in docs:
            if not d.file or not getattr(d.file, 'name', None):
                continue
            url = _build_media_url(request, d.file)
            if url:
                result.append({'name': d.name or d.file.name, 'url': url})
        return result

    def get_questions(self, obj):
        try:
            qs = getattr(obj, 'questions', None)
            if qs is None:
                return []
            questions = list(qs.all().order_by('order', 'id'))
            return [{'id': q.id, 'text': q.text} for q in questions]
        except Exception:
            return []


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
    related_news = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc', 'long_desc', 'created_at', 'related_news']

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

    def get_related_news(self, obj):
        if not obj.related_link_url:
            return None
        return {
            'url': obj.related_link_url,
            'title': obj.related_link_title or obj.related_link_url,
        }


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
            'bank_account', 'bank_name', 'bank_bic',
        ]


class LegalPageSerializer(serializers.ModelSerializer):
    """Юридическая страница: заголовок и содержание для заданной локали."""
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    class Meta:
        model = LegalPage
        fields = ['page_key', 'title', 'content']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else ''

    def get_content(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.content if t else ''


class CertificateContentSerializer(serializers.ModelSerializer):
    """Подарочный сертификат: картинка и переводы title/content."""
    image = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    class Meta:
        model = CertificateContent
        fields = ['image', 'image_url', 'title', 'content']

    def _get_translation(self, obj):
        locale = self.context.get('locale', 'ru')
        t = obj.translations.filter(locale=locale).first()
        return t or obj.translations.filter(locale='ru').first()

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return obj.image_url or None

    def get_title(self, obj):
        t = self._get_translation(obj)
        return t.title if t else ''

    def get_content(self, obj):
        t = self._get_translation(obj)
        return t.content if t else ''


class HeroContentSerializer(serializers.ModelSerializer):
    """Контент главного блока: картинка и переводы badge/title1/title2/subtitle."""
    image = serializers.SerializerMethodField()
    badge = serializers.SerializerMethodField()
    title1 = serializers.SerializerMethodField()
    title2 = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()

    class Meta:
        model = HeroContent
        fields = ['image', 'image_url', 'badge', 'title1', 'title2', 'subtitle']

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return obj.image_url or None

    def get_badge(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.badge if t else ''

    def get_title1(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title1 if t else ''

    def get_title2(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title2 if t else ''

    def get_subtitle(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.subtitle if t else ''


class ReviewsStatsContentSerializer(serializers.ModelSerializer):
    """Блок статистики отзывов: 3 значения и подписи для заданной локали."""
    distance_value = serializers.SerializerMethodField()
    distance_label = serializers.SerializerMethodField()
    stat1_value = serializers.SerializerMethodField()
    stat1_label = serializers.SerializerMethodField()
    stat2_value = serializers.SerializerMethodField()
    stat2_label = serializers.SerializerMethodField()

    class Meta:
        model = ReviewsStatsContent
        fields = ['distance_value', 'distance_label', 'stat1_value', 'stat1_label', 'stat2_value', 'stat2_label']

    def _t(self, obj):
        return _locale_translation(obj.translations, self.context.get('locale', 'ru'))

    def get_distance_value(self, obj):
        t = self._t(obj)
        return t.distance_value if t else ''

    def get_distance_label(self, obj):
        t = self._t(obj)
        return t.distance_label if t else ''

    def get_stat1_value(self, obj):
        t = self._t(obj)
        return t.stat1_value if t else ''

    def get_stat1_label(self, obj):
        t = self._t(obj)
        return t.stat1_label if t else ''

    def get_stat2_value(self, obj):
        t = self._t(obj)
        return t.stat2_value if t else ''

    def get_stat2_label(self, obj):
        t = self._t(obj)
        return t.stat2_label if t else ''


class MapAreaSerializer(serializers.ModelSerializer):
    """Область на интерактивной карте: позиция, метка и slug связанной услуги."""
    service_slug = serializers.SerializerMethodField()
    service_title = serializers.SerializerMethodField()
    service_image = serializers.SerializerMethodField()
    service_images = serializers.SerializerMethodField()
    service_short_desc = serializers.SerializerMethodField()

    class Meta:
        model = MapArea
        fields = ['area_id', 'number', 'name', 'left', 'top', 'order',
                  'service_slug', 'service_title', 'service_image', 'service_images', 'service_short_desc']

    def get_service_slug(self, obj):
        return obj.service.slug if obj.service_id else None

    def get_service_title(self, obj):
        if not obj.service_id:
            return None
        t = _locale_translation(obj.service.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.service.slug

    def get_service_image(self, obj):
        if not obj.service_id:
            return None
        svc = obj.service
        if svc.image:
            return _build_media_url(self.context.get('request'), svc.image)
        return svc.image_url or None

    def get_service_images(self, obj):
        if not obj.service_id:
            return []
        return _service_image_urls(obj.service, self.context.get('request'))

    def get_service_short_desc(self, obj):
        if not obj.service_id:
            return None
        t = _locale_translation(obj.service.translations, self.context.get('locale', 'ru'))
        return t.short_desc if t else ''


class AgenciesPageSerializer(serializers.ModelSerializer):
    """Страница «Агентствам»: все текстовые поля для заданной локали."""
    title = serializers.SerializerMethodField()
    intro = serializers.SerializerMethodField()
    why_title = serializers.SerializerMethodField()
    why_items = serializers.SerializerMethodField()
    how_title = serializers.SerializerMethodField()
    how_intro = serializers.SerializerMethodField()
    how_steps = serializers.SerializerMethodField()
    how_outro = serializers.SerializerMethodField()
    cta_title = serializers.SerializerMethodField()
    contact1_label = serializers.SerializerMethodField()
    contact1_phone = serializers.SerializerMethodField()
    contact2_label = serializers.SerializerMethodField()
    contact2_phone = serializers.SerializerMethodField()

    class Meta:
        model = AgenciesPage
        fields = [
            'title', 'intro', 'why_title', 'why_items',
            'how_title', 'how_intro', 'how_steps', 'how_outro',
            'cta_title', 'contact1_label', 'contact1_phone', 'contact2_label', 'contact2_phone',
        ]

    def _t(self, obj):
        return _locale_translation(obj.translations, self.context.get('locale', 'ru'))

    def get_title(self, obj):
        t = self._t(obj); return t.title if t else ''

    def get_intro(self, obj):
        t = self._t(obj); return t.intro if t else ''

    def get_why_title(self, obj):
        t = self._t(obj); return t.why_title if t else ''

    def get_why_items(self, obj):
        t = self._t(obj)
        if not t or not t.why_items:
            return []
        return [s.strip() for s in t.why_items.splitlines() if s.strip()]

    def get_how_title(self, obj):
        t = self._t(obj); return t.how_title if t else ''

    def get_how_intro(self, obj):
        t = self._t(obj); return t.how_intro if t else ''

    def get_how_steps(self, obj):
        t = self._t(obj)
        if not t or not t.how_steps:
            return []
        return [s.strip() for s in t.how_steps.splitlines() if s.strip()]

    def get_how_outro(self, obj):
        t = self._t(obj); return t.how_outro if t else ''

    def get_cta_title(self, obj):
        t = self._t(obj); return t.cta_title if t else ''

    def get_contact1_label(self, obj):
        t = self._t(obj); return t.contact1_label if t else ''

    def get_contact1_phone(self, obj):
        t = self._t(obj); return t.contact1_phone if t else ''

    def get_contact2_label(self, obj):
        t = self._t(obj); return t.contact2_label if t else ''

    def get_contact2_phone(self, obj):
        t = self._t(obj); return t.contact2_phone if t else ''


class AboutContentSerializer(serializers.ModelSerializer):
    """Блок «О нас»: заголовок, абзацы и ссылка на видео для заданной локали."""
    title = serializers.SerializerMethodField()
    paragraphs = serializers.SerializerMethodField()
    presentation_pdf = serializers.SerializerMethodField()

    class Meta:
        model = AboutContent
        fields = ['title', 'paragraphs', 'video_url', 'presentation_pdf']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else ''

    def get_paragraphs(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        if not t or not t.paragraphs:
            return []
        return [p.strip() for p in t.paragraphs.split('\n\n') if p.strip()]

    def get_presentation_pdf(self, obj):
        if not obj.presentation_pdf:
            return None
        return _build_media_url(self.context.get('request'), obj.presentation_pdf)
