import json, random
random.seed(7)
places = [
("Topeka","Kansas","KS","39.0473","-95.6752"),("Wichita","Kansas","KS","37.6872","-97.3301"),
("Overland Park","Kansas","KS","38.9822","-94.6708"),("Kansas City","Kansas","KS","39.1142","-94.6275"),
("Lawrence","Kansas","KS","38.9717","-95.2353"),("Salina","Kansas","KS","38.8403","-97.6114"),
("El Paso","Texas","TX","31.7619","-106.4850"),("Austin","Texas","TX","30.2672","-97.7431"),
("Dallas","Texas","TX","32.7767","-96.7970"),("Houston","Texas","TX","29.7604","-95.3698"),
("Los Angeles","California","CA","34.0522","-118.2437"),("San Diego","California","CA","32.7157","-117.1611"),
("Sacramento","California","CA","38.5816","-121.4944"),("New York","New York","NY","40.7128","-74.0060"),
("Buffalo","New York","NY","42.8864","-78.8784"),("Miami","Florida","FL","25.7617","-80.1918"),
("Orlando","Florida","FL","28.5383","-81.3792"),("Chicago","Illinois","IL","41.8781","-87.6298"),
("Columbus","Ohio","OH","39.9612","-82.9988"),("Cleveland","Ohio","OH","41.4993","-81.6944"),
("Seattle","Washington","WA","47.6062","-122.3321"),("Denver","Colorado","CO","39.7392","-104.9903"),
("Atlanta","Georgia","GA","33.7490","-84.3880"),("Phoenix","Arizona","AZ","33.4484","-112.0740"),
("Boston","Massachusetts","MA","42.3601","-71.0589"),
]
names = ["Holdlamis","Temp","Sub-Ex","Bytecard","Zontrax","Stronghold","Fixflex","Opela","Tresom","Alphazap",
"Regrant","Konklab","Lotstring","Ronstring","Namfix","Transcof","Quo Lux","Cardguard","Toughjoyfax","Zamit",
"Y-Solowarm","Biodex","Andalax","Mat Lam Tam","Veribet"]
streets = ["Nova Court","Maple Avenue","Cedar Lane","Highland Drive","Lakeview Road","Sunset Boulevard","Oak Street","Prairie Way","Union Parkway","Riverside Drive"]
dealers=[]
for i in range(50):
    c=places[i%len(places)]
    n=names[i%len(names)]+("" if i<len(names) else " Motors")
    dealers.append({"id":i+1,"city":c[0],"state":c[1],"st":c[2],"address":f"{random.randint(1,999)} {random.choice(streets)}",
      "zip":str(random.randint(10000,99999)),"lat":c[3],"long":c[4],"short_name":n,"full_name":f"{n} Car Dealership"})
pos=["Fantastic service and a very friendly sales team!","Great experience, the car was exactly as described.","Best dealership I have visited. Smooth and fast paperwork.","Excellent prices and a wonderful staff. Highly recommend.","Loved the test drive, the staff was patient and helpful."]
neg=["Terrible experience, the staff was rude and pushy.","Waited three hours and the car was not ready. Disappointed.","Overpriced and the service department never called back.","Hidden fees everywhere. I would not recommend this place."]
neu=["Average dealership, nothing special but nothing wrong either.","Decent selection of cars. The process took a while.","It was okay. Prices were fair, service was average."]
cars=[("Toyota","Camry"),("Toyota","RAV4"),("Honda","Civic"),("Honda","CR-V"),("Nissan","Altima"),("Ford","F-150"),("Chevrolet","Malibu"),("Kia","Sportage"),("Hyundai","Elantra"),("Subaru","Outback")]
people=["Alex Morgan","Priya Shah","Jordan Lee","Sam Rivera","Chris Walker","Taylor Brooks","Maria Gomez","Daniel Kim","Aisha Khan","Ethan Clark"]
reviews=[]; rid=1
for d in dealers:
    for _ in range(2):
        t=random.choice([pos,pos,neg,neu]); mk,md=random.choice(cars); bought=random.random()<.8
        reviews.append({"id":rid,"name":random.choice(people),"dealership":d["id"],"review":random.choice(t),"purchase":bought,
          "purchase_date":f"{random.randint(1,12):02d}/{random.randint(1,28):02d}/{random.randint(2019,2023)}" if bought else "",
          "car_make":mk if bought else "","car_model":md if bought else "","car_year":random.randint(2015,2023) if bought else ""})
        rid+=1
json.dump({"dealerships":dealers},open("database/data/dealerships.json","w"),indent=2)
json.dump({"reviews":reviews},open("database/data/reviews.json","w"),indent=2)
print(len(dealers),len(reviews),sum(d["state"]=="Kansas" for d in dealers))
