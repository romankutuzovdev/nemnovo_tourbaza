from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0036_add_hero_content'),
    ]

    operations = [
        migrations.CreateModel(
            name='LegalPage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('page_key', models.CharField(
                    choices=[
                        ('privacy', 'Политика обработки персональных данных'),
                        ('cookie-policy', 'Политика в отношении обработки cookie'),
                    ],
                    max_length=50,
                    unique=True,
                    verbose_name='Идентификатор',
                )),
            ],
            options={
                'verbose_name': 'Юридическая страница',
                'verbose_name_plural': 'Юридические страницы',
            },
        ),
        migrations.CreateModel(
            name='LegalPageTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(
                    choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')],
                    max_length=5,
                )),
                ('title', models.CharField(max_length=300, verbose_name='Заголовок')),
                ('content', models.TextField(
                    help_text='Абзацы разделяются пустой строкой (двойной перевод строки \\n\\n).',
                    verbose_name='Содержание',
                )),
                ('page', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='translations',
                    to='content.legalpage',
                )),
            ],
            options={
                'verbose_name': 'Перевод юридической страницы',
                'verbose_name_plural': 'Переводы юридических страниц',
                'ordering': ['page', 'locale'],
                'unique_together': {('page', 'locale')},
            },
        ),
    ]
