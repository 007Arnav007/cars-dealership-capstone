from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("djangoapp/", include("djangoapp.urls")),
    path("about/", TemplateView.as_view(template_name="About.html"), name="about"),
    path("contact/", TemplateView.as_view(template_name="Contact.html"), name="contact"),
    # React single-page routes (index.html comes from frontend/build)
    path("", TemplateView.as_view(template_name="index.html")),
    path("dealers/", TemplateView.as_view(template_name="index.html")),
    path("login/", TemplateView.as_view(template_name="index.html")),
    path("register/", TemplateView.as_view(template_name="index.html")),
    path("dealer/<int:dealer_id>", TemplateView.as_view(template_name="index.html")),
    path("postreview/<int:dealer_id>", TemplateView.as_view(template_name="index.html")),
]
