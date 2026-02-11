from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0002_promo_portfolio'),
    ]

    operations = [
        migrations.CreateModel(
            name='PortfolioItemImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to='portfolio/gallery/')),
                ('image_url', models.URLField(blank=True, help_text='Если не загружаете файл')),
                ('order', models.PositiveIntegerField(default=0)),
                ('portfolio_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='content.portfolioitem')),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
    ]
