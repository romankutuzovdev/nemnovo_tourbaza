from django.contrib import admin
from django.db.models import Max
from .models import (
    Service, ServiceDocument, ServiceQuestion, ServiceQuestionnaireSubmission, ServiceOrder, ServiceOrderItem, ServiceImage, ServiceVariant, ServiceTranslation,
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
    HeroContent, HeroContentTranslation,
    ReviewsStatsContent, ReviewsStatsContentTranslation,
    LegalPage, LegalPageTranslation,
    CertificateContent, CertificateContentTranslation,
    AgenciesPage, AgenciesPageTranslation,
    AboutContent, AboutContentTranslation,
)


class ServiceTranslationInline(admin.StackedInline):
    model = ServiceTranslation
    extra = 0
    fields = ['locale', 'title', 'short_desc', 'long_desc', 'seo_title', 'seo_description']


class ServiceImageInline(admin.TabularInline):
    model = ServiceImage
    extra = 1
    fields = ['image', 'image_url', 'order']


class ServiceVariantInline(admin.TabularInline):
    model = ServiceVariant
    extra = 1
    fields = ['name', 'description', 'price', 'order']


class ServiceDocumentInline(admin.TabularInline):
    model = ServiceDocument
    extra = 1
    fields = ['name', 'file', 'order']


class ServiceQuestionInline(admin.TabularInline):
    model = ServiceQuestion
    extra = 1
    fields = ['text', 'order']


class ServiceOrderItemInline(admin.TabularInline):
    model = ServiceOrderItem
    extra = 0
    readonly_fields = ['service', 'variant_name', 'quantity', 'unit_price', 'line_total']
    can_delete = False


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['slug', 'parent', 'category', 'price', 'order', 'needs_questionnaire', 'is_active']
    list_filter = ['category', 'is_active', 'needs_questionnaire', 'parent']
    list_editable = ['category', 'order', 'needs_questionnaire', 'is_active']
    list_select_related = ['parent']
    raw_id_fields = ['parent']
    inlines = [ServiceTranslationInline, ServiceImageInline, ServiceVariantInline, ServiceDocumentInline, ServiceQuestionInline]
    actions = ['make_active', 'make_inactive']
    fieldsets = [
        (None, {
            'fields': ['slug', 'parent', 'image', 'image_url', 'category', 'price', 'order'],
        }),
        ('Статус', {
            'fields': ['is_active'],
            'description': 'Активные услуги отображаются на сайте. Неактивные скрыты.',
        }),
        ('Анкета', {
            'fields': ['needs_questionnaire'],
        }),
    ]

    @admin.action(description='Сделать активными')
    def make_active(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} услуг(и) сделано активными.')

    @admin.action(description='Сделать неактивными')
    def make_inactive(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} услуг(и) сделано неактивными.')


@admin.register(ServiceQuestionnaireSubmission)
class ServiceQuestionnaireSubmissionAdmin(admin.ModelAdmin):
    list_display = ['service', 'name', 'email', 'created_at']
    list_filter = ['service', 'created_at']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['service', 'name', 'email', 'phone', 'message', 'answers', 'created_at']


@admin.register(ServiceOrder)
class ServiceOrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'customer_name', 'customer_phone', 'customer_email', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['customer_name', 'customer_phone', 'customer_email']
    readonly_fields = ['customer_name', 'customer_email', 'customer_phone', 'comment', 'total_amount', 'created_at']
    inlines = [ServiceOrderItemInline]


class EventTranslationInline(admin.StackedInline):
    model = EventTranslation
    extra = 0
    fields = ['locale', 'title', 'short_desc', 'long_desc', 'seo_title', 'seo_description']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['slug', 'order']
    inlines = [EventTranslationInline]


class NewsTranslationInline(admin.StackedInline):
    model = NewsTranslation
    extra = 0
    fields = ['locale', 'title', 'short_desc', 'long_desc', 'seo_title', 'seo_description']


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['slug', 'order', 'is_published', 'created_at']
    list_filter = ['is_published']
    list_editable = ['order', 'is_published']
    fieldsets = [
        (None, {
            'fields': ['slug', 'image', 'image_url', 'order', 'is_published'],
        }),
        ('Ссылка в конце статьи', {
            'fields': ['related_link_title', 'related_link_url'],
            'description': 'Заполните оба поля, чтобы в конце статьи появилась кликабельная ссылка.',
        }),
    ]
    inlines = [NewsTranslationInline]


