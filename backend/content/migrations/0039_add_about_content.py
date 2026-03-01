from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0038_add_agencies_page'),
    ]

    operations = [
        migrations.CreateModel(
            name='AboutContent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'verbose_name': 'Блок «О нас»',
                'verbose_name_plural': 'Блок «О нас»',
            },
        ),
        migrations.CreateModel(
            name='AboutContentTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(
                    choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')],
                    max_length=5,
                )),
                ('title', models.CharField(blank=True, max_length=300, verbose_name='Заголовок')),
                ('paragraphs', models.TextField(
                    blank=True,
                    help_text='Абзацы разделяются пустой строкой (\\n\\n).',
                    verbose_name='Текст (абзацы)',
                )),
                ('about', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='translations',
                    to='content.aboutcontent',
                )),
            ],
            options={
                'verbose_name': 'Перевод блока «О нас»',
                'verbose_name_plural': 'Переводы блока «О нас»',
                'ordering': ['about', 'locale'],
                'unique_together': {('about', 'locale')},
            },
        ),
    ]
