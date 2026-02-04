import axios from "axios";
import Card from "./Card";
import { useState, useEffect } from "react";
import { Base_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ data }) => {
  const dispatch = useDispatch();
  const updatedUser = useSelector((store) => store.user);


  const [firstName, setFirstName] = useState(data.firstName || "");
  const [lastName, setLastName] = useState(data.lastName || "");
  const [age, setAge] = useState(data.age || "");
  const [bio, setBio] = useState(data.about || "");
  const [gender, setGender] = useState(data.gender || "");
  const [photoUrl, setPhotoUrl] = useState(data.photoUrl || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);



  useEffect(() => {
    if (updatedUser) {
      setFirstName(updatedUser.firstName || "");
      setLastName(updatedUser.lastName || "");
      setAge(updatedUser.age || "");
      setBio(updatedUser.about || "");
      setGender(updatedUser.gender || "");
      setPhotoUrl(updatedUser.photoUrl || "");
    }
  }, [updatedUser]);

  const saveProfile = async () => {
    if (!gender) {
      setError("Please select your gender before saving.");
      return;
    }

    try {
      const res = await axios.patch(
        Base_URL + "/profile/update",
        {
          firstName,
          lastName,
          age,
          about: bio,
          gender,
          photoUrl,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.updateUser));
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.log("Update error:", err);
      setError(err?.response?.data || err.message || "Failed to update profile");
    }
  };

  return (
    <>
      {showToast && (
        <div className="toast toast-top toast-center z-50 fixed">
          <div className="alert alert-success">
            <span>Profile updated successfully!</span>
          </div>
        </div>
      )}
      <div className="mx-36 pt-6 w-96">
        <h1 className="font-semibold text-green-500">Edit Profile Details</h1>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Name</legend>
          <input
            type="text"
            className="input"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            className="input"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Profile URL</legend>
          <input
            type="text"
            className="input"
            placeholder="Enter the URL"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
        </fieldset>

        <div className="flex w-50 gap-15">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Age</legend>
            <input
              type="number"
              className="input w-25"
              placeholder="Enter Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Gender</legend>
            <select
              value={gender}
              className="select w-25"
              onChange={(e) => {
                setGender(e.target.value);
                setError("");
              }}
            >
              <option value="" disabled>
                Choose your gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </fieldset>
        </div>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">About</legend>
          <textarea
            className="textarea"
            placeholder="Write your bio in not more than 250 words"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </fieldset>

        <div className="pt-5 ml-28 relative">
          <button className="btn btn-outline btn-success" onClick={saveProfile}>
            Save
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-center mt-2">
            Error updating profile: {error}
          </p>
        )}
      </div>


      <Card
        data={{ firstName, lastName, about: bio, age, gender, photoUrl }}
        className="!ml-24"
      />
    </>
  );
};

export default EditProfile;