class PromoTranslationInline(admin.StackedInline):
    model = PromoTranslation
    extra = 0
    fields = ['locale', 'title', 'short_desc', 'long_desc', 'seo_title', 'seo_description']


@admin.register(Promo)
class PromoAdmin(admin.ModelAdmin):
    list_display = ['slug', 'order', 'is_active']
    list_filter = ['is_active']
    inlines = [PromoTranslationInline]


def format_duration(seconds):
    """Секунды в строку ч:мм:сс (например 7140 -> 1:59:00)."""
    if seconds is None or seconds <= 0:
        return '—'
    try:
        seconds = int(seconds)
    except (TypeError, ValueError):
        return '—'
    if seconds <= 0:
        return '—'
    h = seconds // 3600
    m = (seconds % 3600) // 60
    s = seconds % 60
    if h > 0:
        return f'{h}:{m:02d}:{s:02d}'
    return f'{m}:{s:02d}'


def parse_duration(value):
    """Строка вида 1:59:00 или 59:00 -> секунды. Возвращает 0 при ошибке."""
    if not value or not str(value).strip():
        return 0
    parts = str(value).strip().split(':')
    try:
        if len(parts) == 1:
            return int(parts[0])
        if len(parts) == 2:
            return int(parts[0]) * 60 + int(parts[1])
        if len(parts) == 3:
            return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
    except (ValueError, TypeError):
        pass
    return 0


class HotOfferTranslationInline(admin.TabularInline):
    model = HotOfferTranslation
    extra = 0


from django import forms


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class MultipleFileField(forms.FileField):
    def clean(self, data, initial=None):
        single_clean = super().clean
        if isinstance(data, (list, tuple)):
            files = [single_clean(item, initial) for item in data if item]
            return files
        if not data:
            return []
        return [single_clean(data, initial)]


class HotOfferAdminForm(forms.ModelForm):
    """Форма с полем «До конца акции» в формате ч:мм:сс (например 1:59:00)."""
    time_until_end = forms.CharField(
        label='До конца акции (ч:мм:сс)',
        required=False,
        help_text='Например: 1:59:00 или 59:00. Оставьте пустым, чтобы не показывать таймер.',
        max_length=20,
    )

    class Meta:
        model = HotOffer
        exclude = ['duration_seconds']  # задаётся через time_until_end (ч:мм:сс)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk and self.instance.duration_seconds:
            self.initial['time_until_end'] = format_duration(self.instance.duration_seconds)

    def save(self, commit=True):
        obj = super().save(commit=False)
        time_val = self.cleaned_data.get('time_until_end')
        if time_val is not None:
            obj.duration_seconds = parse_duration(time_val)
        if commit:
            obj.save()
        return obj


@admin.register(HotOffer)
class HotOfferAdmin(admin.ModelAdmin):
    form = HotOfferAdminForm
    list_display = ['slug', 'order', 'is_active', 'delay_seconds', '_time_until_end']
    list_filter = ['is_active']
    inlines = [HotOfferTranslationInline]

    def _time_until_end(self, obj):
        try:
            sec = getattr(obj, 'duration_seconds', None)
            return format_duration(sec)
        except Exception:
            return '—'
    _time_until_end.short_description = 'До конца'


class PortfolioItemTranslationInline(admin.TabularInline):
    model = PortfolioItemTranslation
    extra = 0


class PortfolioItemImageInline(admin.TabularInline):
    model = PortfolioItemImage
    extra = 1


