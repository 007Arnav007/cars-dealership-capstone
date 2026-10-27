import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Dealers() {
  const [params, setParams] = useSearchParams();
  const state = params.get("state") || "All";
  const [dealers, setDealers] = useState([]);
  const [states, setStates] = useState([]);
  const loggedIn = !!sessionStorage.getItem("username");

  useEffect(() => {
    fetch("/djangoapp/get_dealers").then((r) => r.json()).then((j) => {
      setStates([...new Set((j.dealers || []).map((d) => d.state))].sort());
    });
  }, []);

  useEffect(() => {
    const url = state === "All" ? "/djangoapp/get_dealers" : `/djangoapp/get_dealers/${state}`;
    fetch(url).then((r) => r.json()).then((j) => setDealers(j.dealers || []));
  }, [state]);

  return (
    <div className="card-box">
      <h3 className="mb-3">Dealerships</h3>
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>ID</th><th>Dealer Name</th><th>City</th><th>Address</th><th>Zip</th>
            <th>
              <select className="form-select form-select-sm" value={state}
                onChange={(e) => setParams(e.target.value === "All" ? {} : { state: e.target.value })}>
                <option value="All">State (All)</option>
                {states.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </th>
            {loggedIn && <th>Review Dealer</th>}
          </tr>
        </thead>
        <tbody>
          {dealers.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td><a href={`/dealer/${d.id}`}>{d.full_name}</a></td>
              <td>{d.city}</td><td>{d.address}</td><td>{d.zip}</td><td>{d.state}</td>
              {loggedIn && (
                <td><a className="btn btn-sm btn-outline-primary" href={`/postreview/${d.id}`}>Review Dealer</a></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
