import axios from 'axios';
import { Base_URL, defaultPhoto } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeFeed } from '../utils/feedSlice';
import { useState } from 'react';

const Card = ({ data, className = "" }) => {
  const dispatch = useDispatch();
  const { firstName, lastName, gender, age, about, photoUrl, _id } = data;
  const [swipeDirection, setSwipeDirection] = useState(null);

  const handleAction = async (status, id, direction) => {
    try {
      // Trigger a quick swipe animation
      setSwipeDirection(direction);

      // Let the animation play before updating the feed
      setTimeout(() => {
        dispatch(removeFeed(id));
      }, 250);

      await axios.post(
        `${Base_URL}/request/${status}/${id}`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.log(err);
      // If needed, we could roll back the UI change here.
    } finally {
      setSwipeDirection(null);
    }
  };

  return (
    <div className={`flex justify-center mt-10 px-2 sm:px-4 ${className}`}>
      <div
        className={`card bg-base-300 w-full sm:w-80 md:w-96 shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300
        ${swipeDirection === "left" ? "animate-swipe-left" : ""}
        ${swipeDirection === "right" ? "animate-swipe-right" : ""}`}
      >
        {/* User Photo */}
        <figure className="overflow-hidden rounded-t-xl">
          <img
            className="w-full h-48 object-cover"
            src={photoUrl || defaultPhoto}
            alt={`${firstName} ${lastName}`}
          />
        </figure>

        {/* Card Body */}
        <div className="card-body p-4 flex flex-col justify-between h-64">
          {/* Name, Gender & Age */}
          <div className="flex justify-between items-center">
            <h2 className="card-title text-lg font-bold">{firstName} {lastName || ""}</h2>
            <span className="text-sm text-gray-500">
              {gender || "Gender"} ▪ {age || "--"} Years
            </span>
          </div>

          {/* About section */}
          <p className="text-sm text-gray-700 mt-3 line-clamp-4">{about || "No description available."}</p>

          {/* Action buttons */}
          <div className="card-actions flex justify-center gap-4 mt-4">
            <button
              className="btn btn-outline btn-secondary w-24"
              onClick={() => handleAction("ignored", _id, "left")}
            >
              Ignore
            </button>
            <button
              className="btn btn-primary w-24"
              onClick={() => handleAction("interested", _id, "right")}
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
