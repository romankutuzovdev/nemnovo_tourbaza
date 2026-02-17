import io
import zipfile
from urllib.request import urlopen

import json
from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Service, Event, News, Promo, HotOffer, PortfolioItem, Review, Partner, HowToGetRoute, CompanyInfo
from .serializers import (
    ServiceListSerializer,
    ServiceDetailSerializer,
    EventListSerializer,
    EventDetailSerializer,
    NewsListSerializer,
    NewsDetailSerializer,
    PromoListSerializer,
    PromoDetailSerializer,
    HotOfferListSerializer,
    PortfolioItemListSerializer,
    PortfolioItemDetailSerializer,
    _portfolio_image_urls,
    ReviewSerializer,
    PartnerSerializer,
    how_to_get_cities_from_routes,
    CompanyInfoSerializer,
)

VALID_LOCALES = {'ru', 'be', 'en', 'pl', 'zh'}


def get_locale(request):
    loc = request.query_params.get('locale', 'ru')
    return loc if loc in VALID_LOCALES else 'ru'


@api_view(['GET'])
def company_info(request):
    """Реквизиты компании для футера (одна запись)."""
    info = CompanyInfo.objects.first()
    if not info:
        return Response({
            'company_name': 'ООО «Немново Тур»',
            'legal_address': '',
            'office_address': '',
            'unp': '',
            'okpo': '',
            'trade_register': '',
            'services_register': '',
            'contact_email': 'office@nemnovotour.by',
        })
    serializer = CompanyInfoSerializer(info)
    return Response(serializer.data)


@api_view(['GET'])
def how_to_get(request):
    """Как добраться: маршруты сгруппированы по городу; адрес и GPS из реквизитов."""
    locale = get_locale(request)
    routes = HowToGetRoute.objects.all()
    cities_data = how_to_get_cities_from_routes(routes, locale)
    info = CompanyInfo.objects.first()
    payload = {
        'cities': cities_data,
        'address': '',
        'gps_lat': None,
        'gps_lon': None,
    }
    if info:
        payload['address'] = info.destination_address or ''
        payload['gps_lat'] = info.destination_gps_lat
        payload['gps_lon'] = info.destination_gps_lon
    return Response(payload)


@api_view(['GET'])
def service_list(request):
    locale = get_locale(request)
    qs = Service.objects.all()
    serializer = ServiceListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def service_detail(request, slug):
    locale = get_locale(request)
    try:
        service = Service.objects.get(slug=slug)
    except Service.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = ServiceDetailSerializer(service, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def event_list(request):
    locale = get_locale(request)
    qs = Event.objects.all()
    serializer = EventListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def event_detail(request, slug):
    locale = get_locale(request)
    try:
        event = Event.objects.get(slug=slug)
    except Event.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = EventDetailSerializer(event, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def news_list(request):
    locale = get_locale(request)
    qs = News.objects.filter(is_published=True)
    serializer = NewsListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def news_detail(request, slug):
    locale = get_locale(request)
    try:
        news = News.objects.get(slug=slug, is_published=True)
    except News.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = NewsDetailSerializer(news, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def promo_list(request):
    locale = get_locale(request)
    qs = Promo.objects.filter(is_active=True)
    serializer = PromoListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def promo_detail(request, slug):
    locale = get_locale(request)
    try:
        promo = Promo.objects.get(slug=slug, is_active=True)
    except Promo.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = PromoDetailSerializer(promo, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def hot_offer_list(request):
    """Список активных горячих предложений для попапа (по одному показывают через 5 сек)."""
    locale = get_locale(request)
    qs = HotOffer.objects.filter(is_active=True)
    serializer = HotOfferListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def partner_list(request):
    """Список партнёров для блока «С кем мы сотрудничаем»."""
    qs = Partner.objects.all()
    serializer = PartnerSerializer(qs, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def review_list(request):
    """Список опубликованных отзывов для главной (автор, текст, оценка 1–5)."""
    qs = Review.objects.filter(is_published=True)
    serializer = ReviewSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def portfolio_list(request):
    locale = get_locale(request)
    qs = PortfolioItem.objects.all()
    serializer = PortfolioItemListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def portfolio_detail(request, slug):
    locale = get_locale(request)
    try:
        item = PortfolioItem.objects.get(slug=slug)
    except PortfolioItem.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = PortfolioItemDetailSerializer(item, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@csrf_exempt
@require_http_methods(['POST'])
def contact_submit(request):
    """Принимает JSON: type ('main'|'complaint'), name, email, message. Тестово письма уходят на CONTACT_TEST_EMAIL."""
    try:
        data = json.loads(request.body) if request.body else {}
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    form_type = data.get('type')
    if form_type not in ('main', 'complaint', 'hot_offer'):
        return JsonResponse({'error': 'type must be main, complaint or hot_offer'}, status=400)
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    message = (data.get('message') or '').strip()
    if not name or not email or not message:
        return JsonResponse({'error': 'name, email, message required'}, status=400)
    to_email = getattr(settings, 'CONTACT_TEST_EMAIL', 'roman.kutuzov.dev@gmail.com')
    subject_map = {'main': '[Заявка] Nemnovo Tour', 'complaint': '[Претензия/предложение] Nemnovo Tour', 'hot_offer': '[Горячее предложение] Nemnovo Tour'}
    subject = subject_map.get(form_type, '[Заявка] Nemnovo Tour')
    type_label = {'main': 'Заявка', 'complaint': 'Претензия/предложение', 'hot_offer': 'Горячее предложение'}.get(form_type, form_type)
    body = f"Тип: {type_label}\nИмя: {name}\nEmail: {email}\n\nСообщение:\n{message}"
    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=False,
        )
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'ok': True})


def portfolio_download(request, slug):
    """Скачать все фото мероприятия одним ZIP-архивом."""
    try:
        item = PortfolioItem.objects.get(slug=slug)
    except PortfolioItem.DoesNotExist:
        return HttpResponse('Not found', status=404)
    urls = _portfolio_image_urls(item, request)
    if not urls:
        return HttpResponse('Нет фото для скачивания', status=404)
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        for i, url in enumerate(urls):
            try:
                with urlopen(url, timeout=15) as r:
                    data = r.read()
                ext = '.jpg'
                if '.png' in url.lower():
                    ext = '.png'
                elif '.gif' in url.lower():
                    ext = '.gif'
                elif '.webp' in url.lower():
                    ext = '.webp'
                zf.writestr(f'{i + 1:03d}{ext}', data)
            except Exception:
                continue
    buf.seek(0)
    response = HttpResponse(buf.getvalue(), content_type='application/zip')
    response['Content-Disposition'] = f'attachment; filename="{slug}.zip"'
    return response


