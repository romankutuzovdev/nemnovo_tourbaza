from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0051_reviewsstatscontent_reviewsstatscontenttranslation'),
    ]

    operations = [
        migrations.AddField(
            model_name='aboutcontent',
            name='presentation_pdf',
            field=models.FileField(blank=True, help_text='PDF-файл для кнопки скачивания под видео на странице «О нас».', null=True, upload_to='about/presentation/', verbose_name='PDF презентации'),
        ),
    ]
