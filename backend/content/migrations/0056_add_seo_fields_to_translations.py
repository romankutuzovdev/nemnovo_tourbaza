from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0055_add_rental_agreement_legal_page'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventtranslation',
            name='seo_description',
            field=models.TextField(blank=True, help_text='Рекомендуется 140-160 символов.', verbose_name='SEO описание (description)'),
        ),
        migrations.AddField(
            model_name='eventtranslation',
            name='seo_title',
            field=models.CharField(blank=True, help_text='Если пусто, используется обычный заголовок страницы.', max_length=255, verbose_name='SEO заголовок (title)'),
        ),
        migrations.AddField(
            model_name='legalpagetranslation',
            name='seo_description',
            field=models.TextField(blank=True, help_text='Рекомендуется 140-160 символов.', verbose_name='SEO описание (description)'),
        ),
        migrations.AddField(
            model_name='legalpagetranslation',
            name='seo_title',
            field=models.CharField(blank=True, help_text='Если пусто, используется обычный заголовок страницы.', max_length=255, verbose_name='SEO заголовок (title)'),
        ),
        migrations.AddField(
            model_name='newstranslation',
            name='seo_description',
            field=models.TextField(blank=True, help_text='Рекомендуется 140-160 символов.', verbose_name='SEO описание (description)'),
        ),
        migrations.AddField(
            model_name='newstranslation',
            name='seo_title',
            field=models.CharField(blank=True, help_text='Если пусто, используется обычный заголовок страницы.', max_length=255, verbose_name='SEO заголовок (title)'),
        ),
        migrations.AddField(
            model_name='promotranslation',
            name='seo_description',
            field=models.TextField(blank=True, help_text='Рекомендуется 140-160 символов.', verbose_name='SEO описание (description)'),
        ),
        migrations.AddField(
            model_name='promotranslation',
            name='seo_title',
            field=models.CharField(blank=True, help_text='Если пусто, используется обычный заголовок страницы.', max_length=255, verbose_name='SEO заголовок (title)'),
        ),
        migrations.AddField(
            model_name='servicetranslation',
            name='seo_description',
            field=models.TextField(blank=True, help_text='Рекомендуется 140-160 символов.', verbose_name='SEO описание (description)'),
        ),
        migrations.AddField(
            model_name='servicetranslation',
            name='seo_title',
            field=models.CharField(blank=True, help_text='Если пусто, используется обычный заголовок страницы.', max_length=255, verbose_name='SEO заголовок (title)'),
        ),
    ]

