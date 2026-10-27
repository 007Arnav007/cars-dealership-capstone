from .models import CarMake, CarModel

CARS = {
    "Toyota": [("Camry", "SEDAN", 2023), ("RAV4", "SUV", 2022), ("Corolla", "SEDAN", 2021)],
    "Honda": [("Civic", "SEDAN", 2023), ("CR-V", "SUV", 2022), ("Accord", "SEDAN", 2020)],
    "Nissan": [("Altima", "SEDAN", 2023), ("Rogue", "SUV", 2022), ("Sentra", "SEDAN", 2021)],
    "Ford": [("F-150", "SUV", 2023), ("Escape", "SUV", 2022), ("Fusion", "SEDAN", 2019)],
    "Chevrolet": [("Malibu", "SEDAN", 2022), ("Equinox", "SUV", 2023), ("Traverse", "SUV", 2021)],
    "Kia": [("Sportage", "SUV", 2023), ("Optima", "SEDAN", 2020), ("Sorento", "SUV", 2022)],
    "Hyundai": [("Elantra", "SEDAN", 2023), ("Tucson", "SUV", 2022), ("Sonata", "SEDAN", 2021)],
    "Subaru": [("Outback", "WAGON", 2023), ("Forester", "SUV", 2022), ("Impreza", "SEDAN", 2021)],
}


def initiate():
    for make_name, models_ in CARS.items():
        make = CarMake.objects.create(
            name=make_name, description=f"{make_name} vehicles sold at Cars Dealership")
        for name, car_type, year in models_:
            CarModel.objects.create(car_make=make, name=name, type=car_type, year=year, dealer_id=0)
