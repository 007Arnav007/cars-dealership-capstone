import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EMOJI = { positive: "😊", negative: "😠", neutral: "😐" };

export default function Dealer() {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState(null);
  const loggedIn = !!sessionStorage.getItem("username");

  useEffect(() => {
    fetch(`/djangoapp/dealer/${id}`).then((r) => r.json()).then((j) => setDealer((j.dealer || [])[0]));
    fetch(`/djangoapp/reviews/dealer/${id}`).then((r) => r.json()).then((j) => setReviews(j.reviews || []));
  }, [id]);

  return (
    <div>
      {dealer && (
        <div className="card-box mb-3 d-flex justify-content-between align-items-center">
          <div>
            <h3>{dealer.full_name}</h3>
            <div className="text-muted">{dealer.address}, {dealer.city}, {dealer.state} {dealer.zip}</div>
          </div>
          {loggedIn && <a className="btn btn-primary" href={`/postreview/${id}`}>Post Review</a>}
        </div>
      )}
      <h4>Reviews</h4>
      {reviews === null && <p>Loading...</p>}
      {reviews && reviews.length === 0 && <p>No reviews yet!</p>}
      {reviews && reviews.map((r) => (
        <div className="card-box mb-2" key={r.id}>
          <span className="fs-4 me-2">{EMOJI[r.sentiment] || "😐"}</span>
          <strong>{r.name}</strong> <span className="badge bg-secondary">{r.sentiment}</span>
          <p className="mb-1 mt-2">{r.review}</p>
          {r.purchase && <small className="text-muted">{r.car_make} {r.car_model} {r.car_year}</small>}
        </div>
      ))}
    </div>
  );
}
