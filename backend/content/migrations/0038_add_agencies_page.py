from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0037_add_legal_page'),
    ]

    operations = [
        migrations.CreateModel(
            name='AgenciesPage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'verbose_name': 'Страница агентств',
                'verbose_name_plural': 'Страница агентств',
            },
        ),
        migrations.CreateModel(
            name='AgenciesPageTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(
                    choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')],
                    max_length=5,
                )),
                ('title', models.CharField(blank=True, max_length=300, verbose_name='Заголовок')),
                ('intro', models.TextField(blank=True, verbose_name='Введение')),
                ('why_title', models.CharField(blank=True, max_length=300, verbose_name='Заголовок раздела «Почему мы»')),
                ('why_items', models.TextField(
                    blank=True,
                    help_text='Каждое преимущество — на отдельной строке.',
                    verbose_name='Преимущества (каждое с новой строки)',
                )),
                ('how_title', models.CharField(blank=True, max_length=300, verbose_name='Заголовок раздела «Как начать»')),
                ('how_intro', models.TextField(blank=True, verbose_name='Текст перед шагами')),
                ('how_steps', models.TextField(
                    blank=True,
                    help_text='Каждый шаг — на отдельной строке.',
                    verbose_name='Шаги сотрудничества (каждый с новой строки)',
                )),
                ('how_outro', models.TextField(blank=True, verbose_name='Текст после шагов')),
                ('cta_title', models.CharField(blank=True, max_length=300, verbose_name='Заголовок CTA блока')),
                ('contact1_label', models.CharField(blank=True, max_length=200, verbose_name='Контакт 1 — должность')),
                ('contact1_phone', models.CharField(blank=True, max_length=50, verbose_name='Контакт 1 — телефон')),
                ('contact2_label', models.CharField(blank=True, max_length=200, verbose_name='Контакт 2 — должность')),
                ('contact2_phone', models.CharField(blank=True, max_length=50, verbose_name='Контакт 2 — телефон')),
                ('page', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='translations',
                    to='content.agenciespage',
                )),
            ],
            options={
                'verbose_name': 'Перевод страницы агентств',
                'verbose_name_plural': 'Переводы страницы агентств',
                'ordering': ['page', 'locale'],
                'unique_together': {('page', 'locale')},
            },
        ),
    ]
