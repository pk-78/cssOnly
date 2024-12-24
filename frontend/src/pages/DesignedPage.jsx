import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import url from "../url";

export default function DesignedPage() {
  const [data, setData] = useState(null);

  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${url}/api/submit/${id}`);
      console.log(response);
      setData(response?.data?.formData);
    };
    fetchData();
  }, [id]);

  return (
    <div className="banner">
      <div className="slider" style={{ "--quantity": data?.images.length }}>
        {data?.images?.map((image, index) => (
          <div key={index} className="item" style={{ "--position": index + 1 }}>
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="content">
        <h1 data-content="PK 78">PK 78</h1>
        <div className="author">
          <h2>{data?.name}</h2>
          <p>
            <b>{data?.forWhom}</b>
          </p>
          <p>Made with love by pk78</p>
        </div>
        <div className="model"></div>
      </div>
    </div>
  );
}
