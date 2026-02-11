# Generated manually - remove News and NewsTranslation models

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0011_alter_news_options_alter_portfolioitem_options_and_more'),
    ]

    operations = [
        migrations.DeleteModel(name='NewsTranslation'),
        migrations.DeleteModel(name='News'),
    ]
