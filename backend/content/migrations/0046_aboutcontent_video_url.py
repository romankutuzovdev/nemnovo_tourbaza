# Добавление ссылки на видео в блок «О нас» (для страницы «О нас» — блок «Презентация турбазы»)

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0045_add_payment_legal_page'),
    ]

    operations = [
        migrations.AddField(
            model_name='aboutcontent',
            name='video_url',
            field=models.URLField(
                blank=True,
                help_text='Ссылка на видео (YouTube, Vimeo и т.д.). Используется в блоке «Презентация турбазы» на странице «О нас».',
                verbose_name='Ссылка на видео',
            ),
        ),
    ]
