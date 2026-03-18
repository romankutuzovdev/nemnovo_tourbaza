# Подарочный сертификат: картинка и переводы title/content

from django.db import migrations, models
import django.db.models.deletion
import django_ckeditor_5.fields


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0047_ensure_about_content_records'),
    ]

    operations = [
        migrations.CreateModel(
            name='CertificateContent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to='certificate/')),
                ('image_url', models.URLField(blank=True, help_text='URL картинки, если не загружаете файл')),
            ],
            options={
                'verbose_name': 'Подарочный сертификат',
                'verbose_name_plural': 'Подарочный сертификат',
            },
        ),
        migrations.CreateModel(
            name='CertificateContentTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('title', models.CharField(blank=True, max_length=300, verbose_name='Заголовок')),
                ('content', django_ckeditor_5.fields.CKEditor5Field(blank=True, config_name='default', verbose_name='Описание')),
                ('certificate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.certificatecontent')),
            ],
            options={
                'ordering': ['certificate', 'locale'],
                'unique_together': {('certificate', 'locale')},
            },
        ),
    ]
