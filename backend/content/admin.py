from django.contrib import admin
from .models import (
    Service, ServiceTranslation,
    News, NewsTranslation,
    Promo, PromoTranslation,
    PortfolioItem, PortfolioItemImage, PortfolioItemTranslation,
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


class NewsTranslationInline(admin.TabularInline):
    model = NewsTranslation
    extra = 0


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['slug', 'published_at', 'is_published', 'order']
    list_filter = ['is_published']
    inlines = [NewsTranslationInline]


class PromoTranslationInline(admin.TabularInline):
    model = PromoTranslation
    extra = 0


@admin.register(Promo)
class PromoAdmin(admin.ModelAdmin):
    list_display = ['slug', 'order', 'is_active']
    list_filter = ['is_active']
    inlines = [PromoTranslationInline]


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


