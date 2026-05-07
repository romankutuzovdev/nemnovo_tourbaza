import io
import zipfile
from decimal import Decimal
from urllib.request import urlopen

import json
from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.db.models import Prefetch
from .models import Service, ServiceQuestionnaireSubmission, ServiceOrder, ServiceOrderItem, Event, News, Promo, HotOffer, PortfolioItem, Review, Partner, HowToGetRoute, CompanyInfo, MapArea, HeroContent, ReviewsStatsContent, LegalPage, CertificateContent, AgenciesPage, AboutContent
from .serializers import (
    ServiceListSerializer,
    ServiceTreeSerializer,
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
    MapAreaSerializer,
    HeroContentSerializer,
    ReviewsStatsContentSerializer,
    LegalPageSerializer,
    CertificateContentSerializer,
    AgenciesPageSerializer,
    AboutContentSerializer,
    ServiceOrderCreateSerializer,
    ServiceOrderSerializer,
)

VALID_LOCALES = {'ru', 'be', 'en', 'pl', 'zh'}


def get_locale(request):
    loc = request.query_params.get('locale', 'ru')
    return loc if loc in VALID_LOCALES else 'ru'


@api_view(['GET', 'HEAD'])
def legal_page(request, page_key):
    """Содержимое юридической страницы по ключу: privacy, cookie-policy, public-offer, gift-certificate."""
    locale = get_locale(request)
    try:
        page = LegalPage.objects.prefetch_related('translations').get(page_key=page_key)
    except LegalPage.DoesNotExist:
        return Response({'page_key': page_key, 'title': '', 'content': ''})
    serializer = LegalPageSerializer(page, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def about_content(request):
    """Контент блока «О нас»: заголовок и абзацы. place=main — для главной, place=about — для страницы «О нас»."""
    locale = get_locale(request)
    place = request.query_params.get('place', 'main')
    if place not in ('main', 'about'):
        place = 'main'
    obj = AboutContent.objects.filter(place=place).prefetch_related('translations').first()
    if not obj:
        return Response({'title': '', 'paragraphs': []})
    serializer = AboutContentSerializer(obj, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def agencies_page(request):
    """Контент страницы «Агентствам»."""
    locale = get_locale(request)
    obj = AgenciesPage.objects.prefetch_related('translations').first()
    if not obj:
        return Response({
            'title': '', 'intro': '', 'why_title': '', 'why_items': [],
            'how_title': '', 'how_intro': '', 'how_steps': [], 'how_outro': '',
            'cta_title': '', 'contact1_label': '', 'contact1_phone': '',
            'contact2_label': '', 'contact2_phone': '',
        })
    serializer = AgenciesPageSerializer(obj, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def hero_content(request):
    """Контент главного блока (hero): картинка и переводы текстов."""
    locale = get_locale(request)
    obj = HeroContent.objects.prefetch_related('translations').first()
    if not obj:
        return Response({'image': None, 'image_url': '', 'badge': '', 'title1': '', 'title2': '', 'subtitle': ''})
    serializer = HeroContentSerializer(obj, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def reviews_stats_content(request):
    """Контент блока статистики перед отзывами на главной странице."""
    locale = get_locale(request)
    obj = ReviewsStatsContent.objects.prefetch_related('translations').first()
    if not obj:
        return Response({
            'distance_value': '',
            'distance_label': '',
            'stat1_value': '',
            'stat1_label': '',
            'stat2_value': '',
            'stat2_label': '',
        })
    serializer = ReviewsStatsContentSerializer(obj, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def certificate_content(request):
    """Контент подарочного сертификата: картинка, заголовок, описание."""
    locale = get_locale(request)
    obj = CertificateContent.objects.prefetch_related('translations').first()
    if not obj:
        return Response({'image': None, 'image_url': '', 'title': '', 'content': ''})
    serializer = CertificateContentSerializer(obj, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
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


@api_view(['GET', 'HEAD'])
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


@api_view(['GET', 'HEAD'])
def service_list(request):
    locale = get_locale(request)
    use_tree = request.query_params.get('tree') == '1'
    if use_tree:
        child_qs = Service.objects.filter(is_active=True).prefetch_related('translations', 'images')
        qs = Service.objects.filter(is_active=True, parent__isnull=True).prefetch_related(
            Prefetch('children', queryset=child_qs.order_by('order', 'id'))
        )
        serializer = ServiceTreeSerializer(qs, many=True, context={'locale': locale, 'request': request})
    else:
        qs = Service.objects.filter(is_active=True).prefetch_related('translations', 'images')
        serializer = ServiceListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def service_detail(request, slug):
    locale = get_locale(request)
    try:
        service = Service.objects.prefetch_related(
            'translations', 'images', 'variants',
            'children', 'children__translations', 'children__images',
            'documents', 'questions',
        ).get(slug=slug, is_active=True)
    except Service.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = ServiceDetailSerializer(service, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def event_list(request):
    locale = get_locale(request)
    qs = Event.objects.all()
    serializer = EventListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def event_detail(request, slug):
    locale = get_locale(request)
    try:
        event = Event.objects.get(slug=slug)
    except Event.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = EventDetailSerializer(event, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def news_list(request):
    locale = get_locale(request)
    qs = News.objects.filter(is_published=True)
    serializer = NewsListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def news_detail(request, slug):
    locale = get_locale(request)
    try:
        news = News.objects.get(slug=slug, is_published=True)
    except News.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = NewsDetailSerializer(news, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def promo_list(request):
    locale = get_locale(request)
    qs = Promo.objects.filter(is_active=True)
    serializer = PromoListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def promo_detail(request, slug):
    locale = get_locale(request)
    try:
        promo = Promo.objects.get(slug=slug, is_active=True)
    except Promo.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = PromoDetailSerializer(promo, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def hot_offer_list(request):
    """Список активных горячих предложений для попапа (по одному показывают через 5 сек)."""
    locale = get_locale(request)
    qs = HotOffer.objects.filter(is_active=True)
    serializer = HotOfferListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def partner_list(request):
    """Список партнёров для блока «С кем мы сотрудничаем»."""
    qs = Partner.objects.all()
    serializer = PartnerSerializer(qs, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def review_list(request):
    """Список опубликованных отзывов для главной (автор, текст, оценка 1–5)."""
    qs = Review.objects.filter(is_published=True)
    serializer = ReviewSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def portfolio_list(request):
    locale = get_locale(request)
    qs = PortfolioItem.objects.all()
    serializer = PortfolioItemListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
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
def service_questionnaire_submit(request, slug):
    """Принимает анкету по услуге: name, email, phone?, message?, answers {question_id: answer}."""
    try:
        data = json.loads(request.body) if request.body else {}
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    try:
        service = Service.objects.get(slug=slug, is_active=True)
    except Service.DoesNotExist:
        return JsonResponse({'error': 'Service not found'}, status=404)
    has_questions = service.questions.exists()
    if not service.needs_questionnaire and not has_questions:
        return JsonResponse({'error': 'Questionnaire not required for this service'}, status=400)
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    if not name or not email:
        return JsonResponse({'error': 'name and email required'}, status=400)
    phone = (data.get('phone') or '').strip()
    message = (data.get('message') or '').strip()
    answers = data.get('answers') or {}
    if not isinstance(answers, dict):
        answers = {}
    valid_question_ids = set(service.questions.values_list('id', flat=True))
    filtered_answers = {str(k): str(v).strip() for k, v in answers.items() if str(k) in (str(i) for i in valid_question_ids) and v}
    ServiceQuestionnaireSubmission.objects.create(
        service=service,
        name=name,
        email=email,
        phone=phone,
        message=message,
        answers=filtered_answers,
    )
    to_email = getattr(settings, 'CONTACT_TEST_EMAIL', None) or 'office@nemnovotour.by'
    lines = ['Это заявка с турбазы Немново.', f'Услуга: {service.slug}', f'Имя: {name}', f'Email: {email}', f'Телефон: {phone}']
    if message:
        lines.append(f'\nСообщение:\n{message}')
    if filtered_answers:
        lines.append('\nОтветы на вопросы анкеты:')
        for q in service.questions.all().order_by('order'):
            ans = filtered_answers.get(str(q.id), '—')
            lines.append(f'  • {q.text}: {ans}')
    body = '\n'.join(lines)
    try:
        send_mail(
            subject=f'[Анкета] {service.slug} — {name}',
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=False,
        )
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'ok': True})


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
    body = f"Это заявка с турбазы Немново.\nТип: {type_label}\nИмя: {name}\nEmail: {email}\n\nСообщение:\n{message}"
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def service_order_create(request):
    """Создание заказа из корзины услуг."""
    try:
        data = json.loads(request.body) if request.body else {}
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    # Поддерживаем старый/альтернативный формат ключей из фронтенда.
    raw_items = data.get('items') if isinstance(data, dict) else None
    if isinstance(raw_items, list):
        normalized_items = []
        for it in raw_items:
            if not isinstance(it, dict):
                continue
            normalized_items.append({
                'service_slug': it.get('service_slug') or it.get('serviceSlug') or it.get('slug'),
                'variant_name': it.get('variant_name') or it.get('variantName'),
                'quantity': it.get('quantity', 1),
            })
        data['items'] = normalized_items

    serializer = ServiceOrderCreateSerializer(data=data)
    if not serializer.is_valid():
        details = serializer.errors
        first_error = 'Invalid payload'
        try:
            if isinstance(details, dict):
                for field, val in details.items():
                    if isinstance(val, list) and val:
                        first_error = f'{field}: {val[0]}'
                        break
                    if isinstance(val, dict):
                        first_error = f'{field}: {val}'
                        break
        except Exception:
            pass
        return JsonResponse({'error': first_error, 'details': details}, status=400)
    payload = serializer.validated_data
    items_payload = payload.get('items') or []
    if not items_payload:
        return JsonResponse({'error': 'items required'}, status=400)

    slugs = [it['service_slug'] for it in items_payload]
    services = Service.objects.filter(slug__in=slugs, is_active=True)
    services_map = {s.slug: s for s in services}
    if len(services_map) != len(set(slugs)):
        return JsonResponse({'error': 'Some services not found'}, status=400)

    total = Decimal('0')
    normalized = []
    for item in items_payload:
        svc = services_map[item['service_slug']]
        variant_name = (item.get('variant_name') or '').strip()
        variant = None
        if svc.variants.exists():
            if not variant_name:
                # Для старых записей корзины без variant_name выбираем первый доступный вариант с ценой.
                variant = svc.variants.filter(price__isnull=False).order_by('order', 'id').first()
                if not variant:
                    return JsonResponse({'error': f'Service {svc.slug} requires variant selection'}, status=400)
                variant_name = variant.name
            else:
                variant = svc.variants.filter(name=variant_name).first()
                if not variant:
                    return JsonResponse({'error': f'Variant "{variant_name}" not found for {svc.slug}'}, status=400)
            if variant.price is None:
                return JsonResponse({'error': f'Variant "{variant_name}" has no price'}, status=400)
            unit_price = variant.price
        else:
            if svc.price is None:
                return JsonResponse({'error': f'Service {svc.slug} has no price'}, status=400)
            unit_price = svc.price
        qty = int(item.get('quantity') or 1)
        line_total = (unit_price or Decimal('0')) * qty
        total += line_total
        normalized.append((svc, variant_name, qty, unit_price, line_total))

    customer_name = (payload.get('name') or '').strip()
    if not customer_name:
        customer_name = (request.user.get_full_name() or request.user.username or '').strip() or 'Пользователь'
    customer_email = (payload.get('email') or '').strip() or (getattr(request.user, 'email', '') or '').strip()

    order = ServiceOrder.objects.create(
        user=request.user,
        customer_name=customer_name,
        customer_email=customer_email,
        customer_phone=(payload.get('phone') or '').strip(),
        comment=(payload.get('comment') or '').strip(),
        total_amount=total,
    )
    for svc, variant_name, qty, unit_price, line_total in normalized:
        ServiceOrderItem.objects.create(
            order=order,
            service=svc,
            variant_name=variant_name,
            quantity=qty,
            unit_price=unit_price,
            line_total=line_total,
        )

    lines = [
        'Новый заказ с сайта Немново',
        f'Заказ №{order.id}',
        f'Имя: {order.customer_name}',
        f'Email: {order.customer_email or "—"}',
        f'Телефон: {order.customer_phone or "—"}',
        f'Комментарий: {order.comment or "—"}',
        '',
        'Позиции:',
    ]
    for it in order.items.select_related('service').all():
        variant_label = f' ({it.variant_name})' if it.variant_name else ''
        lines.append(f'  • {it.service.slug}{variant_label} x{it.quantity} = {it.line_total} BYN')
    lines.append('')
    lines.append(f'Итого: {order.total_amount} BYN')
    body = '\n'.join(lines)
    to_email = getattr(settings, 'CONTACT_TEST_EMAIL', None) or 'office@nemnovotour.by'
    recipients = [to_email]
    try:
        send_mail(
            subject=f'[Заказ] #{order.id} — {order.customer_name}',
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
            fail_silently=False,
        )
    except Exception:
        pass

    out = ServiceOrderSerializer(order, context={'locale': 'ru', 'request': request})
    return JsonResponse({'ok': True, 'order': out.data})


@api_view(['GET', 'HEAD'])
@permission_classes([IsAuthenticated])
def service_order_list(request):
    """Список заказов текущего пользователя (для личного кабинета)."""
    qs = ServiceOrder.objects.prefetch_related('items__service', 'items__service__translations').filter(user=request.user)
    serializer = ServiceOrderSerializer(qs[:100], many=True, context={'locale': get_locale(request), 'request': request})
    return Response(serializer.data)


@api_view(['GET', 'HEAD'])
def map_area_list(request):
    """Активные области интерактивной карты с данными связанных услуг."""
    locale = get_locale(request)
    qs = MapArea.objects.filter(is_active=True).select_related('service').prefetch_related('service__images', 'service__translations')
    serializer = MapAreaSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


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


