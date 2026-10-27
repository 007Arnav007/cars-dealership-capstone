import json
import logging

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .populate import initiate
from .restapis import analyze_review_sentiments, get_request, post_review

logger = logging.getLogger(__name__)


@csrf_exempt
def login_user(request):
    data = json.loads(request.body)
    username = data["userName"]
    user = authenticate(username=username, password=data["password"])
    response = {"userName": username}
    if user is not None:
        login(request, user)
        response = {"userName": username, "status": "Authenticated"}
    return JsonResponse(response)


def logout_request(request):
    logout(request)
    return JsonResponse({"userName": ""})


@csrf_exempt
def registration(request):
    data = json.loads(request.body)
    username = data["userName"]
    if User.objects.filter(username=username).exists():
        return JsonResponse({"userName": username, "error": "Already Registered"})
    user = User.objects.create_user(
        username=username, first_name=data.get("firstName", ""), last_name=data.get("lastName", ""),
        password=data["password"], email=data.get("email", ""))
    login(request, user)
    return JsonResponse({"userName": username, "status": "Authenticated"})


def get_cars(request):
    if CarMake.objects.count() == 0:
        initiate()
    cars = [{"CarModel": m.name, "CarMake": m.car_make.name}
            for m in CarModel.objects.select_related("car_make")]
    return JsonResponse({"CarModels": cars})


def get_dealerships(request, state="All"):
    endpoint = "/fetchDealers" if state == "All" else f"/fetchDealers/{state}"
    return JsonResponse({"status": 200, "dealers": get_request(endpoint)})


def get_dealer_details(request, dealer_id):
    return JsonResponse({"status": 200, "dealer": get_request(f"/fetchDealer/{dealer_id}")})


def get_dealer_reviews(request, dealer_id):
    reviews = get_request(f"/fetchReviews/dealer/{dealer_id}") or []
    for review in reviews:
        review["sentiment"] = analyze_review_sentiments(review["review"]).get("sentiment")
    return JsonResponse({"status": 200, "reviews": reviews})


@csrf_exempt
def add_review(request):
    if request.user.is_anonymous:
        return JsonResponse({"status": 403, "message": "Unauthorized"})
    try:
        post_review(json.loads(request.body))
        return JsonResponse({"status": 200})
    except Exception as err:
        logger.error(err)
        return JsonResponse({"status": 401, "message": "Error in posting review"})
