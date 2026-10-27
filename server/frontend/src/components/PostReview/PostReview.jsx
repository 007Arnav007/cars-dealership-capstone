import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const YEARS = [];
for (let y = 2023; y >= 2015; y--) YEARS.push(y);

export default function PostReview() {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [cars, setCars] = useState([]);
  const [review, setReview] = useState("");
  const [purchase, setPurchase] = useState(false);
  const [date, setDate] = useState("");
  const [car, setCar] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    fetch(`/djangoapp/dealer/${id}`).then((r) => r.json()).then((j) => setDealer((j.dealer || [])[0]));
    fetch("/djangoapp/get_cars").then((r) => r.json()).then((j) => setCars(j.CarModels || []));
  }, [id]);

  const submit = async () => {
    const [make, model] = car.split("|");
    const payload = {
      name: sessionStorage.getItem("username"), dealership: Number(id), review, purchase,
      purchase_date: date, car_make: make, car_model: model, car_year: year,
    };
    const res = await fetch("/djangoapp/add_review", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.status === 200) window.location.href = `/dealer/${id}`;
    else alert("Could not post review. Are you logged in?");
  };

  return (
    <div className="card-box mx-auto" style={{ maxWidth: 640 }}>
      <h3>{dealer ? dealer.full_name : "Dealer"}</h3>
      <label className="mt-3 fw-bold">Review</label>
      <textarea className="form-control mb-3" rows="4" value={review} onChange={(e) => setReview(e.target.value)} />
      <div className="form-check mb-3">
        <input className="form-check-input" type="checkbox" id="p" checked={purchase}
          onChange={(e) => setPurchase(e.target.checked)} />
        <label className="form-check-label" htmlFor="p">Purchased a car from this dealer</label>
      </div>
      <label className="fw-bold">Purchase Date</label>
      <input type="date" className="form-control mb-3" value={date} onChange={(e) => setDate(e.target.value)} />
      <label className="fw-bold">Car Make and Model</label>
      <select className="form-select mb-3" value={car} onChange={(e) => setCar(e.target.value)}>
        <option value="">Choose Car Make and Model</option>
        {cars.map((c, i) => (
          <option key={i} value={`${c.CarMake}|${c.CarModel}`}>{c.CarMake} {c.CarModel}</option>
        ))}
      </select>
      <label className="fw-bold">Car Year</label>
      <select className="form-select mb-3" value={year} onChange={(e) => setYear(e.target.value)}>
        <option value="">Select year</option>
        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
      <button className="btn btn-primary" onClick={submit}>Post Review</button>
    </div>
  );
}
