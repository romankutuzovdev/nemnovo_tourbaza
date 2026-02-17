from django.contrib import admin
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


class ServiceTranslationInline(admin.TabularInline):
    model = ServiceTranslation
    extra = 0


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['slug', 'order']
    inlines = [ServiceTranslationInline]


class EventTranslationInline(admin.TabularInline):
    model = EventTranslation
    extra = 0


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['slug', 'order']
    inlines = [EventTranslationInline]


class NewsTranslationInline(admin.TabularInline):
    model = NewsTranslation
    extra = 0


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['slug', 'order', 'is_published', 'created_at']
    list_filter = ['is_published']
    list_editable = ['order', 'is_published']
    inlines = [NewsTranslationInline]


class PromoTranslationInline(admin.TabularInline):
    model = PromoTranslation
    extra = 0


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


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ['slug', 'event_date', 'order', 'is_pinned']
    list_filter = ['is_pinned']
    inlines = [PortfolioItemTranslationInline, PortfolioItemImageInline]


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


@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'contact_email']
    fields = [
        'company_name', 'legal_address', 'office_address',
        'unp', 'okpo', 'trade_register', 'services_register', 'contact_email',
        'destination_address', 'destination_gps_lat', 'destination_gps_lon',
    ]


