import os

from django.db.models.signals import post_save
from django.dispatch import receiver

from .image_optimization import OptimizeOptions, optimize_image_bytes, should_optimize
from .models import (
    AboutContent,
    CertificateContent,
    Event,
    HeroContent,
    HotOffer,
    News,
    Partner,
    PortfolioItem,
    PortfolioItemImage,
    Promo,
    Service,
    ServiceImage,
)


def _optimize_field_file(instance, field_name: str):
    field = getattr(instance, field_name, None)
    if not field or not getattr(field, 'name', None):
        return
    try:
        path = field.path
        if not path or not os.path.exists(path):
            return
        raw = open(path, 'rb').read()
        optimized, _ = optimize_image_bytes(filename=field.name, data=raw, options=OptimizeOptions())
        if not should_optimize(original_size=len(raw), optimized_size=len(optimized)):
            return
        tmp = path + '.opt_tmp'
        with open(tmp, 'wb') as fp:
            fp.write(optimized)
        os.replace(tmp, path)
    except Exception:
        return


@receiver(post_save, sender=Service)
def _opt_service(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=ServiceImage)
def _opt_service_image(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=Event)
def _opt_event(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=News)
def _opt_news(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=Promo)
def _opt_promo(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=HotOffer)
def _opt_hot_offer(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=PortfolioItem)
def _opt_portfolio(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=PortfolioItemImage)
def _opt_portfolio_image(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=Partner)
def _opt_partner(sender, instance, **kwargs):
    _optimize_field_file(instance, 'logo')


@receiver(post_save, sender=HeroContent)
def _opt_hero(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=CertificateContent)
def _opt_certificate(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=AboutContent)
def _opt_about_presentation(sender, instance, **kwargs):
    # only image fields should be optimized; AboutContent currently has file/video fields only.
    return