class PortfolioItemAdminForm(forms.ModelForm):
    bulk_images = MultipleFileField(
        label='Добавить много фото',
        required=False,
        widget=MultipleFileInput(attrs={'multiple': True}),
        help_text='Можно выбрать сразу несколько файлов. Они добавятся в галерею при сохранении.',
    )

    class Meta:
        model = PortfolioItem
        fields = '__all__'


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    form = PortfolioItemAdminForm
    list_display = ['slug', 'event_date', 'order', 'is_pinned']
    list_filter = ['is_pinned']
    fields = ['slug', 'image', 'image_url', 'image_urls', 'event_date', 'order', 'is_pinned', 'bulk_images']
    inlines = [PortfolioItemTranslationInline, PortfolioItemImageInline]

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        files = request.FILES.getlist('bulk_images')
        if not files:
            return
        item = form.instance
        next_order = (item.images.aggregate(Max('order')).get('order__max') or 0) + 1
        for f in files:
            PortfolioItemImage.objects.create(
                portfolio_item=item,
                image=f,
                order=next_order,
            )
            next_order += 1


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['author', 'rating', 'order', 'is_published']
    list_filter = ['is_published', 'rating']
    list_editable = ['order', 'is_published']


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'link', 'logo']
    list_editable = ['order']


class HowToGetRouteTranslationInline(admin.TabularInline):
    model = HowToGetRouteTranslation
    extra = 0


@admin.register(HowToGetRoute)
class HowToGetRouteAdmin(admin.ModelAdmin):
    list_display = ['city_slug', 'transport_type', 'order']
    list_filter = ['city_slug', 'transport_type']
    list_editable = ['order']
    inlines = [HowToGetRouteTranslationInline]


@admin.register(MapArea)
class MapAreaAdmin(admin.ModelAdmin):
    list_display = ['number', 'name', 'area_id', 'service', 'order', 'is_active']
    list_filter = ['is_active']
    list_editable = ['order', 'is_active']
    raw_id_fields = ['service']
    fieldsets = [
        (None, {
            'fields': ['area_id', 'number', 'name', 'service', 'order', 'is_active'],
        }),
        ('Позиция на карте (%)', {
            'fields': ['left', 'top'],
            'description': 'Координаты центра кружка в процентах от размера карты (0–100). '
                           'Для точной настройки откройте страницу карты с параметром ?calibrate=1.',
        }),
    ]


class LegalPageTranslationInline(admin.StackedInline):
    model = LegalPageTranslation
    extra = 0
    fields = ['locale', 'title', 'content', 'seo_title', 'seo_description']


@admin.register(LegalPage)
class LegalPageAdmin(admin.ModelAdmin):
    list_display = ['page_key', '__str__']
    inlines = [LegalPageTranslationInline]


class CertificateContentTranslationInline(admin.StackedInline):
    model = CertificateContentTranslation
    extra = 0


@admin.register(CertificateContent)
class CertificateContentAdmin(admin.ModelAdmin):
    list_display = ['__str__']
    inlines = [CertificateContentTranslationInline]


class HeroContentTranslationInline(admin.TabularInline):
    model = HeroContentTranslation
    extra = 0


@admin.register(HeroContent)
class HeroContentAdmin(admin.ModelAdmin):
    list_display = ['__str__']
    inlines = [HeroContentTranslationInline]


class ReviewsStatsContentTranslationInline(admin.TabularInline):
    model = ReviewsStatsContentTranslation
    extra = 0


@admin.register(ReviewsStatsContent)
class ReviewsStatsContentAdmin(admin.ModelAdmin):
    list_display = ['__str__']
    inlines = [ReviewsStatsContentTranslationInline]


class AgenciesPageTranslationInline(admin.StackedInline):
    model = AgenciesPageTranslation
    extra = 0


@admin.register(AgenciesPage)
class AgenciesPageAdmin(admin.ModelAdmin):
    list_display = ['__str__']
    inlines = [AgenciesPageTranslationInline]


class AboutContentTranslationInline(admin.StackedInline):
    model = AboutContentTranslation
    extra = 0


@admin.register(AboutContent)
class AboutContentAdmin(admin.ModelAdmin):
    list_display = ['place', 'video_url', 'presentation_pdf']
    fields = ['place', 'video_url', 'presentation_pdf']
    inlines = [AboutContentTranslationInline]


@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'contact_email']
    fields = [
        'company_name', 'legal_address', 'office_address',
        'unp', 'okpo', 'trade_register', 'services_register', 'contact_email',
        'bank_account', 'bank_name', 'bank_bic',
        'destination_address', 'destination_gps_lat', 'destination_gps_lon',
    ]


