from django.urls import path
from . import views

urlpatterns = [
    path('company-info/', views.company_info),
    path('contact/', views.contact_submit),
    path('how-to-get/', views.how_to_get),
    path('partners/', views.partner_list),
    path('services/', views.service_list),
    path('services/<slug:slug>/', views.service_detail),
    path('events/', views.event_list),
    path('events/<slug:slug>/', views.event_detail),
    path('news/', views.news_list),
    path('news/<slug:slug>/', views.news_detail),
    path('promos/', views.promo_list),
    path('promos/<slug:slug>/', views.promo_detail),
    path('hot-offers/', views.hot_offer_list),
    path('portfolio/', views.portfolio_list),
    path('portfolio/<slug:slug>/', views.portfolio_detail),
    path('portfolio/<slug:slug>/download/', views.portfolio_download),
    path('reviews/', views.review_list),
]
