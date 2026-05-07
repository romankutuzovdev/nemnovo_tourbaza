from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0057_merge_0056_branches'),
    ]

    operations = [
        migrations.AddField(
            model_name='serviceorderitem',
            name='variant_name',
            field=models.CharField(blank=True, max_length=200, verbose_name='Вариант'),
        ),
        migrations.AddField(
            model_name='servicevariant',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='Цена'),
        ),
    ]
