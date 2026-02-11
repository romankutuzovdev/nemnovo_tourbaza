# Generated manually for Review model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0009_single_how_to_get_route'),
    ]

    operations = [
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author', models.CharField(max_length=200, verbose_name='Автор')),
                ('text', models.TextField(verbose_name='Текст отзыва')),
                ('rating', models.PositiveSmallIntegerField(
                    choices=[(1, '1 из 5'), (2, '2 из 5'), (3, '3 из 5'), (4, '4 из 5'), (5, '5 из 5')],
                    default=5,
                    verbose_name='Оценка (звёзды)',
                )),
                ('order', models.PositiveIntegerField(default=0, verbose_name='Порядок')),
                ('is_published', models.BooleanField(default=True, verbose_name='Опубликован')),
            ],
            options={
                'verbose_name': 'Отзыв',
                'verbose_name_plural': 'Отзывы',
                'ordering': ['order', 'id'],
            },
        ),
    ]
