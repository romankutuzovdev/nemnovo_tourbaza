# Add place field to AboutContent: main (главная) vs about (страница о нас)

from django.db import migrations, models


def set_place_for_existing(apps, schema_editor):
    AboutContent = apps.get_model('content', 'AboutContent')
    items = list(AboutContent.objects.all().order_by('id'))
    if not items:
        return
    if len(items) == 1:
        items[0].place = 'main'
        items[0].save()
    else:
        items[0].place = 'main'
        items[0].save()
        items[1].place = 'about'
        items[1].save()
        for item in items[2:]:
            item.delete()


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0040_add_service_sections_documents_questions'),
    ]

    operations = [
        migrations.AddField(
            model_name='aboutcontent',
            name='place',
            field=models.CharField(
                choices=[('main', 'Главная страница'), ('about', 'Страница «О нас»')],
                max_length=20,
                null=True,
                verbose_name='Где показывать',
            ),
        ),
        migrations.RunPython(set_place_for_existing, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='aboutcontent',
            name='place',
            field=models.CharField(
                choices=[('main', 'Главная страница'), ('about', 'Страница «О нас»')],
                default='main',
                max_length=20,
                unique=True,
                verbose_name='Где показывать',
            ),
        ),
        migrations.AlterModelOptions(
            name='aboutcontent',
            options={'ordering': ['place'], 'verbose_name': 'Блок «О нас»', 'verbose_name_plural': 'Блок «О нас»'},
        ),
    ]
