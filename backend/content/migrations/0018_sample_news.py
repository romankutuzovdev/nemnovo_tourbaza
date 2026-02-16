# Add sample news for all locales

from django.db import migrations


def create_sample_news(apps, schema_editor):
    News = apps.get_model('content', 'News')
    NewsTranslation = apps.get_model('content', 'NewsTranslation')

    samples = [
        {
            'slug': 'new-season-2025',
            'order': 0,
            'image_url': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
            'translations': {
                'ru': {'title': 'Открытие сезона 2025', 'short_desc': 'Турбаза «Немново» открывает летний сезон. Ждём гостей на природу и активный отдых.', 'long_desc': 'Мы рады сообщить, что с 1 июня турбаза «Немново» открыта для приёма гостей. В этом сезоне обновлены беседки и зоны отдыха. Как всегда — уютные домики, баня и живописная природа вокруг.'},
                'be': {'title': 'Адкрыццё сезона 2025', 'short_desc': 'Турбаза «Немнава» адкрывае летні сезон. Чакаем гасцей на прыроду і актыўны адпачынак.', 'long_desc': 'Мы рады паведаміць, што з 1 чэрвеня турбаза «Немнава» адкрыта для прыёму гасцей. У гэтым сезоне абноўлены беседкі і зоны адпачынку.'},
                'en': {'title': 'Season opening 2025', 'short_desc': 'Nemnovo camp opens the summer season. We welcome guests for nature and active recreation.', 'long_desc': 'We are pleased to announce that from June 1 Nemnovo is open for guests. This season we have updated the gazebos and recreation areas.'},
                'pl': {'title': 'Otwarcie sezonu 2025', 'short_desc': 'Baza turystyczna Nemnovo otwiera sezon letni. Zapraszamy na wypoczynek na łonie natury.', 'long_desc': 'Z przyjemnością informujemy, że od 1 czerwca baza jest otwarta dla gości. W tym sezonie odnowiliśmy altany i strefy wypoczynku.'},
                'zh': {'title': '2025季节开放', 'short_desc': '涅姆诺沃营地开放夏季季节。欢迎客人前来享受自然与休闲。', 'long_desc': '我们很高兴地宣布，从6月1日起涅姆诺沃向客人开放。本季我们更新了凉亭和休息区。'},
            },
        },
        {
            'slug': 'marathon-announcement',
            'order': 1,
            'image_url': 'https://images.unsplash.com/photo-1452626038303-9f16cab761f6?w=800',
            'translations': {
                'ru': {'title': 'Марафон «Немново» — даты и регистрация', 'short_desc': 'Традиционный марафон в окрестностях турбазы пройдёт в августе. Регистрация открыта.', 'long_desc': 'Ежегодный марафон «Немново» запланирован на 15 августа. Дистанции: 10 км и полумарафон. Старт и финиш на территории турбазы. Регистрация на сайте и в наших соцсетях.'},
                'be': {'title': 'Марафон «Немнава» — даты і рэгістрацыя', 'short_desc': 'Традыцыйны марафон у ваколіцах турбазы пройдзе ў жніўні. Рэгістрацыя адкрыта.', 'long_desc': 'Щагодны марафон «Немнава» запланаваны на 15 жніўня. Дыстанцыі: 10 км і паўмарафон.'},
                'en': {'title': 'Nemnovo Marathon — dates and registration', 'short_desc': 'The traditional marathon near the camp will take place in August. Registration is open.', 'long_desc': 'The annual Nemnovo Marathon is scheduled for August 15. Distances: 10K and half marathon. Start and finish at the camp.'},
                'pl': {'title': 'Maraton Nemnovo — daty i rejestracja', 'short_desc': 'Tradycyjny maraton w okolicach bazy odbędzie się w sierpniu. Rejestracja otwarta.', 'long_desc': 'Coroczny maraton Nemnovo zaplanowano na 15 sierpnia. Dystanse: 10 km i półmaraton.'},
                'zh': {'title': '涅姆诺沃马拉松 — 日期与报名', 'short_desc': '营地附近传统马拉松将于八月举行。报名已开放。', 'long_desc': '年度涅姆诺沃马拉松定于8月15日举行。距离：10公里和半程马拉松。'},
            },
        },
        {
            'slug': 'new-gazebos',
            'order': 2,
            'image_url': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
            'translations': {
                'ru': {'title': 'Новые беседки и зона барбекю', 'short_desc': 'На территории появились две новые беседки с мангалами. Идеально для компаний.', 'long_desc': 'Мы построили две просторные беседки с навесами и мангалами. Теперь можно комфортно отдыхать большой компанией в любую погоду. Бронируйте заранее.'},
                'be': {'title': 'Новыя беседкі і зона барбекю', 'short_desc': 'На тэрыторыі з\'явіліся дзве новыя беседкі з мангаламі. Ідэальна для кампаній.', 'long_desc': 'Мы пабудавалі дзве прасторныя беседкі з навесамі і мангаламі.'},
                'en': {'title': 'New gazebos and barbecue area', 'short_desc': 'Two new gazebos with grills have appeared on the territory. Perfect for groups.', 'long_desc': 'We have built two spacious gazebos with shelters and grills. Now you can relax comfortably with a large group in any weather.'},
                'pl': {'title': 'Nowe altany i strefa grillowa', 'short_desc': 'Na terenie pojawiły się dwie nowe altany z grillami. Idealne dla grup.', 'long_desc': 'Zbudowaliśmy dwie przestronne altany z zadaszeniami i grillami.'},
                'zh': {'title': '新凉亭与烧烤区', 'short_desc': '园区内新增两处带烤架的凉亭。适合团体使用。', 'long_desc': '我们建造了两座带遮阳和烤架的宽敞凉亭。现在您可以与大队人马在任何天气下舒适休息。'},
            },
        },
        {
            'slug': 'winter-holidays',
            'order': 3,
            'image_url': 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800',
            'translations': {
                'ru': {'title': 'Новогодние каникулы на турбазе', 'short_desc': 'Встречайте Новый год в тишине и природе. Баня, снег и уютные домики.', 'long_desc': 'На новогодние праздники турбаза «Немново» принимает гостей. Предлагаем уютное размещение, баню и зимние прогулки. Идеально для семейного отдыха.'},
                'be': {'title': 'Навагоднія канікулы на турбазе', 'short_desc': 'Сустракайце Новы год у цішы і прыродзе. Лазня, снег і зручныя дамікі.', 'long_desc': 'На навагоднія святы турбаза «Немнава» прымае гасцей. Прапануем зручнае размяшчэнне, лазню і зімовыя прагулкі.'},
                'en': {'title': 'New Year holidays at the camp', 'short_desc': 'Celebrate New Year in peace and nature. Sauna, snow and cozy cabins.', 'long_desc': 'For the New Year holidays Nemnovo welcomes guests. We offer cozy accommodation, sauna and winter walks. Perfect for a family break.'},
                'pl': {'title': 'Święta noworoczne na bazie', 'short_desc': 'Witaj Nowy Rok w ciszy i naturze. Sauna, śnieg i przytulne domki.', 'long_desc': 'Na święta noworoczne baza Nemnovo zaprasza gości. Oferujemy przytulne zakwaterowanie, saunę i zimowe spacery.'},
                'zh': {'title': '营地新年假期', 'short_desc': '在宁静与自然中迎接新年。桑拿、雪景与舒适木屋。', 'long_desc': '新年假期涅姆诺沃营地欢迎客人。我们提供舒适住宿、桑拿与冬日散步。适合家庭度假。'},
            },
        },
        {
            'slug': 'cooperation-agencies',
            'order': 4,
            'image_url': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
            'translations': {
                'ru': {'title': 'Сотрудничество с турагентствами', 'short_desc': 'Расширяем партнёрскую программу для турфирм и агентств. Специальные условия.', 'long_desc': 'Турбаза «Немново» приглашает к сотрудничеству турагентства и туроператоров. Предлагаем выгодные условия по групповому размещению и мероприятиям. Свяжитесь с нами для обсуждения деталей.'},
                'be': {'title': 'Супрацоўніцтва з турагентствамі', 'short_desc': 'Пашыраем партнёрскую праграму для турфірмаў і агентстваў. Спецыяльныя ўмовы.', 'long_desc': 'Турбаза «Немнава» запрашае да супрацоўніцтва турагентствы і туроператараў.'},
                'en': {'title': 'Cooperation with travel agencies', 'short_desc': 'We are expanding our partner programme for tour operators and agencies. Special terms.', 'long_desc': 'Nemnovo invites travel agencies and tour operators to cooperate. We offer favourable terms for group accommodation and events. Contact us to discuss details.'},
                'pl': {'title': 'Współpraca z biurami podróży', 'short_desc': 'Rozszerzamy program partnerski dla biur podróży. Specjalne warunki.', 'long_desc': 'Baza Nemnovo zaprasza do współpracy biura podróży i touroperatorów. Oferujemy korzystne warunki dla grup.'},
                'zh': {'title': '与旅行社合作', 'short_desc': '我们正在扩大针对旅行社和运营商的合作计划。特别条件。', 'long_desc': '涅姆诺沃营地邀请旅行社和旅游运营商合作。我们为团体住宿和活动提供优惠条件。请联系我们讨论详情。'},
            },
        },
    ]

    for item in samples:
        news = News.objects.create(
            slug=item['slug'],
            order=item['order'],
            image_url=item.get('image_url', ''),
        )
        for locale, texts in item['translations'].items():
            NewsTranslation.objects.create(
                news=news,
                locale=locale,
                title=texts['title'],
                short_desc=texts['short_desc'],
                long_desc=texts['long_desc'],
            )


def remove_sample_news(apps, schema_editor):
    News = apps.get_model('content', 'News')
    News.objects.filter(slug__in=[
        'new-season-2025', 'marathon-announcement', 'new-gazebos',
        'winter-holidays', 'cooperation-agencies',
    ]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0017_add_news'),
    ]

    operations = [
        migrations.RunPython(create_sample_news, remove_sample_news),
    ]
